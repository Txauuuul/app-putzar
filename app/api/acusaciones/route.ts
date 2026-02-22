import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { ensureAnonymousAuth } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET - Fetch accusations for current user or all (if admin)
export async function GET(req: NextRequest) {
  try {
    const userId = await ensureAnonymousAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get only the current user's accusations
    const { data, error } = await supabase
      .from('accusations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching accusations:', error);
    return NextResponse.json({ error: 'Failed to fetch accusations' }, { status: 500 });
  }
}

// POST - Create new accusation
export async function POST(req: NextRequest) {
  try {
    console.log('🔍 [POST /api/acusaciones] Starting...');
    
    const userId = await ensureAnonymousAuth();
    console.log('✅ [POST /api/acusaciones] userId:', userId);
    
    if (!userId) {
      console.error('❌ [POST /api/acusaciones] Not authenticated');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    console.log('📝 [POST /api/acusaciones] body:', body);
    
    const { accused_name, reason } = body;

    if (!accused_name || !reason) {
      console.error('❌ [POST /api/acusaciones] Missing fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to use admin client first, fallback to regular client
    let client = supabase;
    try {
      client = getSupabaseAdminClient();
      console.log('✅ [POST /api/acusaciones] Using admin client');
    } catch (e) {
      console.warn('⚠️ [POST /api/acusaciones] Admin client not available, using regular client');
    }

    console.log('💾 [POST /api/acusaciones] Inserting into database...');
    const { data, error } = await client
      .from('accusations')
      .insert({
        user_id: userId,
        accused_name,
        reason,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [POST /api/acusaciones] Database error:', error);
      throw error;
    }

    console.log('✅ [POST /api/acusaciones] Success:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('❌ [POST /api/acusaciones] Final error:', error);
    return NextResponse.json(
      { error: 'Failed to create accusation', details: String(error) },
      { status: 500 }
    );
  }
}
