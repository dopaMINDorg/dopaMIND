import cron from "node-cron";
import supabase from "../supabaseClient.js";


console.log(
  "Daily bonus cron loaded"
);



let running = false;



cron.schedule(
  "5 0 * * *",
  async () => {


    if (running) {

      console.log(
        "Daily bonus already running"
      );

      return;

    }


    running = true;


    console.log(
      "Running daily bonus check..."
    );


    try {


      const yesterday =
        new Date();


      yesterday.setDate(
        yesterday.getDate() - 1
      );



      const date =
        yesterday
          .toISOString()
          .split("T")[0];



      const start =
        `${date}T00:00:00.000Z`;

      const end =
        `${date}T23:59:59.999Z`;



      const {
        data:events,
        error

      } =
        await supabase

          .from("events")

          .select(
            "user_id, completed, tags"
          )

          .gte(
            "start_time",
            start
          )

          .lte(
            "start_time",
            end
          );



      if(error){

        console.error(error);

        return;

      }



      console.log(
        "Events checked:",
        events.length
      );



      // keep your existing bonus logic here


    } catch(error){

      console.error(
        "Daily bonus failed:",
        error
      );


    } finally {


      running=false;


      console.log(
        "Daily bonus finished"
      );

    }


  }
);