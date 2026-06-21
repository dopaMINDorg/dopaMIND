import cron from "node-cron";
import supabase from "../supabaseClient.js";
console.log("midnightUpdates file loaded");

//cron.schedule("*/10 * * * * *", async () => {
  /*console.log("Running midnight update...");
  console.log(user);
  const now = new Date().toISOString()

  const { data } = await supabase
    .from("Notification Time")
    .select("*")
    .lte("effective_date", now)

  for (const user of data) {
    await supabase
      .from("Notification Time")
      .update({
        active_time: user.pending_time,
        pending_time: null,
        effective_date: null
      })
      .eq("id", user.id)  
  }
})*/

cron.schedule("* * * * *", async () => {
  console.log("CRON RUNNING");

  const { data, error } = await supabase
    .from("Notification Time")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  console.log("DATA:", data);

  for (const row of data) {
    console.log("ROW:", row);
  }
}); //need to debug the user email issues on this end of the code
