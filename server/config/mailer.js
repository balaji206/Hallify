const nodemailer = require('nodemailer');
require('dotenv').config();

/**
 * Shared Nodemailer Transporter
 * Configured using environment variables to ensure secure and consistent email delivery.
 */
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail
    pass: process.env.EMAIL_PASS      // your App Password
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Mailer Error:', error);
  } else {
    console.log('✅ Mailer is ready for notifications');
  }
});

module.exports = transporter;
