import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/auth';

export const runtime = 'nodejs';

// GET - Fetch all photos for admin
export async function GET(req: NextRequest) {
  try {
    const adminPin = req.headers.get('x-admin-pin');

    if (!adminPin || !verifyAdminPin(adminPin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching all photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}
