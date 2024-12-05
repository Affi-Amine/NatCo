import { google } from "googleapis";
import { NextResponse } from "next/server";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function POST(req: Request) {
  try {
    // Ensure all required environment variables are present
    const {
      GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_SPREADSHEET_ID,
      GOOGLE_PARTNERSHIPS_SHEET_NAME,
    } = process.env;

    console.log("GOOGLE_CLIENT_EMAIL:", process.env.GOOGLE_CLIENT_EMAIL ? "Loaded" : "Not Loaded");
    console.log("GOOGLE_PRIVATE_KEY Length:", process.env.GOOGLE_PRIVATE_KEY?.length || "Not Loaded");
    console.log("GOOGLE_SPREADSHEET_ID:", process.env.GOOGLE_SPREADSHEET_ID ? "Loaded" : "Not Loaded");
    console.log("GOOGLE_PARTNERSHIPS_SHEET_NAME:", process.env.GOOGLE_PARTNERSHIPS_SHEET_NAME ? "Loaded" : "Not Loaded");

    if (!GOOGLE_PRIVATE_KEY || !GOOGLE_CLIENT_EMAIL || !GOOGLE_SPREADSHEET_ID || !GOOGLE_PARTNERSHIPS_SHEET_NAME) {
      console.error("Missing one or more required environment variables.");
      return NextResponse.json(
        { error: "Server misconfiguration: Missing environment variables." },
        { status: 500 }
      );
    }



    // Sanitize private key
    const cleanPrivateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    console.log("Environment variables loaded successfully.");
    console.log("GOOGLE_SPREADSHEET_ID:", GOOGLE_SPREADSHEET_ID);
    console.log("GOOGLE_PARTNERSHIPS_SHEET_NAME:", GOOGLE_PARTNERSHIPS_SHEET_NAME);

    // Authenticate with Google API
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      cleanPrivateKey,
      SCOPES
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Parse incoming request data
    const { data } = await req.json();

    if (!data || !data.companyName || !data.contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields: companyName or contactEmail." },
        { status: 400 }
      );
    }

    // Prepare row data
    const rowData = [
      data.companyName || "",
      data.companyField || "",
      data.companySize || "",
      data.linkedinProfile || "",
      data.website || "",
      data.partnershipReason || "",
      data.contactName || "",
      data.contactEmail || "",
      data.contactPhone || "",
      data.contactPosition || "",
      new Date().toLocaleString(), // Timestamp
    ];

    console.log("Appending row to sheet:", rowData);

    // Append data to Google Sheet
    const range = `${GOOGLE_PARTNERSHIPS_SHEET_NAME}!A1`;
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    });

    console.log("Google Sheets response:", response.data);

    return NextResponse.json({
      message: "Partnership request submitted successfully!",
      updateDetails: response.data,
    });
  } catch (error) {
    console.error("An error occurred while processing the request:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        error: `Failed to process request: ${errorMessage}`,
        details: error instanceof Error ? error.stack : null,
      },
      { status: 500 }
    );
  }
}