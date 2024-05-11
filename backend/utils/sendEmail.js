import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    try {
        // Create a transport object using SMTP configuration
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // Use SSL/TLS
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });

        // Create email message
        const message = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
        };

        // Send email
        const info = await transporter.sendMail(message);

        console.log(`Email sent: ${info.messageId}`);

        return info; // Return message info if needed
    } catch (error) {
        console.error('Error sending email:', error);

        // Check if the error is related to invalid credentials
        if (error.code === 'EAUTH') {
            throw new Error('Invalid email credentials. Please check your SMTP configuration.');
        } else {
            throw new Error('Failed to send email');
        }
    }
};

export default sendEmail;
