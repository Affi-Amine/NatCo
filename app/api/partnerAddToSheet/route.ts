import {  google } from "googleapis";
import { NextResponse } from "next/server";
import { Pool } from "pg";

// Set up the required Google Sheets API scope
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// Set up PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

export async function POST(req: Request) {
  try {
    // Prepare private key with multiple cleaning attempts
    const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY || "";
    const cleanKeyAttempts = [
      privateKeyRaw.replace(/\\n/g, "\n"), // Replace escaped newlines
      privateKeyRaw.replace(/\\n/g, "\n").replace(/^"/, "").replace(/"$/, ""), // Remove quotes
      privateKeyRaw.trim(), // Remove whitespace
      privateKeyRaw.replace(/\r/g, ""), // Remove carriage returns
      privateKeyRaw, // Original key
    ];

    let auth;

    // Authenticate with Google Sheets API
    for (const privateKey of cleanKeyAttempts) {
      try {
        console.log(`\nATTEMPTING AUTHENTICATION with key of length ${privateKey.length}`);

        auth = new google.auth.JWT(
          process.env.GOOGLE_CLIENT_EMAIL || "",
          undefined,
          privateKey,
          SCOPES
        );

        await auth.authorize(); // Ensure the authentication succeeds
        break; // Exit the loop if authentication succeeds
      } catch (authError) {
        if (authError instanceof Error) {
          console.error("Authentication failed with this key:", authError.message);
        } else {
          console.error("Unknown authentication error:", authError);
        }
        continue; // Try the next key format
      }
    }

    if (!auth) {
      throw new Error("Failed to authenticate with Google API");
    }

    const sheets = google.sheets({ version: "v4", auth });

    // Parse incoming request data
    const { data } = await req.json();

    // Validate required fields
    if (!data || !data.companyName || !data.contactEmail) {
      return NextResponse.json(
        { error: "Missing required fields: companyName or contactEmail" },
        { status: 400 }
      );
    }

    // Prepare row data for Google Sheets
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

    // Append data to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: `${process.env.GOOGLE_PARTNERSHIPS_SHEET_NAME || "Partners"}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowData],
      },
    });

    console.log("Data successfully added to Google Sheets");

    // Insert data into PostgreSQL
    const client = await pool.connect();
    try {
      const insertQuery = `
        INSERT INTO partners (
          organization_name,
          company_field,
          company_size,
          linkedin_profile,
          website,
          partnership_reason,
          contact_name,
          email,
          phone_number,
          contact_position,
          created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
        )
      `;

      const dbValues = [
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
      ];

      await client.query(insertQuery, dbValues);

      console.log("Data successfully added to PostgreSQL");
    } finally {
      client.release();
    }

    return NextResponse.json({
      message: "Partnership request submitted successfully!",
    });
  } catch (error) {
    console.error("Error:", error);

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