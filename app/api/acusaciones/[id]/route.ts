import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ensureAnonymousAuth } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/auth';

export const runtime = 'nodejs';

interface Params {
  id: string;
}

// DELETE - Delete accusation (only for admin or owner)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const userId = await ensureAnonymousAuth();
    const { id } = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Try to get the admin PIN from the request header
    const adminPin = req.headers.get('x-admin-pin');
    let isAdmin = false;

    if (adminPin && verifyAdminPin(adminPin)) {
      isAdmin = true;
    }

    // Get the accusation to check ownership
    const { data: accusation, error: fetchError } = await supabase
      .from('accusations')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !accusation) {
      return NextResponse.json({ error: 'Accusation not found' }, { status: 404 });
    }

    // Check if user is owner or admin
    if (accusation.user_id !== userId && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the accusation (photos will cascade delete)
    const { error: deleteError } = await supabase
      .from('accusations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'Accusation deleted successfully' });
  } catch (error) {
    console.error('Error deleting accusation:', error);
    return NextResponse.json({ error: 'Failed to delete accusation' }, { status: 500 });
  }
}
