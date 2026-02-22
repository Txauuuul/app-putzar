import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/auth';

export const runtime = 'nodejs';

// GET - Fetch settings
export async function GET(req: NextRequest) {
  try {
    console.log('\n🔍 [GET /api/admin/settings] Starting...');
    
    const adminPin = req.headers.get('x-admin-pin');
    console.log('🔑 [GET /api/admin/settings] Admin PIN received');

    if (!adminPin || !verifyAdminPin(adminPin)) {
      console.log('❌ [GET /api/admin/settings] PIN verification failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log('✅ [GET /api/admin/settings] PIN verified');

    // Get all settings (don't use .single() because table might be empty)
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.warn('⚠️ [GET /api/admin/settings] Query error, returning defaults:', error.message);
      // Table might not exist yet, return defaults
      return NextResponse.json({
        notifications_enabled: true,
      });
    }

    // If no settings exist, return defaults
    if (!data || data.length === 0) {
      console.log('ℹ️ [GET /api/admin/settings] No settings found, returning defaults');
      return NextResponse.json({
        notifications_enabled: true,
      });
    }

    console.log('✅ [GET /api/admin/settings] Success, returning settings');
    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('❌ [GET /api/admin/settings] Unexpected error:', error);
    // Return defaults even on error
    return NextResponse.json({
      notifications_enabled: true,
    });
  }
}

// PUT - Update settings
export async function PUT(req: NextRequest) {
  try {
    const adminPin = req.headers.get('x-admin-pin');

    if (!adminPin || !verifyAdminPin(adminPin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { notifications_enabled } = body;

    if (typeof notifications_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid notifications_enabled value' },
        { status: 400 }
      );
    }

    // Get current settings ID
    const { data: settings, error: fetchError } = await supabase
      .from('settings')
      .select('id')
      .single();

    let settingsId = settings?.id;

    // If no settings exist, create one
    if (!settingsId) {
      const { data: newSettings, error: insertError } = await supabase
        .from('settings')
        .insert({ notifications_enabled })
        .select('id')
        .single();

      if (insertError) {
        throw insertError;
      }

      settingsId = newSettings?.id;
    } else {
      // Update existing settings
      const { error: updateError } = await supabase
        .from('settings')
        .update({
          notifications_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settingsId);

      if (updateError) {
        throw updateError;
      }
    }

    // Return updated settings
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', settingsId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
