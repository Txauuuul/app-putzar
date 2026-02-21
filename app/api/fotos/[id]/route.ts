import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ensureAnonymousAuth } from '@/lib/supabase';
import { verifyAdminPin } from '@/lib/auth';

export const runtime = 'nodejs';

interface Params {
  id: string;
}

// DELETE - Delete photo (only for admin or owner)
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

    // Get the photo to check ownership
    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('user_id, photo_url')
      .eq('id', id)
      .single();

    if (fetchError || !photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Check if user is owner or admin
    if (photo.user_id !== userId && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete from storage if it's a Supabase storage URL
    if (photo.photo_url.includes('/storage/v1/')) {
      try {
        const pathMatch = photo.photo_url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
        if (pathMatch) {
          const bucket = pathMatch[1];
          const path = pathMatch[2];
          await supabase.storage.from(bucket).remove([path]);
        }
      } catch (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete the photo record
    const { error: deleteError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: 'Failed to delete photo' }, { status: 500 });
  }
}
