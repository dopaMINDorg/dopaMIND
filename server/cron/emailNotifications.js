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


    if(running){

      console.log(
        "Previous cron still running"
      );

      return;

    }



    running = true;



    console.log(
      "========== CRON START =========="
    );



    try {


      const {
        data: notificationRows,
        error
      }
      =
      await supabase
        .from("Notification Time")
        .select(
          "id, notif_time"
        );



      if(error){

        console.error(
          "Fetch notification error:",
          error
        );

        return;

      }



      console.log(
        "Rows:",
        notificationRows.length
      );




      const currentSGTime =
        new Intl.DateTimeFormat(
          "en-US",
          {

            timeZone:
              "Asia/Singapore",

            hour:
              "2-digit",

            minute:
              "2-digit",

            hour12:false

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
      currentSGTime
        .split(":")
        .map(Number);




      const currentTotal =
        currentHour * 60 +
        currentMinute;



      console.log(
        "Current SG time:",
        currentSGTime
      );




      for(
        const row of notificationRows
      ){


        if(!row.notif_time){

          continue;

        }




        const [
          notifHour,
          notifMinute
        ]
        =
        row.notif_time
          .slice(0,5)
          .split(":")
          .map(Number);




        const notifTotal =
          notifHour * 60 +
          notifMinute;





        console.log({

          user:
            row.id,

          notificationTime:
            row.notif_time,

          currentTime:
            currentSGTime

        });





        /*
          Allow 5 minute delay
          Example:
          21:30 notification

          Sends:
          21:30
          21:31
          21:32
          21:33
          21:34
          21:35

        */


        if(
          currentTotal < notifTotal ||
          currentTotal > notifTotal + 5
        ){

          continue;

        }





        console.log(
          "Notification due:",
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
          "User email:",
          user.email
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