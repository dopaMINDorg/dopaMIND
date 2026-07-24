import nodemailer from "nodemailer";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "EMAIL_APP_PASSWORD exists:",
  !!process.env.EMAIL_APP_PASSWORD
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});


transporter.verify((error) => {
  if (error) {
    console.error(
      "❌ SMTP verification failed:",
      error.message
    );
    return;
  }

  console.log("✅ SMTP Ready");
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

    console.log(
      "✅ Email sent:",
      info.messageId
    );

    return info;

  } catch (error) {
    console.error(
      "❌ Email send failed:",
      error.message
    );

    throw error;
  }
}


export default transporter;