const nodemailer = require('nodemailer');

// In-memory OTP store (you can use DB/Redis in real apps)
const otpStore = new Map();

// Generate random 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail
    pass: process.env.EMAIL_PASS      // your App Password
  }
});

// 👉 Send OTP to email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOtp();

  // Store OTP with 5-minute expiry
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 mins
  });

  const mailOptions = {
  from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Your OTP Code",
  text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  html: `
    <div style="font-family: sans-serif; padding: 10px;">
      <h2>${process.env.APP_NAME} - Email Verification</h2>
      <p>Hello,</p>
      <p>Your OTP is: <strong style="font-size: 18px;">${otp}</strong></p>
      <p>This code is valid for 5 minutes.</p>
      <br/>
      <p>Thanks,<br/>${process.env.APP_NAME} Team</p>
    </div>
  `
};


  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
};

// 👉 Verify OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ message: "No OTP found for this email" });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp) !== record.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  otpStore.delete(email);
  res.status(200).json({ message: "OTP verified" });
};
