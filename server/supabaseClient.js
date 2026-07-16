import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});


/*console.log("URL:", process.env.REACT_APP_SUPABASE_URL);
console.log("Has key:", !!process.env.REACT_APP_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export default createClient(supabaseUrl, supabaseKey)*/



console.log("URL:", process.env.REACT_APP_SUPABASE_URL);
console.log("Has Service Key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
// Changed: Fetching the service role key from process.env
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Changed: Passing the service role key to the client
export default createClient(supabaseUrl, supabaseServiceKey)