const express = require('express');
const multer = require('multer');
const ocrService = require('./services/ocrService');
const extractionService = require('./services/extractionService');
const normalizationService = require('./services/normalizationService');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory buffer

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/process-appointment', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const textBody = req.body.text;

        // Step 1: OCR / Text Extraction
        let ocrResult;
        
        if (file) {
            console.log("Processing image file...");
            ocrResult = await ocrService.processImageInput(file.buffer);
        } else if (textBody) {
            console.log("Processing text input...");
            ocrResult = ocrService.processTextInput(textBody);
        } else {
            return res.json({
                status: "needs_clarification",
                message: "No input provided. Please provide text or an image."
            });
        }

        if (!ocrResult.raw_text || !ocrResult.raw_text.trim()) {
            return res.json({
                status: "needs_clarification",
                message: "Could not detect any text from the input."
            });
        }

        // Step 2: Entity Extraction
        const extractResult = extractionService.extractEntities(ocrResult.raw_text);
        const entities = extractResult.entities;

        // Step 3: Normalization
        const normResult = normalizationService.normalizeData(entities);
        const normData = normResult.normalized;
        const normDept = normResult.department_normalized;

        // Step 4: Final JSON & Guardrails
        // Guardrails
        const ambiguityReasons = [];
        let isAmbiguous = false;

        // OCR Confidence check (if it was an image)
        if (file && ocrResult.confidence < 0.5) {
            isAmbiguous = true;
            ambiguityReasons.push("Low OCR confidence");
        }

        if (!normDept) {
            isAmbiguous = true;
            ambiguityReasons.push("Unknown department");
        }

        if (!normData.date || !normData.time) {
            isAmbiguous = true;
            ambiguityReasons.push("Ambiguous date/time");
        }

        if (isAmbiguous) {
            return res.json({
                status: "needs_clarification",
                message: `Ambiguous input: ${ambiguityReasons.join(", ")}`,
                debug_info: {
                    raw_text: ocrResult.raw_text,
                    entities: entities,
                    normalized: normData
                }
            });
        }

        // Success Response
        return res.json({
            raw_text: ocrResult.raw_text,
            ocr_confidence: ocrResult.confidence,

            entities: entities,
            entities_confidence: extractResult.entities_confidence,

            normalized: normData,
            normalization_confidence: normResult.normalization_confidence,

            appointment: {
                department: normDept,
                date: normData.date,
                time: normData.time,
                tz: normData.tz
            },
            status: "ok"
        });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
