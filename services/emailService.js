// emailService.js
const nodemailer = require("nodemailer");

const emailConfig = {
  service: "gmail",
  host: "smtp.gmail.email",
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
};

const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport(emailConfig);

  const mailOptions = {
    from: {
      name: "Web Hunter",
      address: process.env.USER,
    },
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
