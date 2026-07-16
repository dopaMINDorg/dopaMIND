import dotenv from "dotenv";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log(
  "APP PASSWORD LENGTH:",
  process.env.EMAIL_APP_PASSWORD?.length
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(email, name) {
  console.log("➡️ Sending email to:", email);

  try {
    const info = await transporter.sendMail({
      from: `"DopaMind" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Hi ${name}, it's time to check in! 🌿`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e5e5e5; border-radius: 10px;">
          <h2 style="color: #4CAF50;">Hello ${name}! 👋</h2>

          <p>
            This is your scheduled reminder from <strong>DopaMind</strong>.
          </p>

          <p>
            Take a moment to review your schedule, complete a task, or simply
            pause for a mindful break.
          </p>

          <div style="background:#f7f7f7;padding:16px;border-radius:8px;margin:20px 0;">
            <strong>🌱 Today's reminder</strong>
            <p style="margin-top:8px;">
              Small, consistent progress leads to meaningful change.
            </p>
          </div>

          <p>
            Have a productive and balanced day!
          </p>

          <p>
            — The DopaMind Team 💙
          </p>
        </div>
      `,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
}
