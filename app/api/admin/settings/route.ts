import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/auth';

export const runtime = 'nodejs';

// GET - Fetch settings
export async function GET(req: NextRequest) {
  try {
    const adminPin = req.headers.get('x-admin-pin');

    if (!adminPin || !verifyAdminPin(adminPin)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();

    if (error && error.code === 'PGRST116') {
      // No settings exist, create default
      const { data: newSettings, error: insertError } = await supabase
        .from('settings')
        .insert({ notifications_enabled: true })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json(newSettings);
    }

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
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
