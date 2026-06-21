import dotenv from "dotenv";
import path from "path";
import { Resend } from "resend";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FORCE ROOT .ENV
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});


const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email) {
  console.log("➡️ Sending email to:", email);
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Scheduled Notification ⏰",
      html: `
        <h2>Reminder</h2>
        <p>This is your scheduled email notification.</p>
      `,
    });

    return result;
  } catch (error) {
    console.error("Resend error:", error);
    throw error;
  }
}