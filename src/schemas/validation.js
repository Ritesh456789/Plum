const { z } = require('zod');

// Step 1: OCR Result
const OCRResultSchema = z.object({
    raw_text: z.string(),
    confidence: z.number()
});

// Step 2: Extraction
const EntitiesSchema = z.object({
    date_phrase: z.string().optional().nullable(),
    time_phrase: z.string().optional().nullable(),
    department: z.string().optional().nullable()
});

const ExtractionResultSchema = z.object({
    entities: EntitiesSchema,
    entities_confidence: z.number()
});

// Step 3: Normalization
const NormalizedDataSchema = z.object({
    date: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    tz: z.string()
});

const NormalizationResultSchema = z.object({
    normalized: NormalizedDataSchema,
    normalization_confidence: z.number()
});

// Step 4: Final Response
const AppointmentDetailsSchema = z.object({
    department: z.string().optional().nullable(),
    date: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    tz: z.string()
});

const AppointmentResponseSchema = z.object({
    appointment: AppointmentDetailsSchema,
    status: z.literal('ok')
});

const GuardrailResponseSchema = z.object({
    status: z.literal('needs_clarification'),
    message: z.string()
});

module.exports = {
    OCRResultSchema,
    ExtractionResultSchema,
    NormalizationResultSchema,
    AppointmentResponseSchema,
    GuardrailResponseSchema
};
