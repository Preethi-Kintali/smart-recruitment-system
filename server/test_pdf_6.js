const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
  try {
    const files = fs.readdirSync('uploads');
    const pdfFile = files.find(f => f.endsWith('.pdf'));
    const dataBuffer = fs.readFileSync('uploads/' + pdfFile);
    const data = await new PDFParse(dataBuffer);
    
    const text = await data.getText();
    console.log('Text length:', text?.length);
    console.log('Text snippet:', text?.substring(0, 200));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
test();
