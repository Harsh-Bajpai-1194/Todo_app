const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter for your email service (e.g., Gmail)
  // For Gmail, you'll need to generate an "App Password" if you have 2FA enabled.
  // See: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
port: 465,       // Change 587 to 465
secure: true,    // Change false to true for port 465
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS, // Your 16-character App Password
},
tls: {
    rejectUnauthorized: false // Helps bypass network-level certificate issues
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