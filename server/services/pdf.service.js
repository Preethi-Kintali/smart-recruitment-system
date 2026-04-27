const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  async generateOfferLetter(candidateName, jobTitle, companyName, salary) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `OfferLetter_${candidateName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../uploads/offers', filename);

        // Ensure directory exists
        if (!fs.existsSync(path.join(__dirname, '../uploads/offers'))) {
          fs.mkdirSync(path.join(__dirname, '../uploads/offers'), { recursive: true });
        }

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('OFFER OF EMPLOYMENT', { align: 'center', underline: true });
        doc.moveDown(2);

        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        doc.fontSize(12).text(`Dear ${candidateName},`, { bold: true });
        doc.moveDown();

        doc.text(`We are pleased to offer you the position of ${jobTitle} at ${companyName}. We were very impressed with your skills and experience and believe you will be a valuable addition to our team.`);
        doc.moveDown();

        doc.fontSize(14).text('Position Details:', { underline: true });
        doc.fontSize(12).text(`Job Title: ${jobTitle}`);
        doc.text(`Salary: ${salary}`);
        doc.text(`Location: Remote / As specified in the job posting`);
        doc.moveDown();

        doc.text('This offer is contingent upon successful completion of our background check and your ability to provide proof of eligibility to work.');
        doc.moveDown();

        doc.text('We look forward to having you join us. Please sign and return this letter to indicate your acceptance.');
        doc.moveDown(2);

        doc.text('Best Regards,');
        doc.moveDown();
        doc.text('Hiring Team');
        doc.text(companyName);

        doc.end();

        stream.on('finish', () => {
          resolve(`/uploads/offers/${filename}`);
        });

        stream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new PDFService();
