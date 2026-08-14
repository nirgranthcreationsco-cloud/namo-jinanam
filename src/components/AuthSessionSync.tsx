"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";

export function AuthSessionSync() {
  const { user, _hasHydrated, logout, setProfile, setStats } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    // If no user is logged in client-side, nothing to validate
    if (!user?.id) return;

    let isMounted = true;

    async function validateUserSession() {
      try {
        // Check if this user still exists in the Supabase database
        const { data: dbUser, error: userError } = await supabase
          .from("users")
          .select("id, full_name, phone, email, guardian_name, guardian_phone, gender, age_group, dob, city, is_active, joined_at, last_login")
          .eq("id", user?.id)
          .maybeSingle();

        if (!isMounted) return;

        // If offline or network request failed, preserve local session (don't log out)
        if (typeof navigator !== "undefined" && !navigator.onLine) {
          return;
        }

        if (userError) {
          console.warn("[AuthSync] Network or Supabase query error, preserving local session:", userError.message);
          return;
        }

        // If query succeeded and DB explicitly confirmed user does not exist (e.g. DB reset/account deleted)
        if (!dbUser) {
          console.warn("[AuthSync] User ID not found in database. Purging stale local session...");
          logout();
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("namo-jinanam-auth");
            } catch (e) {
              console.error(e);
            }
          }
          return;
        }

        // If user exists, sync profile and stats fresh from DB
        setProfile(dbUser);

        const { data: freshStats } = await supabase
          .from("user_stats")
          .select("*")
          .eq("user_id", user?.id)
          .maybeSingle();

        if (isMounted && freshStats) {
          setStats(freshStats);
        }
      } catch (err) {
        console.error("[AuthSync] Error validating user session:", err);
      }
    }

    validateUserSession();

    return () => {
      isMounted = false;
    };
  }, [user?.id, _hasHydrated, logout, setProfile, setStats]);

  return null;
}
