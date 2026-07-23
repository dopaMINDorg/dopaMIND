// // Follow this setup guide to integrate the Deno language server with your editor:
// // https://deno.land/manual/getting_started/setup_your_environment
// // This enables autocomplete, go to definition, etc.

// // Setup type definitions for built-in Supabase Runtime APIs
// import "@supabase/functions-js/edge-runtime.d.ts";
// import { withSupabase } from "@supabase/server";

// console.log("Hello from Functions!");

// // This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// // Use publishable for Client-facing, key-validated endpoints
// // Use secret for Server-to-server, internal calls
// export default {
//   fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
//     // Called by another service with a secret key
//     // ctx.supabaseAdmin bypasses RLS — use for privileged operations
//     /*
//     if (ctx.authMode === "secret") {
//       const { user_id } = await req.json();
//       const { data } = await ctx.supabaseAdmin.auth.admin.getUserById(user_id);

//       return Response.json({
//         email: data?.user?.email,
//       });
//     }
//     */

//     const { name } = await req.json();

//     return Response.json({
//       message: `Hello ${name}!`,
//     });
//   }),
// };

// /* To invoke locally:

//   1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
//   2. Make an HTTP request:

//   curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-preferences' \
//     --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
//     --data '{"name":"Functions"}'

// */


import "@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenAI } from "npm:@google/genai";
import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};


console.log("Generate preferences function running");

const ai = new GoogleGenAI({
  apiKey: Deno.env.get("GEMINI_API_KEY"),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {

  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    console.log("request received");
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

     console.log("prompt received");
     console.log("get user");
     
     const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return Response.json(
        { error: "Missing authorization header" },
        { status: 401 }
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );


    const {
      data: { user },
      error: userError,
    } = await supabaseAuth.auth.getUser();


    if (userError || !user) {
      return Response.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }


    const userId = user.id;
    console.log("call gemini");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `
You are a hobby recommendation assistant.

The user wants:
"${prompt}"

Suggest 3 hobbies.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations.

The JSON format must be:

[
  {
    "activity": "string",
    "time_hours": number,
    "time_minutes": number
  }
]

Example:
[
  {
    "activity": "Painting",
    "time_hours": 1,
    "time_minutes": 0
  }
]
      `,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned empty response");
    }

    console.log("gemini finished");
    const preferences = JSON.parse(text);
   

   console.log("insert into db");
    const { data, error } = await supabase
      .from("Preferences")
      .insert(
        preferences.map((pref: any) => ({
          activity: pref.activity,
          time_hours: pref.time_hours,
          time_minutes: pref.time_minutes,
          user_id: userId,
        }))
      )
      .select();


    if (error) {
      throw error;
    }

      console.log("insert finished")
    return Response.json({
      
      message: "inserted successfully",
      preferences: data},
    {
        headers: corsHeaders,
      });


  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: String(error),
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});