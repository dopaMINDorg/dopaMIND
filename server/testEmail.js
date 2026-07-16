import { sendEmail } from "./services/emailService.js";

try {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("APP_PASSWORD:", process.env.EMAIL_APP_PASSWORD);
  const result = await sendEmail("jyothsana.naren@gmail.com");
  console.log(result);
} catch (err) {
  console.error(err);
}