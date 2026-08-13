const nodemailer = require("nodemailer");

const emailConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;
if (emailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

/**
 * Fire-and-forget email sender. Never throws — if SMTP isn't configured
 * or the send fails, it just logs and the app keeps working normally.
 */
async function sendMail({ to, subject, text, html }) {
  if (!emailConfigured) {
    console.log(`[email skipped - no SMTP configured] to=${to} subject="${subject}"`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.warn("Email send failed:", err.message);
  }
}

module.exports = { sendMail, emailConfigured };
