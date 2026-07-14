require("dotenv").config();

const transporter = require("./src/config/mail");

async function test() {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "SMTP Test",
            text: "Nodemailer is working!",
        });

        console.log(info);
    } catch (err) {
        console.error(err);
    }
}

test();

//to run - node testMail.js