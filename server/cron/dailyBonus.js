import cron from "node-cron";
import supabase from "../supabaseClient.js";

console.log("Daily bonus cron loaded");

cron.schedule("5 12 * * *", async () => {
  console.log("Running daily bonus check...");

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const date = yesterday.toISOString().split("T")[0];

  const start = `${date}T00:00:00.000Z`;
  const end = `${date}T23:59:59.999Z`;

  const { data: events, error } = await supabase
    .from("events")
    .select("user_id, completed, tags")
    .gte("start_time", start)
    .lte("start_time", end);

  if (error) {
    console.error(error);
    return;
  }

  const grouped = {};

  for (const event of events) {
    if (!grouped[event.user_id]) {
      grouped[event.user_id] = [];
    }

    grouped[event.user_id].push(event);
  }


  for (const userId of Object.keys(grouped)) {

    const userEvents = grouped[userId];

    const tasks = userEvents.filter(
      e => e.tags !== "relax"
    );

    const relaxActivities = userEvents.filter(
      e => e.tags === "relax"
    );


    const allTasksCompleted =
      tasks.length > 0 &&
      tasks.every(t => t.completed === true);


    const completedRelax =
      relaxActivities.some(
        r => r.completed === true
      );


    let bonusPoints = 0;
    let rewardTypes = [];


    // Bonus 1: Complete all tasks
    if (allTasksCompleted) {
      bonusPoints += 20;
      rewardTypes.push("all_tasks_bonus");
    }


    // Bonus 2: Complete all tasks + relax
    if (allTasksCompleted && completedRelax) {
      bonusPoints += 20;
      rewardTypes.push("daily_bonus");
    }


    // No bonuses earned
    if (bonusPoints === 0) {
      continue;
    }


    // Prevent duplicate rewards
    for (const rewardType of rewardTypes) {

      const { data: existingReward } = await supabase
        .from("reward_history")
        .select("id")
        .eq("user_id", userId)
        .eq("reward_date", date)
        .eq("reward_type", rewardType)
        .maybeSingle();


      if (existingReward) {
        // already awarded this bonus
        bonusPoints -= rewardType === "all_tasks_bonus" ? 20 : 20;
        continue;
      }


      await supabase
        .from("reward_history")
        .insert({
          user_id: userId,
          reward_date: date,
          reward_type: rewardType,
          points_awarded: 20,
        });

    }


    if (bonusPoints <= 0) {
      continue;
    }


    const { data: pointData, error: pointError } =
      await supabase
        .from("points")
        .select("points")
        .eq("id", userId)
        .single();


    if (pointError) {
      console.error(pointError);
      continue;
    }


    await supabase
      .from("points")
      .update({
        points: pointData.points + bonusPoints,
      })
      .eq("id", userId);


    console.log(
      `Awarded ${bonusPoints} daily bonus points to ${userId}`
    );
  }
});

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