'use server';

import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function fetchAcceptedSankalps() {
  try {
    const userId = await getSession();
    if (!userId) return { success: false, data: [] };

    const { data, error } = await supabase
      .from('lifetime_sankalp')
      .select('rule_id, accepted_at')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching sankalps:', error);
      return { success: false, data: [] };
    }

    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Fetch sankalps error:', error);
    return { success: false, data: [] };
  }
}

export async function acceptSankalpAction(ruleId: string, points: number) {
  try {
    const userId = await getSession();
    if (!userId) return { success: false, error: 'Unauthorized. Please log in.' };

    const acceptedAt = new Date().toISOString();

    // 1. Insert into lifetime_sankalp
    const { error: insertError } = await supabase
      .from('lifetime_sankalp')
      .insert({
        user_id: userId,
        rule_id: ruleId,
        accepted_at: acceptedAt
      });

    if (insertError) {
      if (insertError.code === '23505') {
        return { success: false, error: 'This Sankalp has already been accepted.' };
      }
      console.error('Insert sankalp error:', insertError);
      return { success: false, error: insertError.message };
    }

    // 2. Fetch current user_stats and add points
    const { data: stats } = await supabase
      .from('user_stats')
      .select('total_xp, bonus_xp')
      .eq('user_id', userId)
      .single();

    const newBonusXp = (stats?.bonus_xp || 0) + points;
    const newTotalXp = (stats?.total_xp || 0) + points;

    await supabase
      .from('user_stats')
      .update({
        bonus_xp: newBonusXp,
        total_xp: newTotalXp,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    return { 
      success: true, 
      acceptedAt,
      newTotalXp 
    };

  } catch (error: any) {
    console.error('Accept sankalp error:', error);
    return { success: false, error: error.message || 'Failed to accept Sankalp.' };
  }
}
