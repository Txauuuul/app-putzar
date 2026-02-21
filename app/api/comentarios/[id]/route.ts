import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { ensureAnonymousAuth } from '@/lib/supabase';

export const runtime = 'nodejs';

interface Params {
  id: string;
}

// DELETE - Delete comment
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

    // Get the comment to check ownership
    const { data: comment, error: fetchError } = await supabase
      .from('photo_comments')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    // Check if user is owner
    if (comment.user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the comment
    const { error: deleteError } = await supabase
      .from('photo_comments')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
