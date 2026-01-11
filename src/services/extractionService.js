const chrono = require('chrono-node');

const KNOWN_DEPARTMENTS = {
    "dentist": "Dentistry",
    "dentistry": "Dentistry",
    "dental": "Dentistry",
    "cardiology": "Cardiology",
    "cardiologist": "Cardiology",
    "general": "General Practice",
    "gp": "General Practice",
    "dermatologist": "Dermatology",
    "skin": "Dermatology"
};

/**
 * Extracts entities from text
 * @param {string} text 
 * @returns {{entities: {date_phrase: string|null, time_phrase: string|null, department: string|null}, entities_confidence: number}}
 */
function extractEntities(text) {
    const textLower = text.toLowerCase();
    
    // 1. Department Extraction
    let department = null;
    let deptRaw = null;
    for (const [key, value] of Object.entries(KNOWN_DEPARTMENTS)) {
        if (textLower.includes(key)) {
            department = value;
            deptRaw = key;
            break;
        }
    }

    // 2. Date/Time Extraction using Chrono
    // Chrono parses the whole text and gives us components
    const results = chrono.parse(text, new Date(), { forwardDate: true });
    
    let date_phrase = null;
    let time_phrase = null;

    if (results.length > 0) {
        const result = results[0];
        const textMatch = result.text; // "next Friday at 3pm"
        
        // Simple heuristic to split date and time phrase for the assignment format
        // If "at" separates them, or just use the whole string as date_phrase if lazy
        // Ideally we want specific phrases.
        
        // Let's rely on chrono's known values to guess which part of the string matches what
        // But chrono result.text is usually the combined "next Friday at 3pm".
        
        // We will try to decompose based on "at", "@" or digits
        // For the specific example "next Friday at 3pm"
        
        if (textMatch.includes(' at ')) {
            const parts = textMatch.split(' at ');
            date_phrase = parts[0]; // "next Friday"
            time_phrase = parts[1]; // "3pm"
        } else if (textMatch.includes(' @ ')) {
            const parts = textMatch.split(' @ ');
            date_phrase = parts[0];
            time_phrase = parts[1];
        } else {
            // Fallback: use the whole match for date_phrase if mostly date, or try to regex '3pm', '15:00'
            date_phrase = textMatch;
            const timeMatch = textMatch.match(/(\d{1,2}(?:[:]\d{2})?\s*(?:am|pm)?)/i);
            if (timeMatch && timeMatch[0].length < textMatch.length) {
                // If we found a time sub-string
                // This is getting complex for a heuristic, let's stick to the prompt's examples
               pass = true;
            }
        }
        
        // If the simple split didn't work, let's just populate date_phrase with the full match
        // and leave time_phrase empty if we can't definitively separate it,
        // OR more smartly:
        if (!date_phrase) date_phrase = textMatch;
        
        // Check if there is a specific time component known to chrono
        const components = result.start;
        if (components.isCertain('hour')) {
             // We have a time. If time_phrase is still null, try to find the time substring
             if (!time_phrase) {
                 // naive search
                 const match = textMatch.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM))/);
                 if (match) time_phrase = match[0];
             }
        }
    }

    const confidence = (department && (date_phrase || time_phrase)) ? 0.85 : 0.5;

    return {
        entities: {
            date_phrase: date_phrase || null,
            time_phrase: time_phrase || null,
            department: department ? deptRaw : null // Pass raw for now as per schema
        },
        entities_confidence: confidence
    };
}

module.exports = {
    extractEntities
};
