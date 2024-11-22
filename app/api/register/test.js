import { google } from "googleapis";

async function testGoogleSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "natco-442515-524fa895e87a.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const spreadsheetId = "1ogSwiJsdgy9vl1Mqdw5_u9RM-K3-HnDIqw9BbpvOF2U";

  try {
    const response = await sheets.spreadsheets.get({ spreadsheetId });
    console.log("Google Sheets API is working:", response.data);
  } catch (error) {
    console.error("Google Sheets API Error:", error);
  }
}

testGoogleSheets();