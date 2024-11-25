import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
];

export async function POST(req: Request) {
    try {
        const { data, photoFile, cvFile, digitalSignature } = await req.json();

        // Validate required fields
        if (!data || !data.fullName || !data.email) {
            return NextResponse.json(
                { error: "Missing required fields: fullName or email" },
                { status: 400 }
            );
        }

        // Authenticate using environment variables
        const auth = new google.auth.JWT(
            process.env.GOOGLE_CLIENT_EMAIL, // From .env
            undefined,
            process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Replace escaped newlines
            SCOPES
        );

        const drive = google.drive({ version: "v3", auth });
        const sheets = google.sheets({ version: "v4", auth });

        // Function to upload a file to Google Drive
        async function uploadFile(file: { name: string; type: string; base64: string }): Promise<string> {
            const buffer = Buffer.from(file.base64, "base64");
            const stream = Readable.from(buffer);

            const response = await drive.files.create({
                requestBody: {
                    name: file.name ?? "Untitled", // Provide a default value if `file.name` is undefined
                    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!], // Assert it won't be undefined
                },
                media: {
                    mimeType: file.type ?? "application/octet-stream", // Provide a default MIME type
                    body: stream,
                },
            });

            const fileId = response.data.id;

            if (!fileId) {
                throw new Error("File ID is undefined or null.");
            }

            // Set file permissions
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: "reader",
                    type: "anyone",
                },
            });

            // Generate public link
            const fileResponse = await drive.files.get({
                fileId,
                fields: "webViewLink",
            });

            if (!fileResponse.data || !fileResponse.data.webViewLink) {
                throw new Error("Failed to retrieve public link for uploaded file.");
            }

            return fileResponse.data.webViewLink;
        }

        const photoLink = photoFile ? await uploadFile(photoFile) : "";
        const cvLink = cvFile ? await uploadFile(cvFile) : "";
        const signatureLink = digitalSignature ? await uploadFile(digitalSignature) : "";

        // Prepare row data with file links
        const rowData = [
            data.lc || "",
            data.fullName || "",
            data.email || "",
            data.cin || "",
            data.phoneNumber || "",
            data.emergencyNumber || "",
            data.dateOfBirth || "",
            photoLink,
            cvLink,
            signatureLink, // Add digital signature link
            data.keyArea || "",
            data.position || "",
            data.allergies || "",
            data.allergiesDetails || "",
            data.chronicIllness || "",
            data.expectations || "",
        ];

        // Append data to Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID, // Use spreadsheet ID from .env
            range: `${process.env.GOOGLE_SHEET_NAME}!A1`, // Use sheet name from .env
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [rowData],
            },
        });

        return NextResponse.json({ message: "Data and files uploaded successfully!" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error:", errorMessage);
        return NextResponse.json(
            { error: `Failed to process request: ${errorMessage}` },
            { status: 500 }
        );
    }
}