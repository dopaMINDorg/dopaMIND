import cron from "node-cron";
import supabase from "../supabaseClient.js";
import { sendEmail } from "../services/emailService.js";


console.log(
  "Email notification cron loaded"
);



let running = false;




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
      }
      =
      await supabase
        .from("Notification Time")
        .select(
          "id, notification_time"
        );



      if(error){

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
        )
        .format(
          new Date()
        );



      const [
        currentHour,
        currentMinute
      ]
      =
      singaporeTime
        .split(":")
        .map(Number);



      console.log(
        "Current SG time:",
        singaporeTime
      );



      const currentTotal =
        currentHour * 60 +
        currentMinute;





      for(
        const row of notificationRows
      ){


        if(
          !row.notification_time
        ){

          console.log(
            "Missing notification time:",
            row.id
          );

          continue;

        }




        const [
          notifHour,
          notifMinute
        ]
        =
        row.notification_time
          .slice(0,5)
          .split(":")
          .map(Number);




        const notifTotal =
          notifHour * 60 +
          notifMinute;



        console.log(
          "TIME CHECK:",
          {

            user:
              row.id,

            notificationTime:
              `${String(notifHour).padStart(2,"0")}:${String(notifMinute).padStart(2,"0")}`,

            currentTime:
              singaporeTime,

          }
        );




        if(
          currentTotal < notifTotal ||
          currentTotal > notifTotal + 5
        ){

          console.log(
            "TIME NOT MATCHED:",
            row.id
          );

          continue;

        }



        console.log(
          "TIME MATCHED:",
          row.id
        );





        console.log(
          "Fetching auth user:",
          row.id
        );



        const {
          data:userData,
          error:userError
        }
        =
        await supabase.auth.admin
          .getUserById(
            row.id
          );




        console.log(
          "AUTH RESULT:",
          {
            email:
              userData?.user?.email,

            error:
              userError

          }
        );




        if(
          userError ||
          !userData?.user
        ){

          console.error(
            "User fetch failed:",
            userError
          );

          continue;

        }




        const user =
          userData.user;




        console.log(
          "EMAIL VERIFIED:",
          user.email_confirmed_at
        );




        if(
          !user.email_confirmed_at
        ){

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



        console.log(
          "Reminder sent:",
          user.email
        );


      }




    }catch(error){


      console.error(
        "CRON FAILED:",
        error
      );


    }finally{


      running = false;


      console.log(
        "========== CRON END =========="
      );


    }


  }
);