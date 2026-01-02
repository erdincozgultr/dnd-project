// src/components/blog/comments/CommentItem.jsx

import React from 'react';
import { Trash2, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';

const CommentItem = ({ comment, onDelete, isDeleting }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Yetki kontrol
  const isOwner = isAuthenticated && user?.username === comment.user?.username;
  const isAdmin = isAuthenticated && user?.roles?.includes('ROLE_ADMIN');
  const isModerator = isAuthenticated && user?.roles?.includes('ROLE_MODERATOR');
  const canDelete = isOwner || isAdmin || isModerator;
  
  // Tarih formatlama
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="border-b border-cbg last:border-0 py-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.user?.avatarUrl ? (
            <img
              src={comment.user.avatarUrl}
              alt={comment.user.displayName || comment.user.username}
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center text-white font-bold">
              {(comment.user?.displayName || comment.user?.username || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User info */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-mtf">
              {comment.user?.displayName || comment.user?.username || 'Anonim'}
            </span>
            
            {/* Role badge */}
            {(isAdmin || isModerator) && comment.user && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold flex items-center gap-1">
                <Shield size={12} />
                {isAdmin ? 'Admin' : 'Mod'}
              </span>
            )}
            
            <span className="text-xs text-sti">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          
          {/* Comment text */}
          <p className="text-mtf whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        </div>
        
        {/* Actions */}
        {canDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            className="flex-shrink-0 p-2 text-sti hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Yorumu sil"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;