// src/components/wiki/comments/WikiCommentSection.jsx
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MessageCircle, Send, Loader2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

// Hooks
import { useWikiComments, useAddWikiComment, useDeleteWikiComment } from '../../../hooks/useWikiCommentQueries';
import { useHomebrewComments, useAddHomebrewComment, useDeleteHomebrewComment } from '../../../hooks/useHomebrewCommentQueries';

// Components
import CommentItem from '../../blog/comments/CommentItem';

/**
 * Wiki & Homebrew Yorum Bölümü
 * 
 * @param {number} wikiId - Wiki/Homebrew ID
 * @param {boolean} isHomebrew - Homebrew mi? (servis seçimi için)
 */
const WikiCommentSection = ({ wikiId, isHomebrew = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // State
  const [comment, setComment] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 20;

  // Query & Mutations (Homebrew veya Wiki)
  const useComments = isHomebrew ? useHomebrewComments : useWikiComments;
  const useAddComment = isHomebrew ? useAddHomebrewComment : useAddWikiComment;
  const useDeleteComment = isHomebrew ? useDeleteHomebrewComment : useDeleteWikiComment;

  const { data, isLoading, error } = useComments(wikiId, page, PAGE_SIZE);
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();

  const comments = data?.content || [];
  const totalPages = data?.totalPages || 0;

  // === HANDLERS ===

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.warn('Yorum yapmak için giriş yapmalısınız');
      return;
    }

    if (!comment.trim()) {
      toast.warn('Yorum boş olamaz');
      return;
    }

    const payload = isHomebrew 
      ? { homebrewId: wikiId, content: comment.trim() }
      : { wikiId: wikiId, content: comment.trim() };

    addCommentMutation.mutate(payload, {
      onSuccess: () => {
        setComment('');
        setPage(0); // İlk sayfaya dön
      },
    });
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return (
    <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black text-mtf flex items-center gap-2">
          <MessageCircle size={20} className="text-cta" />
          Yorumlar
          {!isLoading && (
            <span className="text-sm text-sti font-normal">
              ({data?.totalElements || 0})
            </span>
          )}
        </h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {user?.username?.[0]?.toUpperCase() || '?'}
                  </span>
                )}
              </div>
            </div>

            {/* Input */}
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Yorumunuzu yazın..."
                rows={3}
                className="w-full p-3 bg-mbg border border-cbg rounded-xl text-mtf resize-none focus:border-cta focus:outline-none transition-colors"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!comment.trim() || addCommentMutation.isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-cta text-white rounded-lg font-bold hover:bg-cta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addCommentMutation.isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-amber-800">
            Yorum yapmak için{' '}
            <a href="/giris" className="font-bold underline hover:text-amber-900">
              giriş yapın
            </a>
          </p>
        </div>
      )}

      <hr className="border-cbg mb-6" />

      {/* Comments List */}
      <div>
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 size={48} className="mx-auto text-cta mb-3 animate-spin" />
            <p className="text-sti text-sm">Yorumlar yükleniyor...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-8">
            <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
            <p className="text-red-700 text-sm">
              {error.message || 'Yorumlar yüklenirken hata oluştu'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && comments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle size={48} className="mx-auto text-sti mb-3" />
            <p className="text-sti font-bold mb-1">Henüz yorum yok</p>
            <p className="text-sti text-sm">İlk yorumu yapan siz olun!</p>
          </div>
        )}

        {/* Comments */}
        {!isLoading && !error && comments.length > 0 && (
          <>
            <div className="space-y-0">
              {comments.map((commentItem) => (
                <CommentItem
                  key={commentItem.id}
                  comment={commentItem}
                  onDelete={handleDeleteComment}
                  isDeleting={deleteCommentMutation.isLoading}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-cbg">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-1 px-3 py-2 border border-cbg rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mbg transition-colors"
                >
                  <ChevronLeft size={16} />
                  Önceki
                </button>

                <span className="text-sm text-sti">
                  Sayfa {page + 1} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="flex items-center gap-1 px-3 py-2 border border-cbg rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mbg transition-colors"
                >
                  Sonraki
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WikiCommentSection;