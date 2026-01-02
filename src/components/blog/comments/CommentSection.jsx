// src/components/blog/comments/CommentSection.jsx

import React, { useState } from 'react';
import { MessageCircle, Loader, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { useBlogComments, useAddComment, useDeleteComment } from '../../../hooks/useBlogQueries';

const CommentSection = ({ blogId }) => {
  const [page, setPage] = useState(0);
  const size = 20;
  
  // TanStack Query hooks
  const { data, isLoading, error } = useBlogComments(blogId, page, size);
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();
  
  // Pagination
  const comments = data?.content || [];
  const totalPages = data?.totalPages || 0;
  const totalElements = data?.totalElements || 0;
  
  // Handlers
  const handleAddComment = async (commentData) => {
    await addCommentMutation.mutateAsync(commentData);
  };
  
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) {
      return;
    }
    
    await deleteCommentMutation.mutateAsync(commentId);
  };
  
  return (
    <div className="bg-white rounded-xl border border-cbg p-6 mt-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={24} className="text-cta" />
        <h2 className="text-2xl font-black text-mtf">
          Yorumlar
        </h2>
        <span className="text-sti text-sm">
          ({totalElements})
        </span>
      </div>
      
      {/* Comment Form */}
      <CommentForm
        blogId={blogId}
        onSubmit={handleAddComment}
        isSubmitting={addCommentMutation.isLoading}
      />
      
      {/* Divider */}
      <div className="h-px bg-cbg my-6"></div>
      
      {/* Comments List */}
      <div>
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={32} className="text-cta animate-spin mb-3" />
            <p className="text-sti text-sm">Yorumlar yükleniyor...</p>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
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
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={handleDeleteComment}
                  isDeleting={deleteCommentMutation.isLoading}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 pt-6 border-t border-cbg">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
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
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
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

export default CommentSection;