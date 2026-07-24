import cron from "node-cron";
import supabase from "../supabaseClient.js";
import { sendEmail } from "../services/emailService.js";

console.log("Email notification cron loaded");

let running = false;

cron.schedule("* * * * *", async () => {
  if (running) {
    console.log("⚠️ Previous cron still running. Skipping...");
    return;
  }

  running = true;

  try {
    console.log("========== CRON START ==========");

    console.log("Fetching notification rows...");

    const { data: notificationRows, error } = await supabase
      .from("Notification Time")
      .select("id, notif_time");

    if (error) {
      console.error("Notification query failed:", error);
      return;
    }

    console.log(
      `Fetched ${notificationRows.length} notification rows`
    );

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
      `Current Singapore Time: ${currentHour}:${currentMinute}`
    );

    console.log("Fetching auth users...");

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error(authError);
      return;
    }

    console.log(
      `Fetched ${authData.users.length} users`
    );

    for (const row of notificationRows) {
      if (!row.notif_time) continue;

      const notifTimeSG = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Singapore",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(row.notif_time));

      const [notifHour, notifMinute] =
        notifTimeSG.split(":").map(Number);

      if (
        notifHour !== currentHour ||
        notifMinute !== currentMinute
      ) {
        continue;
      }

      console.log(`Notification due for ${row.id}`);

      const user = authData.users.find(
        (u) => u.id === row.id
      );

      if (!user) {
        console.log("User not found");
        continue;
      }

      if (!user.email_confirmed_at) {
        console.log(
          `${user.email} has not verified email`
        );
        continue;
      }

      const name =
        user.user_metadata?.display_name ?? "User";

      console.log(
        `Sending reminder to ${user.email}`
      );

      await sendEmail(user.email, name);

      console.log(
        `Reminder completed for ${user.email}`
      );
    }

    console.log("========== CRON END ==========");
  } catch (err) {
    console.error("CRON FAILED");
    console.error(err);
  } finally {
    running = false;
  }
});