import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Readable } from "stream";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
];

/**
 * Cleans and processes the private key from the environment variable.
 */
function cleanPrivateKey(rawKey: string): string {
  const attempts = [
    rawKey.replace(/\\n/g, "\n"), // Replace escaped newlines
    rawKey.replace(/\\n/g, "\n").replace(/^"/, "").replace(/"$/, ""), // Remove leading/trailing quotes
    rawKey.trim(), // Remove extra whitespace
    rawKey.replace(/\r/g, ""), // Remove carriage returns
  ];

  const validKey = attempts.find((key) =>
    key.includes("-----BEGIN PRIVATE KEY-----") && key.includes("-----END PRIVATE KEY-----")
  );

  if (!validKey) {
    throw new Error("Invalid private key format");
  }

  return validKey;
}

export async function POST(req: Request) {
  try {
    const { data, photoFile, cvFile, digitalSignature } = await req.json();

    if (!data || !data.fullName || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields: fullName or email" },
        { status: 400 }
      );
    }

    const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY || "";
    const privateKey = cleanPrivateKey(privateKeyRaw);

    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      privateKey,
      SCOPES
    );

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    async function uploadFile(file: { name: string; type: string; base64: string }): Promise<string> {
      const buffer = Buffer.from(file.base64, "base64");
      const stream = Readable.from(buffer);

      const response = await drive.files.create({
        requestBody: {
          name: file.name || "Untitled",
          parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
        },
        media: {
          mimeType: file.type || "application/octet-stream",
          body: stream,
        },
      });

      const fileId = response.data.id;

      if (!fileId) throw new Error("File ID is undefined or null.");

      await drive.permissions.create({
        fileId,
        requestBody: { role: "reader", type: "anyone" },
      });

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
      signatureLink,
      data.keyArea || "",
      data.position || "",
      data.gender || "",
      data.allergies || "",
      data.allergiesDetails || "",
      data.chronicIllness || "",
      data.expectations || "",
      data.state || "", // New: State field
      data.planetChoice || "", // New: Planet choice field
      data.planetReason || "", // New: Reason for planet choice
      data.conferenceLookingForward || "", // New: What they're looking forward to
      data.conferenceExpectations || "", // New: Expectations from the chair
      data.hasBusinessIdea || "", // New: "Yes" or "No" answer
      data.businessIdeaDetails || "", // New: Details about the business idea
    ];

    // Insert into Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID!,
      range: `${process.env.GOOGLE_SHEET_NAME || "Sheet1"}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    });

    return NextResponse.json({ message: "Data successfully uploaded to Google Sheets!" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error:", errorMessage);
    return NextResponse.json(
      { error: `Failed to process request: ${errorMessage}` },
      { status: 500 }
    );
  }
}