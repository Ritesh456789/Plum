# AI-Powered Appointment Scheduler (Node.js Version)

This project parses natural language or document-based appointment requests into structured data using **Node.js**.

## Tech Stack
- **Backend**: Node.js + Express
- **OCR**: Tesseract.js
- **Date Parsing**: chrono-node
- **Timezone Handling**: dayjs
- **File Upload**: Multer
- **Validation**: Zod

## Features
- **OCR**: Extracts text from uploaded images.
- **Entity Extraction**: Identifies department (e.g., Dentist) and date/time (e.g., "next Friday at 3pm").
- **Normalization**: Converts extracted times to ISO format in `Asia/Kolkata`.
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

The API will be available at `http://localhost:3000`.

### Endpoints

`POST /process-appointment`

Accepts either `multipart/form-data` (file upload) or JSON/Form data.

**1. Text Input Example:**
- Key: `text`
- Value: `Book dentist next Friday at 3pm`

**2. Image Input Example:**
- Key: `file`
- Value: `[Upload Image File]`

### Example Response
```json
{
  "appointment": {
    "department": "Dentistry",
    "date": "2025-09-26",
    "time": "15:00",
    "tz": "Asia/Kolkata"
  },
  "status": "ok"
}
```
