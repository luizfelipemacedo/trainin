import { createClient } from "@supabase/supabase-js";

const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY;

export const supabase = createClient(
  "https://nutpqerdnsozmmxqzbyj.supabase.co",
  supabaseKey
);
