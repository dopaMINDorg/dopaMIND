import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});


console.log("URL:", process.env.REACT_APP_SUPABASE_URL);
console.log("Has Service Key:", !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export default createClient(supabaseUrl, supabaseServiceKey)