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

    async sendShortlisted(email, name, jobTitle) {
        const subject = `Great News! You've been Shortlisted for ${jobTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2>Congratulations ${name}!</h2>
                <p>We are pleased to inform you that you have been <strong>Shortlisted</strong> for the <strong>${jobTitle}</strong> position.</p>
                <p>Our recruitment team will reach out to you shortly to schedule the next steps.</p>
                <p>Best regards,<br/>The Hiring Team</p>
            </div>
        `;
        return this.sendEmail(email, subject, html);
    }

    async sendInterviewInvite(email, name, jobTitle, interviewLink) {
        console.log(`[EMAIL_SERVICE] Preparing interview invite for ${email}`);
        const subject = `Interview Invitation: ${jobTitle} - AI Mock Interview`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #6366f1;">Congratulations ${name}!</h2>
                <p>We are impressed with your profile and would like to invite you for an <strong>AI-Powered Mock Interview</strong> for the <strong>${jobTitle}</strong> position.</p>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1;">
                    <p style="margin: 0;"><strong>Step 1:</strong> Prepare your camera and microphone.</p>
                    <p style="margin: 5px 0;"><strong>Step 2:</strong> Click the link below to start the automated interview.</p>
                    <p style="margin: 0;"><strong>Step 3:</strong> Our AI will ask you technical questions based on the job requirements.</p>
                </div>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${interviewLink}" style="background: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Start AI Interview Now</a>
                </div>
                <p>Please complete this at your earliest convenience. Your performance will be reviewed by our hiring team.</p>
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

    async sendOfflineInterviewInvite(email, name, jobTitle, date, place) {
        const subject = `In-Person Interview: ${jobTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #10b981;">Final Interview Round!</h2>
                <p>Hello ${name},</p>
                <p>Based on your excellent performance in the AI Mock Interview, we would like to invite you for a <strong>final interview round</strong> for the <strong>${jobTitle}</strong> position.</p>
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                    <p style="margin: 0;"><strong>Date & Time:</strong> ${date}</p>
                    <p style="margin: 5px 0;"><strong>Location/Link:</strong> ${place}</p>
                </div>
                <p>Please confirm your availability by replying to this email. We look forward to meeting you in person!</p>
                <p>Best regards,<br/>The Hiring Team</p>
            </div>
        `;
        return this.sendEmail(email, subject, html);
    }

    async sendInterviewReport(recruiterEmail, candidateName, jobTitle, report) {
        const subject = `Interview Report: ${candidateName} for ${jobTitle}`;
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #6366f1;">AI Mock Interview Completed</h2>
                <p>Hello,</p>
                <p>The candidate <strong>${candidateName}</strong> has completed the AI Mock Interview for the <strong>${jobTitle}</strong> position.</p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1;">
                    <h4 style="margin: 0 0 10px 0;">Performance Summary:</h4>
                    <p style="margin: 0; font-style: italic;">"${report}"</p>
                </div>
                <p>You can view the full transcript and take further action in the <a href="http://localhost:5173/recruiter">Recruiter Portal</a>.</p>
                <p>Best regards,<br/>Smart Recruitment AI</p>
            </div>
        `;
        return this.sendEmail(recruiterEmail, subject, html);
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
