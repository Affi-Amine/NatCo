import { google } from "googleapis";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { Readable } from "stream";

const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
];
const SPREADSHEET_ID = "1ogSwiJsdgy9vl1Mqdw5_u9RM-K3-HnDIqw9BbpvOF2U"; // Replace with your actual Google Sheet ID
const SHEET_NAME = "Feuille 1"; // Replace with the exact sheet name (case-sensitive)

// Helper function to extract error messages
function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }
    return "An unknown error occurred";
}

export async function POST(req: Request) {
    try {
        const { data, photoFile, cvFile } = await req.json();

        // Validate required fields
        if (!data || !data.fullName || !data.email) {
            return NextResponse.json(
                { error: "Missing required fields: fullName or email" },
                { status: 400 }
            );
        }

        // Authenticate with Google APIs
        const keyFilePath = path.join(process.cwd(), "keys", "natco-442515-524fa895e87a.json");
        const keyFile = JSON.parse(fs.readFileSync(keyFilePath, "utf8"));

        const auth = new google.auth.JWT(
            keyFile.client_email,
            undefined,
            keyFile.private_key,
            SCOPES
        );

        const drive = google.drive({ version: "v3", auth });
        const sheets = google.sheets({ version: "v4", auth });

        // Upload files to Google Drive
        async function uploadFile(file: { name: string; type: string; base64: string }): Promise<string> {
            // Convert Base64 to a Buffer
            const buffer = Buffer.from(file.base64, "base64");
          
            // Create a readable stream from the Buffer
            const stream = Readable.from(buffer);
          
            // Upload file to Google Drive
            const response = await drive.files.create({
              requestBody: {
                name: file.name,
                parents: ["1q3crpE2wY-xWBS0R8UU49d2GI9R9nPnz"], // Replace with your folder ID
              },
              media: {
                mimeType: file.type,
                body: stream, // Use the readable stream
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
            data.keyArea || "",
            data.position || "",
            data.allergies || "",
            data.allergiesDetails || "",
            data.chronicIllness || "",
            data.expectations || "",
        ];

        // Append data to Google Sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${SHEET_NAME}!A1`,
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