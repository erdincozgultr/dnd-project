// src/components/blog/detail/BlogActions.jsx

import React, { useState } from 'react';
import { Heart, Share2, Bookmark } from 'lucide-react';
import { toast } from 'react-toastify';
import { useLikeBlog } from '../../../hooks/useBlogQueries';
import { useSelector } from 'react-redux';

/**
 * Blog aksiyon butonları - Like, Share, Bookmark
 */
const BlogActions = ({ blog }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [isLiked, setIsLiked] = useState(blog?.liked || false);
  const [likeCount, setLikeCount] = useState(blog?.likeCount || 0);
  
  const likeMutation = useLikeBlog(blog?.id);

  // Like handler
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Beğenmek için giriş yapmalısınız');
      return;
    }

    // Optimistic update (local state)
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);

    try {
      await likeMutation.mutateAsync();
      // TanStack Query cache'i güncelleyecek
    } catch (error) {
      // Rollback on error
      setIsLiked(prev => !prev);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    }
  };

  // Share handler
  const handleShare = async () => {
    const url = window.location.href;
    const title = blog?.title || 'Blog';

    // Check if Web Share API is available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} - Zar & Kule`,
          url,
        });
        toast.success('📤 Paylaşıldı!');
      } catch (error) {
        // User cancelled share
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      }
    } else {
      // Fallback: Copy to clipboard (desktop)
      try {
        await navigator.clipboard.writeText(url);
        toast.success('📋 Bağlantı kopyalandı!');
      } catch (error) {
        toast.error('Bağlantı kopyalanamadı');
      }
    }
  };

  // Bookmark handler (placeholder)
  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.info('Koleksiyona eklemek için giriş yapmalısınız');
      return;
    }
    
    // TODO: Koleksiyon API endpoint'i eklenince aktif olacak
    toast.info('🚧 Koleksiyon özelliği yakında geliyor!');
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-cbg shadow-lg z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-4">
          {/* Like Button */}
          <button
            onClick={handleLike}
            disabled={!isAuthenticated || likeMutation.isLoading}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all
              ${isLiked
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
                : 'bg-white border-2 border-cbg text-mtf hover:border-red-500 hover:text-red-500'
              }
              ${(!isAuthenticated || likeMutation.isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <Heart 
              size={20} 
              className={isLiked ? 'fill-current' : ''} 
            />
            <span>{isLiked ? 'Beğenildi' : 'Beğen'}</span>
            {likeCount > 0 && (
              <span className="ml-1">({likeCount})</span>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-cbg text-mtf rounded-xl font-bold text-sm hover:border-blue-500 hover:text-blue-500 transition-all"
          >
            <Share2 size={20} />
            <span>Paylaş</span>
          </button>

          {/* Bookmark Button - Placeholder */}
          <button
            onClick={handleBookmark}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-cbg text-mtf rounded-xl font-bold text-sm hover:border-amber-500 hover:text-amber-500 transition-all"
          >
            <Bookmark size={20} />
            <span className="hidden md:inline">Kaydet</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogActions;