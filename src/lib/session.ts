import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'nj_session_token';
const SESSION_EXPIRY_DAYS = 30;

/**
 * Generate a cryptographically secure random session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Calculate expiration date for a session
 */
export function getSessionExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS);
  return expiresAt;
}

/**
 * Create a new session for a user, store it in the database, and set the HttpOnly cookie.
 */
export async function createSession(userId: string) {
  const token = generateSessionToken();
  const expiresAt = getSessionExpiry();

  // 1. Store session in database
  const { error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      token,
      expires_at: expiresAt.toISOString(),
    });

  if (error) {
    console.error('Failed to store session in database:', error);
    throw new Error('Failed to create session');
  }

  // 2. Set HttpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

/**
 * Get the current session token from cookies
 */
export async function getSessionToken() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  return sessionCookie?.value;
}

/**
 * Validate the current session token against the database and return the user ID.
 * Implements sliding expiration (extends session if valid).
 */
export async function getSession() {
  const token = await getSessionToken();
  
  if (!token) {
    return null;
  }

  // Verify session in database
  const { data: session, error } = await supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .single();

  if (error || !session) {
    return null;
  }

  // Check if session has expired
  if (new Date(session.expires_at) < new Date()) {
    // Delete expired session
    await supabase.from('sessions').delete().eq('token', token);
    return null;
  }

  // Sliding expiration: Update expiration date in DB and cookie
  const newExpiresAt = getSessionExpiry();
  
  // Update DB asynchronously in the background
  supabase
    .from('sessions')
    .update({ expires_at: newExpiresAt.toISOString() })
    .eq('token', token)
    .then(({ error }) => {
      if (error) console.error('Failed to slide session expiration:', error);
    });

  // Update cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: newExpiresAt,
    path: '/',
  });

  return session.user_id as string;
}

/**
 * Destroy the current session
 */
export async function destroySession() {
  const token = await getSessionToken();
  
  if (token) {
    // 1. Delete from database
    await supabase.from('sessions').delete().eq('token', token);
  }

  // 2. Remove cookie
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
