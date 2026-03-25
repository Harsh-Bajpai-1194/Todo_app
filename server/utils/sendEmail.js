const nodemailer = require('nodemailer');

/**
 * Sends an email using Gmail SMTP.
 * Configured for high reliability on cloud platforms like Render.
 */
const sendEmail = async (options) => {
  // 1. Create a transporter specifically optimized for Render's network
  const transporter = nodemailer.createTransport({
    service: 'gmail',           // Explicitly define the service
    host: 'smtp.gmail.com',
    port: 465,                  // Port 465 is more stable than 587 on Render
    secure: true,               // Required for port 465
    auth: {
      user: process.env.EMAIL_USERNAME, // Must be set in Render Environment
      pass: process.env.EMAIL_PASSWORD, // Must be the 16-character App Password
    },
    connectionTimeout: 10000,   // 10 seconds timeout to prevent hanging requests
    greetingTimeout: 5000,
    socketTimeout: 15000,
    tls: {
      // Essential for bypassing SSL certificate handshaking issues on cloud servers
      rejectUnauthorized: false 
    }
  });

  // 2. Define the email options
  // Note: Gmail often overrides the 'from' address to your actual EMAIL_USERNAME
  const mailOptions = {
    from: `"Todo App" <${process.env.EMAIL_USERNAME}>`, 
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div>${options.message}</div>`, // Adding HTML support for a better UI
  };

  // 3. Send the email and handle potential errors
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    throw new Error('Email could not be sent. Check your App Password and Render settings.');
  }
};

module.exports = sendEmail;