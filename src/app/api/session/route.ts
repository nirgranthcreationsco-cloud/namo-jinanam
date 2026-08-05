import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const userId = await getSession();
    return NextResponse.json({ valid: !!userId, userId: userId || null });
  } catch {
    return NextResponse.json({ valid: false, userId: null });
  }
}
