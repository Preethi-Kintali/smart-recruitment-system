const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
  try {
    const files = fs.readdirSync('uploads');
    const pdfFile = files.find(f => f.endsWith('.pdf'));
    const dataBuffer = fs.readFileSync('uploads/' + pdfFile);
    const data = await new PDFParse(dataBuffer);
    
    console.log('Instance methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(data)));
    
    // Try some common names
    if (data.getText) console.log('Found getText');
    if (data.toString) console.log('Found toString');
  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
