import cron from "node-cron";
import supabase from "../supabaseClient.js";
import { sendEmail } from "../services/emailService.js";

console.log("Email notification cron loaded");

cron.schedule("* * * * *", async () => {
  console.log("Cron triggered");

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const { data, error } = await supabase
    .from("Notification Time")
    .select("id, notif_time");

  if (error) {
    console.error("Error fetching notification times:", error);
    return;
  }

  for (const row of data) {
    if (!row.notif_time) continue;

    const notifTime = new Date(row.notif_time);

    if (
      notifTime.getHours() === currentHour &&
      notifTime.getMinutes() === currentMinute
    ) {
      console.log("Notification due for user:", row.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("email, name")
        .eq("id", row.id)
        .single();

      if (profileError) {
        console.error(
          `Error fetching profile for user ${row.id}:`,
          profileError
        );
        continue;
      }

      if (!profile?.email) {
        console.log("No email found for user:", row.id);
        continue;
      }

      await sendEmail(profile.email, profile.name);
      console.log(`✅ Email sent to ${profile.email}`);
    }
  }
});