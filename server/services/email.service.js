const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

class EmailService {
    async sendEmail(to, subject, html, attachments = []) {
        try {
            const mailOptions = {
                from: `"Smart Recruitment System" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
                attachments
            };

            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    async sendApplicationReceived(email, name, jobTitle) {
        const subject = `Application Received: ${jobTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Hello ${name},</h2>
                <p>Thank you for applying for the <strong>${jobTitle}</strong> position.</p>
                <p>Our AI-powered screening system is currently reviewing your profile. You will be notified once the screening is complete.</p>
                <p>Best regards,<br/>The Hiring Team</p>
            </div>
        `;
        return this.sendEmail(email, subject, html);
    }

    async sendInterviewInvite(email, name, jobTitle, date, time, mode, meetingLink) {
        const subject = `Interview Invitation: ${jobTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Congratulations ${name}!</h2>
                <p>You have been shortlisted for an interview for the <strong>${jobTitle}</strong> position.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li><strong>Date:</strong> ${date}</li>
                    <li><strong>Time:</strong> ${time}</li>
                    <li><strong>Mode:</strong> ${mode}</li>
                    <li><strong>Link/Location:</strong> <a href="${meetingLink}">${meetingLink}</a></li>
                </ul>
                <p>Please be prepared to discuss your technical skills and previous projects.</p>
                <p>Best regards,<br/>The Hiring Team</p>
            </div>
        `;
        return this.sendEmail(email, subject, html);
    }

    async sendRejection(email, name, jobTitle, reason) {
        const subject = `Update on your application for ${jobTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Hello ${name},</h2>
                <p>Thank you for your interest in the <strong>${jobTitle}</strong> position.</p>
                <p>After careful review of your application, we regret to inform you that we will not be moving forward with your candidacy at this time.</p>
                <p><strong>Feedback:</strong> ${reason}</p>
                <p>We appreciate your time and wish you the best in your job search.</p>
                <p>Best regards,<br/>The Hiring Team</p>
            </div>
        `;
        return this.sendEmail(email, subject, html);
    }

    async sendOfferLetter(email, name, jobTitle, pdfPath) {
        const subject = `Job Offer: ${jobTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Congratulations ${name}!</h2>
                <p>We are thrilled to offer you the position of <strong>${jobTitle}</strong>.</p>
                <p>Please find your official offer letter attached to this email. We look forward to having you on our team!</p>
                <p>Best regards,<br/>The Hiring Team</p>
            </div>
        `;
        return this.sendEmail(email, subject, html, [
            {
                filename: `Offer_Letter_${name.replace(/\s+/g, '_')}.pdf`,
                path: pdfPath
            }
        ]);
    }
}

module.exports = new EmailService();
