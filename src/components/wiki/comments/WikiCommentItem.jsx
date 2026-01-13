// src/components/wiki/comments/WikiCommentItem.jsx

import React, { useState } from 'react';
import { Trash2, Shield } from 'lucide-react';
import { useSelector } from 'react-redux';

const WikiCommentItem = ({ comment, onDelete }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [avatarError, setAvatarError] = useState(false);

  const isOwner = isAuthenticated && user?.username === comment.user?.username;
  const isAdmin = isAuthenticated && user?.roles?.includes('ROLE_ADMIN');
  const isModerator = isAuthenticated && user?.roles?.includes('ROLE_MODERATOR');
  const canDelete = isOwner || isAdmin || isModerator;

  // Yorum yapan kullanıcının rolleri
  const commentUserIsAdmin = comment.user?.roles?.includes('ROLE_ADMIN');
  const commentUserIsModerator = comment.user?.roles?.includes('ROLE_MODERATOR');
  const commentUserIsWriter = comment.user?.roles?.includes('ROLE_WRITER');

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
    <div className="p-6 hover:bg-slate-50/50 transition-colors">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 w-10 h-10">
          {comment.user?.avatarUrl && !avatarError ? (
            <img
              src={comment.user.avatarUrl}
              alt={comment.user.displayName || comment.user.username}
              className="w-full h-full rounded-full object-cover border-2 border-cbg"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              {(comment.user?.displayName || comment.user?.username || 'U')
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* User info */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-bold text-mtf">
              {comment.user?.displayName || comment.user?.username || 'Anonim'}
            </span>

            {/* Role badges */}
            {commentUserIsAdmin && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-bold flex items-center gap-1">
                <Shield size={12} />
                Admin
              </span>
            )}

            {commentUserIsModerator && !commentUserIsAdmin && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-bold flex items-center gap-1">
                <Shield size={12} />
                Moderatör
              </span>
            )}

            {commentUserIsWriter && !commentUserIsAdmin && !commentUserIsModerator && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold flex items-center gap-1">
                <Shield size={12} />
                Yazar
              </span>
            )}

            <span className="text-xs text-sti">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-sm text-mtf whitespace-pre-wrap break-words">
            {comment.content}
          </p>

          {/* Delete Button */}
          {canDelete && (
            <button
              onClick={() => {
                if (window.confirm('Bu yorumu silmek istediğine emin misin?')) {
                  onDelete(comment.id);
                }
              }}
              className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 size={12} />
              Sil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WikiCommentItem;