import cron from "node-cron";
import supabase from "../supabaseClient.js";
import { sendEmail } from "../services/emailService.js";

console.log("Email notification cron loaded");

cron.schedule("* * * * *", async () => {
  console.log("Cron triggered");

  const { data: notificationRows, error } = await supabase
    .from("Notification Time")
    .select("id, notif_time");

  if (error) {
    console.error("Error fetching notification times:", error);
    return;
  }

  // Current time in Singapore timezone
  const now = new Date();

  const singaporeTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Singapore",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const [currentHour, currentMinute] = singaporeTime
    .split(":")
    .map(Number);

  console.log(
    "Current SG time:",
    currentHour,
    currentMinute
  );


  const { data: authData, error: authError } =
    await supabase.auth.admin.listUsers();

  if (authError) {
    console.error("Error fetching users:", authError);
    return;
  }


  for (const row of notificationRows) {
    if (!row.notif_time) continue;

    // Convert stored timestamptz to Singapore time
    const notifTimeSG = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Singapore",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(row.notif_time));


    const [notifHour, notifMinute] = notifTimeSG
      .split(":")
      .map(Number);


    if (
      notifHour === currentHour &&
      notifMinute === currentMinute
    ) {
      console.log("Notification due:", row.id);


      const user = authData.users.find(
        (u) => u.id === row.id
      );

      if (!user) {
        console.log("User not found:", row.id);
        continue;
      }


      if (!user.email_confirmed_at) {
        console.log("Email not verified:", user.email);
        continue;
      }


      const name =
        user.user_metadata?.display_name ?? "User";


      await sendEmail(user.email, name);

      console.log("Email sent:", user.email);
    }
  }
});