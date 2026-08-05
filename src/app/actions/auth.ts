'use server';

import { supabase } from '@/lib/supabase';
import { SignupFormData, User } from '@/types';
import bcrypt from 'bcrypt';
import { createSession, destroySession, getSession } from '@/lib/session';

export async function signupAction(data: SignupFormData) {
  try {
    // 1. Check if user already exists
    const phoneVal = data.phone ? data.phone.trim() : null;
    const emailVal = data.email ? data.email.trim() : null;

    if (!phoneVal && !emailVal) {
      return { success: false, error: 'Either mobile number or email is required.' };
    }

    let query = supabase.from('users').select('id');
    const conditions = [];
    if (phoneVal) conditions.push(`phone.eq.${phoneVal}`);
    if (emailVal) conditions.push(`email.eq.${emailVal}`);

    const { data: existingUser } = await query.or(conditions.join(',')).single();

    if (existingUser) {
      return { success: false, error: 'User with this mobile number or email already exists.' };
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password || '', saltRounds);

    // 3. Insert user
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        full_name: data.full_name,
        phone: phoneVal || null,
        email: emailVal || null,
        password_hash: passwordHash,
        guardian_name: data.guardian_name || '',
        guardian_phone: data.guardian_phone || '',
        gender: data.gender || '',
        age_group: data.age_group || '',
        city: data.city || '',
      })
      .select('*')
      .single();

    if (userError || !newUser) {
      console.error('Error creating user:', userError);
      return { success: false, error: 'Failed to create user.' };
    }

    // 4. Initialize stats & leaderboard
    const { data: newStats } = await supabase
      .from('user_stats')
      .insert({ user_id: newUser.id })
      .select('*')
      .single();

    await supabase
      .from('leaderboard_cache')
      .insert({ user_id: newUser.id, total_points: 0 });

    // 5. Create Session
    await createSession(newUser.id);

    const { password_hash, ...safeUser } = newUser;

    return { success: true, user: safeUser, stats: newStats };
  } catch (err: any) {
    console.error('Signup error:', err);
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

export async function loginAction(identifier: string, password: string) {
  try {
    // 1. Find user by email or phone
    const isEmail = identifier.includes('@');
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, password_hash, full_name')
      .eq(isEmail ? 'email' : 'phone', identifier)
      .single();

    if (error || !user) {
      return { success: false, error: 'Invalid mobile/email or password.' };
    }

    // 2. Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return { success: false, error: 'Invalid mobile/email or password.' };
    }

    // 3. Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // 4. Create Session
    await createSession(user.id);

    return { success: true };
  } catch (err: any) {
    console.error('Login error:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function logoutAction() {
  await destroySession();
}

export async function getAuthUser(): Promise<User | null> {
  const userId = await getSession();
  if (!userId) return null;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !user) return null;

  // Don't return password_hash to the client
  const { password_hash, ...safeUser } = user;
  return safeUser as User;
}
