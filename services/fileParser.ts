// services/fileParser.ts

// Declare the globals provided by the script tags in index.html
declare const mammoth: any;
declare const pdfjsLib: any;

// This flag will prevent setting the workerSrc multiple times
let pdfWorkerInitialized = false;

async function parsePdf(file: File): Promise<string> {
    // Check if pdfjsLib is available on the window object. This is a fallback.
    if (typeof pdfjsLib === 'undefined') {
        throw new Error('PDF parsing library failed to load. Please refresh the page and try again.');
    }

    // Lazily initialize the worker source. This runs only once.
    if (!pdfWorkerInitialized) {
        // Configure the worker for pdf.js. This is crucial for performance.
        // Make sure the version matches the library version in index.html.
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.js`;
        pdfWorkerInitialized = true;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let textContent = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return textContent;
}

async function parseDocx(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

export async function parseResumeFile(file: File): Promise<string> {
    const fileName = file.name.toLowerCase();
    if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
        return parsePdf(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        return parseDocx(file);
    } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
}
