# AI-Powered Appointment Scheduler (Node.js Version)

This project parses natural language or document-based appointment requests into structured data using **Node.js**.

## Tech Stack
- **Backend**: Node.js + Express
- **OCR**: Tesseract.js
- **Date Parsing**: chrono-node
- **Timezone Handling**: dayjs
- **File Upload**: Multer
- **Validation**: Zod
- **Frontend**: Pure JavaScript (Dynamic DOM Generation, No Static HTML/CSS)

## Features
- **OCR**: Extracts text from uploaded images.
- **Entity Extraction**: Identifies department (e.g., Dentist) and date/time (e.g., "next Friday at 3pm").
- **Normalization**: Converts extracted times to ISO format in `Asia/Kolkata`.
- **Pipeline Visibility**: Returns detailed intermediate steps (OCR -> Entities -> Normalization) for verification.
- **Guardrails**: Returns "needs_clarification" if input is ambiguous.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

### Web Interface
Visit `http://localhost:3000` to use the built-in UI:
- **Clean, Modern Design**: Responsive interface for testing.
- **Pipeline View**: See exactly how the AI processes your request step-by-step.
- **Dual Input**: Support for both manual text entry and image uploads.

### Endpoints

`POST /process-appointment`

Accepts either `multipart/form-data` (file upload) or JSON/Form data.

**1. Text Input Example:**
- Key: `text`
- Value: `Book dentist next Friday at 3pm`

**2. Image Input Example:**
- Key: `file`
- Value: `[Upload Image File]`

### Output Format (Pipeline Steps)
The API returns a detailed JSON object broken down by pipeline steps:

1.  **Step 1: OCR Output** - Raw text and confidence.
2.  **Step 2: Entities** - Extracted date, time, and department phrases.
3.  **Step 3: Normalization** - Standardized ISO date/time and timezone.
4.  **Step 4: Final Appointment** - The structured object ready for database insertion.

### Example Response
```json
{
  "raw_text": "Book dentist next Friday at 3pm",
  "ocr_confidence": 1,
  "entities": {
    "date_phrase": "next Friday",
    "time_phrase": "3pm",
    "department": "dentist"
  },
  "entities_confidence": 0.85,
  "normalized": {
    "date": "2026-01-16",
    "time": "15:00",
    "tz": "Asia/Kolkata"
  },
  "normalization_confidence": 0.9,
  "appointment": {
    "department": "Dentistry",
    "date": "2026-01-16",
    "time": "15:00",
    "tz": "Asia/Kolkata"
  },
  "status": "ok"
}
```
