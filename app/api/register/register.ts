import { google } from "googleapis";
import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Set up multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

const uploadMiddleware = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "cv", maxCount: 1 },
]);

export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: "natco-442515-524fa895e87a.json", // Replace with your service account key path
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Middleware to handle file uploads
  await new Promise<void>((resolve, reject) =>
    uploadMiddleware(req as any, {} as any, (err: any) => {
      if (err) {
        console.error("File upload error:", err);
        return reject(err);
      }
      resolve();
    })
  );

  // Parse request body and uploaded files
  const {
    lc = "LC", // Fallback LC if none provided
    fullName = "",
    cin = "",
    phoneNumber = "",
    emergencyNumber = "",
    dob = "",
    email = "",
    consent = "No",
    keyArea = "",
    position = "",
    allergies = "No",
    chronicIllness = "No",
    allergyDetails = "",
    chronicIllnessDetails = "",
    expectations = "",
  } = req.body;

  const files = (req as any).files;
  const photoFile = files?.photo ? `/uploads/${files.photo[0].filename}` : "";
  const cvFile = files?.cv ? `/uploads/${files.cv[0].filename}` : "";

  try {
    // Validate spreadsheet ID
    const spreadsheetId = "1ogSwiJsdgy9vl1Mqdw5_u9RM-K3-HnDIqw9BbpvOF2U"; // Replace with your spreadsheet ID
    if (!spreadsheetId) {
      throw new Error("Spreadsheet ID is missing.");
    }

    // Check if LC tab exists
    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const lcTabExists = sheetInfo.data.sheets?.some(
      (sheet) => sheet.properties?.title === lc
    );

    if (!lcTabExists) {
      // Create a new tab for the LC
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: lc,
                },
              },
            },
          ],
        },
      });

      // Add headers to the new tab
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${lc}!A1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              "Full Name",
              "CIN",
              "Phone Number",
              "Emergency Number",
              "Date of Birth",
              "Email",
              "Consent",
              "Key Area",
              "Position",
              "Allergies",
              "Chronic Illness",
              "Allergy Details",
              "Chronic Illness Details",
              "Expectations",
              "Photo Link",
              "CV Link",
            ],
          ],
        },
      });
    }

    // Append the data to the LC tab
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${lc}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            fullName,
            cin,
            phoneNumber,
            emergencyNumber,
            dob,
            email,
            consent,
            keyArea,
            position,
            allergies,
            chronicIllness,
            allergyDetails,
            chronicIllnessDetails,
            expectations,
            photoFile,
            cvFile,
          ],
        ],
      },
    });

    res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error saving registration:", error);

    // Clean up uploaded files in case of an error
    try {
      if (photoFile && fs.existsSync(path.join(process.cwd(), photoFile))) {
        fs.unlinkSync(path.join(process.cwd(), photoFile));
      }
      if (cvFile && fs.existsSync(path.join(process.cwd(), cvFile))) {
        fs.unlinkSync(path.join(process.cwd(), cvFile));
      }
    } catch (cleanupError) {
      console.error("Error during file cleanup:", cleanupError);
    }

    res.status(500).json({ message: "Internal server error" });
  }
}