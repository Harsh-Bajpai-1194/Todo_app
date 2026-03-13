const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter for your email service (e.g., Gmail)
  // For Gmail, you'll need to generate an "App Password" if you have 2FA enabled.
  // See: https://support.google.com/accounts/answer/185833
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
    },
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