import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/auth';

export const runtime = 'nodejs';

// GET - Fetch all photos for admin (with multiple retry strategies)
export async function GET(req: NextRequest) {
  try {
    console.log('\n🔍 [GET /api/admin/fotos] Starting...');
    
    const adminPin = req.headers.get('x-admin-pin');
    console.log('🔑 [GET /api/admin/fotos] Admin PIN received');

    if (!adminPin || !verifyAdminPin(adminPin)) {
      console.log('❌ [GET /api/admin/fotos] PIN verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('✅ [GET /api/admin/fotos] PIN verified');

    // STRATEGY 1: Try admin client first (Service Role Key)
    try {
      console.log('📌 [GET /api/admin/fotos] Strategy 1: Using admin client with Service Role Key');
      const supabaseAdmin = getSupabaseAdminClient();
      const { data, error } = await supabaseAdmin
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`✅ [GET /api/admin/fotos] Strategy 1 success: ${data?.length || 0} records`);
      return NextResponse.json(data || []);
    } catch (adminError) {
      console.warn('⚠️ [GET /api/admin/fotos] Strategy 1 failed - will try Strategy 2');
    }

    // STRATEGY 2: Try regular client (if RLS policies allow public read)
    try {
      console.log('📌 [GET /api/admin/fotos] Strategy 2: Using regular client (RLS public read)');
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log(`✅ [GET /api/admin/fotos] Strategy 2 success: ${data?.length || 0} records`);
      return NextResponse.json(data || []);
    } catch (regularError) {
      console.error('❌ [GET /api/admin/fotos] Strategy 2 failed:', regularError);
      throw regularError;
    }
  } catch (error) {
    console.error('❌ [GET /api/admin/fotos] Final error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch photos',
        details: String(error),
        hint: 'Make sure SUPABASE_SERVICE_ROLE_KEY is configured OR execute SQL_ADMIN_SETUP.sql',
      },
      { status: 500 }
    );
  }
}
