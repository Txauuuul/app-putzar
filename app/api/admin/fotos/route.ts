import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/auth';

export const runtime = 'nodejs';

// GET - Fetch all photos for admin (bypasses RLS if service role key available)
export async function GET(req: NextRequest) {
  try {
    const adminPin = req.headers.get('x-admin-pin');

    if (!adminPin || !verifyAdminPin(adminPin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Try to use admin client first, fallback to regular client
    let client = supabase;
    try {
      client = getSupabaseAdminClient();
    } catch (e) {
      console.warn('Admin client not available, using regular client. Ensure RLS policies allow public read.');
      client = supabase;
    }

    const { data, error } = await client
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching all photos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch photos', details: String(error) },
      { status: 500 }
    );
  }
}
