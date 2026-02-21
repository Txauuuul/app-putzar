'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
}

interface PhotoCommentsProps {
  photoId: string;
}

export function PhotoComments({ photoId }: PhotoCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [photoId]);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await fetch(`/api/comentarios?photoId=${photoId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      toast({
        title: 'Error',
        description: 'Dale salsa a la foto o qué, ponte algo',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/comentarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo_id: photoId,
          comment: newComment,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create comment');
      }

      const newCommentData = await response.json();
      setComments([newCommentData, ...comments]);
      setNewComment('');

      toast({
        title: 'Comentario agregado',
        description: 'Tu comentario fue publicado',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Error',
        description: 'No pudimos agregar el comentario',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) return;

    try {
      const response = await fetch(`/api/comentarios/${commentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast({
        title: 'Comentario eliminado',
        description: 'El comentario fue eliminado',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'No pudimos eliminar el comentario',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-5 w-full">
      {/* Add Comment Form */}
      <form onSubmit={handleAddComment} className="space-y-3">
        <input
          type="text"
          placeholder="Agregar un comentario..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={loading}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/40 focus:bg-white/10 focus:border-white/30 focus:ring-2 focus:ring-purple-500/30 focus:outline-none transition-all"
        />
        <Button
          type="submit"
          disabled={loading || !newComment.trim()}
          className="w-full bg-gradient-to-r from-purple-500 via-purple-400 to-purple-500 hover:from-purple-600 hover:via-purple-500 hover:to-purple-600 text-white font-bold py-3 text-base rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 hover:scale-105 active:scale-95"
        >
          {loading ? '⏳ Publicando...' : '💬 Comentar'}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {loadingComments ? (
          <p className="text-sm text-white/60 text-center py-6">Cargando comentarios...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-white/60 text-center py-6">Sin comentarios aún</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2 hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs text-white/50">
                  {new Date(comment.created_at).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors hover:scale-125"
                >
                  🗑️
                </button>
              </div>
              <p className="text-sm text-white/80 break-words">{comment.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
