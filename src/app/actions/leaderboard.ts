'use server';

import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export interface LeaderboardUser {
  rank: number;
  userId: string;
  fullName: string;
  city: string;
  ageGroup?: string;
  totalXp: number;
  currentStreak: number;
  daysCompleted: number;
}

export async function getLeaderboard(ageGroup?: string) {
  try {
    const currentUserId = await getSession();

    // Query users from user_stats ordered by total_xp, optionally filtered by age_group
    let query = supabase
      .from('user_stats')
      .select(`
        user_id,
        total_xp,
        current_streak,
        days_completed,
        users!inner (
          full_name,
          city,
          age_group
        )
      `)
      .order('total_xp', { ascending: false });

    if (ageGroup && ageGroup !== 'all') {
      query = query.eq('users.age_group', ageGroup);
    }

    const { data: statsData, error } = await query.limit(50);

    if (error || !statsData) {
      console.error('Error fetching leaderboard:', error);
      return { success: false, leaderboard: [], currentUserRank: null };
    }

    const leaderboard: LeaderboardUser[] = statsData.map((item: any, idx: number) => {
      const userObj = Array.isArray(item.users) ? item.users[0] : item.users;
      return {
        rank: idx + 1,
        userId: item.user_id,
        fullName: userObj?.full_name || 'साधक',
        city: userObj?.city || 'भारत',
        ageGroup: userObj?.age_group,
        totalXp: item.total_xp || 0,
        currentStreak: item.current_streak || 0,
        daysCompleted: item.days_completed || 0,
      };
    });

    // Find current logged in user's rank
    let currentUserRank: LeaderboardUser | null = null;
    if (currentUserId) {
      const found = leaderboard.find((u) => u.userId === currentUserId);
      if (found) {
        currentUserRank = found;
      } else {
        // Fetch current user's stats if outside top 50
        const { data: myStats } = await supabase
          .from('user_stats')
          .select(`
            user_id,
            total_xp,
            current_streak,
            days_completed,
            users (
              full_name,
              city,
              age_group
            )
          `)
          .eq('user_id', currentUserId)
          .single();

        if (myStats) {
          const userObj = Array.isArray(myStats.users) ? myStats.users[0] : myStats.users;
          
          // Count users with more total_xp (optionally in same age group)
          let countQuery = supabase
            .from('user_stats')
            .select('user_id, users!inner(age_group)', { count: 'exact', head: true })
            .gt('total_xp', myStats.total_xp || 0);

          if (ageGroup && ageGroup !== 'all') {
            countQuery = countQuery.eq('users.age_group', ageGroup);
          }

          const { count } = await countQuery;

          currentUserRank = {
            rank: (count || 0) + 1,
            userId: myStats.user_id,
            fullName: userObj?.full_name || 'साधक',
            city: userObj?.city || 'भारत',
            ageGroup: userObj?.age_group,
            totalXp: myStats.total_xp || 0,
            currentStreak: myStats.current_streak || 0,
            daysCompleted: myStats.days_completed || 0,
          };
        }
      }
    }

    return {
      success: true,
      leaderboard,
      currentUserRank,
    };
  } catch (err: any) {
    console.error('getLeaderboard exception:', err);
    return { success: false, leaderboard: [], currentUserRank: null };
  }
}
