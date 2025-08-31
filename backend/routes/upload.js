import express from "express";
import multer from "multer";
import fs from "fs";
import pdf from "pdf-parse-fixed";
import Tesseract from "tesseract.js";
import Jimp from "jimp";
import Extraction from "../models/Extraction.js";
import { analyzeEngagement } from "../utils/engagementAnalysis.js";

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 20 * 1024 * 1024 },
});

// --------------------
// Image preprocessing
// --------------------
async function preprocessImage(filePath) {
  const image = await Jimp.read(filePath);
  image.greyscale().contrast(0.5).normalize();
  await image.writeAsync(filePath);
  return filePath;
}

// --------------------
// Clean extracted text
// --------------------
function cleanExtractedText(rawText) {
  const lines = rawText.split("\n");
  const cleanedLines = [];
  let skipMode = false;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    const seqs = line.split(/\s+/);
    let fragCount = 0;
    for (const s of seqs) {
      if (s.length >= 1 && s.length <= 2) fragCount++;
    }

    if (fragCount > 4) {
      skipMode = true;
      continue;
    }

    if (!skipMode) {
      const meaningful = line.replace(/[^a-zA-Z0-9@#.,'’“”?!\s]/g, "").trim();
      if (meaningful) cleanedLines.push(meaningful);
    }
  }

  return cleanedLines.join("\n").trim() || "No meaningful text extracted.";
}

function extractTimestampViews(rawText) {
  const timeViewsRegex =
    /\d{1,2}:\d{2}\s?(?:AM|PM)?\s*-\s*\w{3}\s*\d{1,2},\s*\d{4}.*Views/i;
  const match = rawText.match(timeViewsRegex);
  if (match) return match[0].trim();
  return "No timestamp/views found.";
}

// --------------------
// Upload route
// --------------------
router.post("/", upload.array("files", 7), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const results = [];

    for (const file of req.files) {
      const filePath = file.path;
      const mimeType = file.mimetype;
      let extractedText = "";

      if (mimeType === "application/pdf") {
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(pdfBuffer);
        extractedText = pdfData.text;
      } else if (mimeType.startsWith("image/")) {
        await preprocessImage(filePath);
        const {
          data: { text },
        } = await Tesseract.recognize(filePath, "eng", {
          tessedit_char_whitelist:
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'’“”?!@# ",
          psm: 6,
        });
        extractedText = text.trim();
      } else {
        extractedText = "⚠️ Unsupported file type: " + mimeType;
      }

      // Remove uploaded file
      fs.unlinkSync(filePath);

      // Clean text & analyze
      const cleanedText = cleanExtractedText(extractedText);
      const timestampViews = extractTimestampViews(extractedText);
      const engagement = analyzeEngagement(cleanedText);

      const record = {
        fileName: file.originalname,
        type: mimeType,
        text: cleanedText,
        timestampViews,
        engagement,
        uploadedAt: new Date(),
      };

      results.push(record);
      await Extraction.create(record); // save each upload
    }

    res.json({ results });
  } catch (err) {
    console.error("❌ Error processing files:", err);
    res.status(500).json({ error: "Failed to process files" });
  }
});

export default router;
