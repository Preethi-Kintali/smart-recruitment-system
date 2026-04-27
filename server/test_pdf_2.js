const { PDFParse } = require('pdf-parse');
try {
  const p = new PDFParse(Buffer.from(''));
  console.log('Successfully created PDFParse instance');
} catch (e) {
  console.error('Error:', e.message);
}
