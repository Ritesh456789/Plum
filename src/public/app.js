document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 1. Inject CSS Styles
    const styles = `
        * { box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: #f4f7f6; 
            color: #333;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }
        h1 {
            color: #2c3e50;
            margin-bottom: 30px;
            text-align: center;
            font-size: 2.2rem;
        }
        .container { 
            background: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            border-radius: 12px;
            padding: 40px;
            width: 100%;
            max-width: 600px;
        }
        .form-group { margin-bottom: 25px; }
        label { 
            display: block; 
            margin-bottom: 8px; 
            font-weight: 600; 
            color: #555;
            font-size: 0.95rem;
        }
        textarea, input[type="file"] { 
            width: 100%; 
            padding: 12px; 
            border: 2px solid #eef2f1;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
            font-family: inherit;
            resize: vertical;
        }
        textarea:focus, input[type="file"]:focus {
            outline: none;
            border-color: #007bff;
        }
        .divider {
            text-align: center; 
            margin: 20px 0; 
            color: #999;
            font-size: 0.9rem;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        .divider::before, .divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #eee;
        }
        .divider::before { margin-right: 15px; }
        .divider::after { margin-left: 15px; }

        button { 
            background-color: #007bff; 
            color: white; 
            border: none; 
            padding: 14px 20px; 
            cursor: pointer; 
            border-radius: 8px; 
            width: 100%;
            font-size: 1.1rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0,123,255,0.2);
        }
        button:hover { 
            background-color: #0056b3; 
            transform: translateY(-1px);
            box-shadow: 0 6px 8px rgba(0,123,255,0.3);
        }
        button:active { transform: translateY(0); }

        #resultContainer { margin-top: 30px; border-top: 2px solid #f0f0f0; padding-top: 20px; display: none; }
        #resultContainer h3 { color: #2c3e50; margin-bottom: 20px; text-align: center; }

        .step-box { 
            background: #fff; 
            border: 1px solid #e1e4e8; 
            border-radius: 8px; 
            padding: 20px; 
            margin-bottom: 15px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            transition: transform 0.2s;
        }
        .step-box:hover { transform: translateX(5px); border-left: 3px solid #007bff; }
        
        .step-title { 
            font-weight: 700; 
            margin-bottom: 12px; 
            color: #444; 
            border-bottom: 1px solid #f0f0f0; 
            padding-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .loading { 
            text-align: center; 
            color: #666; 
            margin-top: 15px; 
            font-style: italic; 
            display: none;
        }
        pre { 
            margin: 0; 
            white-space: pre-wrap; 
            font-family: 'Consolas', 'Monaco', monospace; 
            color: #2c3e50; 
            font-size: 0.9rem;
            background: #f8f9fa;
            padding: 10px;
            border-radius: 6px;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. Build Layout (Pure JS construction)
    const root = document.getElementById('app');
    
    // Header
    const title = document.createElement('h1');
    title.textContent = 'AI-Powered Appointment Scheduler';
    root.appendChild(title);

    // Container
    const container = document.createElement('div');
    container.className = 'container';
    root.appendChild(container);

    // Form: Text Input
    const divText = document.createElement('div');
    divText.className = 'form-group';
    const labelText = document.createElement('label');
    labelText.textContent = 'Option 1: Enter Natural Language';
    const textArea = document.createElement('textarea');
    textArea.id = 'textInput';
    textArea.rows = 3;
    textArea.placeholder = 'Ex: Book dentist next Friday at 3pm';
    divText.appendChild(labelText);
    divText.appendChild(textArea);
    container.appendChild(divText);

    // Divider
    const divider = document.createElement('div');
    divider.className = 'divider';
    divider.textContent = 'OR';
    container.appendChild(divider);

    // Form: File Input
    const divFile = document.createElement('div');
    divFile.className = 'form-group';
    const labelFile = document.createElement('label');
    labelFile.textContent = 'Option 2: Upload Image';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'fileInput';
    fileInput.accept = 'image/*';
    divFile.appendChild(labelFile);
    divFile.appendChild(fileInput);
    container.appendChild(divFile);

    // Button
    const btn = document.createElement('button');
    btn.textContent = 'Process Request';
    btn.onclick = processAppointment;
    container.appendChild(btn);

    // Loading Indicator
    const pLoading = document.createElement('p');
    pLoading.id = 'loading';
    pLoading.className = 'loading';
    pLoading.textContent = 'Processing... please wait (OCR might take a moment)';
    container.appendChild(pLoading);

    // Result Container
    const divResultContainer = document.createElement('div');
    divResultContainer.id = 'resultContainer';
    const h3Result = document.createElement('h3');
    h3Result.textContent = 'Pipeline Output';
    divResultContainer.appendChild(h3Result);
    
    const divResult = document.createElement('div');
    divResult.id = 'result';
    divResultContainer.appendChild(divResult);
    
    container.appendChild(divResultContainer);
}

// Logic Functions
function renderStep(title, data) {
    const box = document.createElement('div');
    box.className = 'step-box';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'step-title';
    titleDiv.textContent = title;
    
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(data, null, 2);
    
    box.appendChild(titleDiv);
    box.appendChild(pre);
    
    return box;
}

async function processAppointment() {
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');
    const resultContainer = document.getElementById('resultContainer');
    const loading = document.getElementById('loading');
    
    resultContainer.style.display = 'none';
    loading.style.display = 'block';
    
    // Clear previous results
    resultDiv.innerHTML = '';

    try {
        let body;
        let headers = {};

        if (fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);
            body = formData;
        } else if (textInput.value) {
            body = JSON.stringify({ text: textInput.value });
            headers = { 'Content-Type': 'application/json' };
        } else {
            alert('Please enter text or upload an image');
            loading.style.display = 'none';
            return;
        }

        const response = await fetch('/process-appointment', {
            method: 'POST',
            headers: headers,
            body: body
        });

        const data = await response.json();
        
        if (data.status === 'ok') {
            // Step 1: OCR
            resultDiv.appendChild(renderStep('Step 1: OCR Output', {
                raw_text: data.raw_text,
                confidence: data.ocr_confidence
            }));

            // Step 2: Entities
            resultDiv.appendChild(renderStep('Step 2: Entities', {
                entities: data.entities,
                confidence: data.entities_confidence
            }));

            // Step 3: Normalization
            resultDiv.appendChild(renderStep('Step 3: Normalization', {
                normalized: data.normalized,
                confidence: data.normalization_confidence
            }));

            // Step 4: Final Appointment
            resultDiv.appendChild(renderStep('Step 4: Final Appointment', {
                appointment: data.appointment,
                status: data.status
            }));
        } else {
            resultDiv.appendChild(renderStep('Response', data));
        }

        resultContainer.style.display = 'block';
    } catch (error) {
        const errorBox = document.createElement('div');
        errorBox.className = 'step-box';
        errorBox.style.color = 'red';
        errorBox.textContent = 'Error: ' + error.message;
        resultDiv.appendChild(errorBox);
        resultContainer.style.display = 'block';
    } finally {
        loading.style.display = 'none';
    }
}
