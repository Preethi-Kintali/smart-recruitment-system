const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateOfferLetter = (candidateName, jobTitle, salary, startDate) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const fileName = `Offer_${candidateName.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../uploads/', fileName);
        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Header
        doc.fontSize(25).text('OFFER OF EMPLOYMENT', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' });
        doc.moveDown();

        // Content
        doc.fontSize(14).text(`Dear ${candidateName},`, { underline: true });
        doc.moveDown();
        doc.fontSize(12).text(
            `We are pleased to offer you the position of ${jobTitle} at Antigravity Recruitment Systems. We were very impressed with your skills and experience, and we believe you will be a valuable addition to our team.`
        );
        doc.moveDown();
        
        doc.text(`Position: ${jobTitle}`);
        doc.text(`Annual Compensation: ${salary}`);
        doc.text(`Start Date: ${startDate}`);
        doc.moveDown();

        doc.text(
            'This offer is contingent upon successful completion of our background check process. Please indicate your acceptance of this offer by signing and returning this letter.'
        );
        doc.moveDown(2);

        doc.text('Sincerely,');
        doc.moveDown();
        doc.text('The Hiring Team');
        doc.text('Antigravity Recruiter AI');

        doc.end();

        stream.on('finish', () => resolve(filePath));
        stream.on('error', (err) => reject(err));
    });
};

module.exports = { generateOfferLetter };
