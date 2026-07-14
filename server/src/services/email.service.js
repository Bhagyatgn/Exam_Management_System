const transporter = require("../config/mail");

/**
 * Send verification email
 */
async function sendVerificationEmail({ to, code }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Verify Your Email",
            text: `Your verification code is: ${code}`,
            html: `
                <div style="font-family: Arial; padding: 10px;">
                    <h2>Email Verification</h2>
                    <p>Your verification code is:</p>
                    <h1 style="letter-spacing: 4px;">${code}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
        });

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error("Email sending failed:", error.message);

        throw new Error("EMAIL_SEND_FAILED");
    }
}

module.exports = {
    sendVerificationEmail,
};