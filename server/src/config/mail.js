const nodemailer = require("nodemailer");

//transporter is configured to use Gmail as the email service, and it uses environment variables for the email user and password. 
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

module.exports = transporter;