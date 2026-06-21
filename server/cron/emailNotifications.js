import cron from "node-cron";
import supabase from "../supabaseClient.js";
import { sendEmail } from "../services/emailService.js";

cron.schedule("* * * * *", async () => {
  console.log("Cron triggered");
  const now = new Date();

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const { data, error } = await supabase
    .from("Notification Time")
    .select(`
      id,
      notif_time,
      user_id,
      profiles ( email )
    `);

  if (error) {
    console.error(error);
    return;
  } 
  if (data){
    console.log(data)
  }

  for (const row of data) {
    const notifTime = new Date(row.notif_time);

    if (
      notifTime.getHours() === currentHour &&
      notifTime.getMinutes() === currentMinute
    ) {
      const email = row.profiles?.email;

      if (email) {
        await sendEmail(email);
      } else {
        console.log("No email found for user:", row.user_id);
      }
    }
  }
});