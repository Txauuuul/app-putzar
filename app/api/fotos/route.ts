import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { ensureAnonymousAuth } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET - Fetch photos for current user
export async function GET(req: NextRequest) {
  try {
    const userId = await ensureAnonymousAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get only the current user's photos
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

// POST - Upload photo URL (file upload is handled by Supabase Storage directly)
export async function POST(req: NextRequest) {
  try {
    console.log('🔍 [POST /api/fotos] Starting...');
    
    const userId = await ensureAnonymousAuth();
    console.log('✅ [POST /api/fotos] userId:', userId);
    
    if (!userId) {
      console.error('❌ [POST /api/fotos] Not authenticated');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    console.log('📝 [POST /api/fotos] body:', body);
    
    const { photo_url, accusation_id } = body;

    if (!photo_url) {
      console.error('❌ [POST /api/fotos] Missing photo URL');
      return NextResponse.json(
        { error: 'Missing photo URL' },
        { status: 400 }
      );
    }

    // Try to use admin client first, fallback to regular client
    let client = supabase;
    try {
      client = getSupabaseAdminClient();
      console.log('✅ [POST /api/fotos] Using admin client');
    } catch (e) {
      console.warn('⚠️ [POST /api/fotos] Admin client not available, using regular client');
    }

    console.log('💾 [POST /api/fotos] Inserting into database...');
    const { data, error } = await client
      .from('photos')
      .insert({
        user_id: userId,
        photo_url,
        accusation_id: accusation_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [POST /api/fotos] Database error:', error);
      throw error;
    }

    console.log('✅ [POST /api/fotos] Success:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('❌ [POST /api/fotos] Final error:', error);
    return NextResponse.json(
      { error: 'Failed to create photo record', details: String(error) },
      { status: 500 }
    );
  }
}
