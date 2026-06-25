import supabase from "./supabaseClient.js";

async function test() {
  const { data, error } = await supabase
    .from("Notification Time")
    .select("*")
    .limit(1);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}

test();