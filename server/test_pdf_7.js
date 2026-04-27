const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
  try {
    const files = fs.readdirSync('uploads');
    const pdfFile = files.find(f => f.endsWith('.pdf'));
    const dataBuffer = new Uint8Array(fs.readFileSync('uploads/' + pdfFile));
    const data = await new PDFParse(dataBuffer);
    
    const text = await data.getText();
    console.log('Type of text:', typeof text);
    console.log('Is text array?', Array.isArray(text));
    if (typeof text === 'object') {
        console.log('Object keys:', Object.keys(text));
    }
    console.log('Text value:', text);
  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
