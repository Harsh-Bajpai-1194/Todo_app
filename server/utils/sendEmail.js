const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter for your email service (e.g., Gmail)
  // For Gmail, you'll need to generate an "App Password" if you have 2FA enabled.
  // See: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,       // Use 465 instead of 587 for better reliability on Render
  secure: true,    // Required for port 465
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD, // Ensure this is your 16-character App Password
  },
  tls: {
    rejectUnauthorized: false // Helps bypass security blocks on cloud servers
  }
});

  // 2. Define the email options
  const mailOptions = {
    from: 'Todo App <noreply@todoapp.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;