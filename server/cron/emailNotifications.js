import cron from "node-cron";
import supabase from "../supabaseClient.js";
import { sendEmail } from "../services/emailService.js";


console.log(
  "Email notification cron loaded"
);



let running = false;



function timeoutPromise(promise, ms) {

  return Promise.race([

    promise,

    new Promise((_, reject) => {

      setTimeout(() => {

        reject(
          new Error(
            "Operation timed out"
          )
        );

      }, ms);

    }),

  ]);

}



cron.schedule(
  "* * * * *",
  async () => {


    if (running) {

      console.log(
        "Previous cron still running, skipping"
      );

      return;

    }


    running = true;



    console.log(
      "========== CRON START =========="
    );



    try {


      console.log(
        "Fetching notification rows..."
      );



      const {
        data: notificationRows,
        error
      } = await timeoutPromise(

        supabase
          .from("Notification Time")
          .select(
            "id, notif_time"
          ),

        15000

      );



      if (error) {

        console.error(
          "Notification fetch error:",
          error
        );

        return;

      }



      console.log(
        "Rows:",
        notificationRows.length
      );



      const singaporeTime =
        new Intl.DateTimeFormat(
          "en-US",
          {
            timeZone:
              "Asia/Singapore",

            hour:
              "2-digit",

            minute:
              "2-digit",

            hour12:false,
          }
        ).format(new Date());



      const [
        currentHour,
        currentMinute
      ] =
        singaporeTime
          .split(":")
          .map(Number);



      console.log(
        "Current SG time:",
        currentHour,
        currentMinute
      );




      for (
        const row of notificationRows
      ) {


        if (!row.notif_time)
          continue;



        const notifTimeSG =
          new Intl.DateTimeFormat(
            "en-US",
            {
              timeZone:
                "Asia/Singapore",

              hour:
                "2-digit",

              minute:
                "2-digit",

              hour12:false,
            }
          )
          .format(
            new Date(row.notif_time)
          );



        const [
          notifHour,
          notifMinute
        ] =
          notifTimeSG
            .split(":")
            .map(Number);




        if (
          notifHour !== currentHour ||
          notifMinute !== currentMinute
        ) {

          continue;

        }




        console.log(
          "Notification due:",
          row.id
        );



        const {
          data:userData,
          error:userError

        } =
          await supabase.auth.admin.getUserById(
            row.id
          );



        if (
          userError ||
          !userData?.user
        ) {

          console.error(
            "User fetch failed:",
            userError
          );

          continue;

        }



        const user =
          userData.user;



        if (
          !user.email_confirmed_at
        ) {

          console.log(
            "Email not verified:",
            user.email
          );

          continue;

        }



        const name =
          user.user_metadata
            ?.display_name ??
          "User";



        await sendEmail(

          user.email,

          "DopaMIND Reminder",

          `Hi ${name}, this is your scheduled reminder from DopaMIND.`

        );


      }



    } catch(error) {


      console.error(
        "CRON FAILED:",
        error
      );


    } finally {


      running = false;


      console.log(
        "========== CRON END =========="
      );

    }



  }
);