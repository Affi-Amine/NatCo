import { google } from "googleapis";
import { NextResponse } from "next/server";
import * as fs from 'fs';
import * as path from 'path';

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

export async function POST(req: Request) {
  try {
    // Prepare private key with multiple cleaning attempts
    const privateKeyRaw = process.env.GOOGLE_PRIVATE_KEY || '';
    
    const cleanKeyAttempts = [
      privateKeyRaw.replace(/\\n/g, '\n'),  // Replace escaped newlines
      privateKeyRaw.replace(/\\n/g, '\n').replace(/^"/, '').replace(/"$/, ''),  // Remove quotes
      privateKeyRaw.trim(),  // Remove whitespace
      privateKeyRaw.replace(/\r/g, ''),  // Remove carriage returns
      privateKeyRaw  // Original key
    ];

    // Try each processed key
    for (const privateKey of cleanKeyAttempts) {
      try {
        console.log(`\nATTEMPTING AUTHENTICATION with key of length ${privateKey.length}`);

        console.log('partner', privateKey);
        
        // Create JWT client
        const auth = new google.auth.JWT(
          process.env.GOOGLE_CLIENT_EMAIL || '',
          undefined,
          privateKey,
          SCOPES
        );

        // Attempt authorization
        const client = await auth.authorize();

        // Create sheets instance
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
          new Date().toLocaleString() // Timestamp
        ];

        // Append data to Google Sheet
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
          range: `${process.env.GOOGLE_PARTNERSHIPS_SHEET_NAME}!A1`,
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [rowData],
          },
        });

        return NextResponse.json({ 
          message: "Partnership request submitted successfully!",
          updateDetails: response.data
        });

      } catch (authAttemptError) {
        // Log specific details of the authentication error
        if (authAttemptError instanceof Error) {
          console.error(`Error Name: ${authAttemptError.name}`);
          console.error(`Error Message: ${authAttemptError.message}`);
          console.error(`Error Stack: ${authAttemptError.stack}`);
        }
        // Continue to next key attempt
        continue;
      }
    }

    // If all attempts fail
    throw new Error("All key processing attempts failed");

  } catch (error) {
    console.error("FINAL CATCH BLOCK ERROR:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unknown error occurred";
    
    return NextResponse.json(
      { 
        error: `Failed to process request: ${errorMessage}`,
        details: error instanceof Error ? error.stack : null
      },
      { status: 500 }
    );
  }
}