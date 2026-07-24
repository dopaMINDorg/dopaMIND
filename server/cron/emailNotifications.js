import cron from "node-cron";
import supabase from "../supabaseClient.js";
import { sendEmail } from "../services/emailService.js";

console.log("Email notification cron loaded");

cron.schedule("* * * * *", async () => {
  console.log("========== CRON START ==========");

  try {
    console.log("Fetching notification rows...");

    const { data: notificationRows, error } = await supabase
      .from("Notification Time")
      .select("id, notif_time");

    if (error) {
      console.error(
        "Error fetching notification times:",
        error
      );
      return;
    }

    console.log(
      `Fetched ${notificationRows.length} notification rows`
    );


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


    console.log("Fetching auth users...");

    const { data: authData, error: authError } =
      await supabase.auth.admin.listUsers();


    if (authError) {
      console.error(
        "Error fetching users:",
        authError
      );
      return;
    }


    console.log(
      `Fetched ${authData.users.length} users`
    );


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

        console.log(
          "Notification due for:",
          row.id
        );


        const user = authData.users.find(
          (u) => u.id === row.id
        );


        if (!user) {
          console.log(
            "User not found:",
            row.id
          );
          continue;
        }


        if (!user.email_confirmed_at) {
          console.log(
            "Email not verified:",
            user.email
          );
          continue;
        }


        const name =
          user.user_metadata?.display_name ?? "User";


        try {

          console.log(
            "Sending reminder to:",
            user.email
          );


          await sendEmail(
            user.email,
            "DopaMIND Reminder",
            `Hi ${name}, this is your scheduled reminder from DopaMIND.`
          );


          console.log(
            "Reminder completed for:",
            user.email
          );


        } catch (emailError) {

          console.error(
            "Email failed for:",
            user.email,
            emailError.message
          );

          // Continue checking other users
          continue;
        }
      }
    }


  } catch (error) {

    console.error(
      "CRON FAILED:",
      error
    );

  }


  console.log("========== CRON END ==========");
});