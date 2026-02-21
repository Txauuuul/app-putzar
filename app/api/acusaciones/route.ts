import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    const userId = await ensureAnonymousAuth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { accused_name, reason } = body;

    if (!accused_name || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('accusations')
      .insert({
        user_id: userId,
        accused_name,
        reason,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating accusation:', error);
    return NextResponse.json({ error: 'Failed to create accusation' }, { status: 500 });
  }
}
