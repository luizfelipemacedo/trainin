import jwt_decode from "jwt-decode";
import { supabase } from "../config/supabaseConfig";
import baseUrl from "../config/baseUrl";

export async function authenticateWithGoogle() {
  try {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/pages/create-profile.html`,
      },
    });
  } catch (error) {
    console.error("An error occurred during authentication:", error);
  }
}

export function saveTokenToLocalStorage() {
  const url = location.href;

  function extractAccessToken(url) {
    const accessTokenMatch = url.match(/access_token=([^&]+)/);
    if (accessTokenMatch && accessTokenMatch.length > 1) {
      return accessTokenMatch[1];
    }
    return null;
  }

  const supabaseLocalStorageKey = JSON.parse(
    localStorage.getItem("sb-nutpqerdnsozmmxqzbyj-auth-token")
  )?.access_token;

  const accessToken = extractAccessToken(url) ?? supabaseLocalStorageKey;

  localStorage.setItem("access_token", accessToken);
}

export function decodedToken() {
  try {
    let access_token = "";

    if (localStorage.getItem("access_token")) {
      access_token = localStorage.getItem("access_token");
    }

    if (localStorage.getItem("sb-nutpqerdnsozmmxqzbyj-auth-token")) {
      access_token = JSON.parse(
        localStorage.getItem("sb-nutpqerdnsozmmxqzbyj-auth-token")
      ).access_token;
    }

    if (!access_token) {
      throw new Error("No access token found");
    }
    const decoded = jwt_decode(access_token);
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
}
