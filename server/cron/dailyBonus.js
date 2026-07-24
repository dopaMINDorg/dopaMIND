import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_APP_PASSWORD exists:",
  !!process.env.EMAIL_APP_PASSWORD
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection without crashing server
transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});


export async function sendEmail(to, subject, text) {
  try {
    console.log(`➡️ Sending email to ${to}`);

    const info = await transporter.sendMail({
      from: `"DopaMIND" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent:", info.messageId);

    return info;

  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
}

export default transporter;