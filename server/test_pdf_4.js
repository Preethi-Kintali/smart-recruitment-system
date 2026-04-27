const pdf = require('pdf-parse');
async function test() {
  try {
    const data = await pdf.PDFParse(Buffer.from(''));
    console.log('Success without new');
  } catch (e) {
    console.error('Error without new:', e.message);
  }
}
test();
