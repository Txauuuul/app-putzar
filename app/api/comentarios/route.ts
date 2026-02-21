import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ensureAnonymousAuth } from '@/lib/supabase';

export const runtime = 'nodejs';

// GET - Fetch comments for a photo
export async function GET(req: NextRequest) {
  try {
    const photoId = req.nextUrl.searchParams.get('photoId');

    if (!photoId) {
      return NextResponse.json({ error: 'Missing photoId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('photo_comments')
      .select('*')
      .eq('photo_id', photoId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// POST - Create comment
export async function POST(req: NextRequest) {
  try {
    const userId = await ensureAnonymousAuth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { photo_id, comment } = body;

    if (!photo_id || !comment || !comment.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('photo_comments')
      .insert({
        photo_id,
        user_id: userId,
        comment: comment.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
