import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    const userId = await ensureAnonymousAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { photo_url, accusation_id } = body;

    if (!photo_url) {
      return NextResponse.json(
        { error: 'Missing photo URL' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('photos')
      .insert({
        user_id: userId,
        photo_url,
        accusation_id: accusation_id || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating photo record:', error);
    return NextResponse.json({ error: 'Failed to create photo record' }, { status: 500 });
  }
}
