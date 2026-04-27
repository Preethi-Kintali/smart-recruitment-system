const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
  try {
    // Check for any pdf in uploads
    const files = fs.readdirSync('uploads');
    const pdfFile = files.find(f => f.endsWith('.pdf'));
    if (!pdfFile) {
      console.log('No PDF found in uploads to test');
      return;
    }
    
    console.log('Testing with:', pdfFile);
    const dataBuffer = fs.readFileSync('uploads/' + pdfFile);
    const data = await new PDFParse(dataBuffer);
    console.log('Keys of data:', Object.keys(data));
    console.log('Text length:', data.text?.length);
    console.log('Text snippet:', data.text?.substring(0, 100));
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();
