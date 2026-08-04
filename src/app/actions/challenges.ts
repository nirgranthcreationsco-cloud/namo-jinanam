"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

// Ensure the user is logged in
async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  const { data: session } = await supabase
    .from("sessions")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (!session || new Date(session.expires_at) < new Date()) {
    return null;
  }
  return session.user_id;
}

export async function fetchCompletedChallenges(dateStr: string) {
  try {
    const userId = await getSessionUser();
    if (!userId) return { success: false, error: "Unauthorized" };

    // Find all completed challenges for this date
    // IDs are formatted as: challenge_YYYY-MM-DD_challengeId
    const { data: allChallenges, error } = await supabase
      .from("bonus_progress")
      .select("bonus_id, completed_at")
      .eq("user_id", userId)
      .eq("completed", true)
      .like("bonus_id", `challenge_%`);
      
    if (error) throw error;
    
    // Filter for today's completed IDs
    const prefix = `challenge_${dateStr}_`;
    const todayCompleted = allChallenges.filter(row => row.bonus_id.startsWith(prefix));
    const completedIds = todayCompleted.map(row => row.bonus_id.replace(prefix, ''));
    
    // Calculate weekly and monthly counts based on completed_at
    const now = new Date(dateStr);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday start
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    let weeklyCount = 0;
    let monthlyCount = 0;
    
    allChallenges.forEach(row => {
      const d = new Date(row.completed_at);
      if (d >= startOfWeek) weeklyCount++;
      if (d >= startOfMonth) monthlyCount++;
    });
    
    return { success: true, completedIds, weeklyCount, monthlyCount };
  } catch (error: any) {
    console.error("Error fetching completed challenges:", error);
    return { success: false, error: error.message };
  }
}

export async function completeChallengeAction(dateStr: string, challengeId: string, xpReward: number) {
  try {
    const userId = await getSessionUser();
    if (!userId) return { success: false, error: "Unauthorized" };

    const bonusId = `challenge_${dateStr}_${challengeId}`;

    // 1. Check if already completed
    const { data: existing } = await supabase
      .from("bonus_progress")
      .select("id, completed")
      .eq("user_id", userId)
      .eq("bonus_id", bonusId)
      .single();

    if (existing?.completed) {
      return { success: false, error: "Challenge already completed" };
    }

    // 2. Mark as completed
    if (existing) {
      await supabase
        .from("bonus_progress")
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("bonus_progress")
        .insert({
          user_id: userId,
          bonus_id: bonusId,
          completed: true,
          completed_at: new Date().toISOString()
        });
    }

    // 3. Award XP directly via RPC or UPDATE
    // Note: We don't have a specific RPC for just adding XP, so we'll do an update.
    // However, to avoid race conditions, Postgres allows doing: SET total_xp = total_xp + X
    // Supabase JS doesn't support relative updates directly through ORM easily without RPC, 
    // but we can fetch current and add, or use a secure postgres function.
    // For now, fetch and update since user traffic per individual is low enough.
    
    const { data: stats } = await supabase
      .from("user_stats")
      .select("total_xp")
      .eq("user_id", userId)
      .single();
      
    const newTotalXp = (stats?.total_xp || 0) + xpReward;
    
    await supabase
      .from("user_stats")
      .update({ total_xp: newTotalXp })
      .eq("user_id", userId);

    return { success: true, newTotalXp };
  } catch (error: any) {
    console.error("Error completing challenge:", error);
    return { success: false, error: error.message };
  }
}
