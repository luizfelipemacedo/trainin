import { supabase } from "../config/supabaseConfig";

export async function authenticateWithGoogle() {
  try {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5500/home.html",
      },
    });

    if (error) {
      console.error("Authentication error:", error);
    } else {
      console.log("Authenticated user:", user);
      console.log("Authentication session:", session);
    }
  } catch (error) {
    console.error("An error occurred during authentication:", error);
  }
}
