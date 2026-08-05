import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { sendEmail } from "./services/emailService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../.env"),
});

try {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD);
  const result = await sendEmail(
  "abc@gmail.com", // this does not work anymore - to try hardcode a real email
  "Test Email",
  "This is a test email from DopaMIND."
);
  console.log(result);
} catch (err) {
  console.error(err);
}