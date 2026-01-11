const Tesseract = require('tesseract.js');

/**
 * Handles image OCR using Tesseract.js
 * @param {Buffer} imageBuffer - The image file buffer
 * @returns {Promise<{raw_text: string, confidence: number}>}
 */
async function processImageInput(imageBuffer) {
    try {
        const { data: { text, confidence } } = await Tesseract.recognize(
            imageBuffer,
            'eng',
            { logger: m => console.log(m) } // Optional logging
        );

        // Tesseract confidence is 0-100, we want 0-1
        const normalizedConfidence = confidence / 100;

        return {
            raw_text: text.trim().replace(/\n/g, " "),
            confidence: parseFloat(normalizedConfidence.toFixed(2))
        };
    } catch (error) {
        console.error("OCR Error:", error);
        return {
            raw_text: "",
            confidence: 0.0
        };
    }
}

/**
 * Handles raw text input (no OCR needed)
 * @param {string} text 
 * @returns {{raw_text: string, confidence: number}}
 */
function processTextInput(text) {
    return {
        raw_text: text ? text.trim() : "",
        confidence: 1.0
    };
}

module.exports = {
    processImageInput,
    processTextInput
};
