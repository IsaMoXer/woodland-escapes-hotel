import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://gksmexnikysrbyobnsrp.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrc21leG5pa3lzcmJ5b2Juc3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA2ODgwMDAsImV4cCI6MjAzNjI2NDAwMH0.ro0WNTekIJDGF9rwooeKessNIarv7XSYU7H4gLrSPwA";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
