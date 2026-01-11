// src/components/moderation/BlogModeration.jsx

import React, { useState } from 'react';
import { Archive, Eye, Loader2, Calendar, Edit } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moderationService from '../../services/moderationService';
import { toast } from 'react-toastify';
import ModerationActionModal from './ModerationActionModal';

const BlogModeration = () => {
  const [filter, setFilter] = useState('published');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();

  // Fetch blogs
  const { data, isLoading } = useQuery({
    queryKey: ['mod-blogs', filter, page],
    queryFn: () => {
      if (filter === 'published') {
        return moderationService.getPublishedBlogs(page, 20);
      }
      const status = filter === 'all' ? null : filter.toUpperCase();
      return moderationService.getAllBlogs(status, page, 20);
    },
  });

  // Move to draft mutation
  const draftMutation = useMutation({
    mutationFn: ({ id, reason, messageToUser }) =>
      moderationService.moveBlogToDraft(id, reason, messageToUser),
    onSuccess: () => {
      queryClient.invalidateQueries(['mod-blogs']);
      toast.success('📦 Blog drafta alındı');
      setSelectedBlog(null);
      setActionType(null);
    },
    onError: () => toast.error('❌ İşlem başarısız'),
  });

  const handleAction = (blog, type) => {
    setSelectedBlog(blog);
    setActionType(type);
  };

  const handleSubmitAction = (data) => {
    const payload = {
      id: selectedBlog.id,
      reason: data.reason,
      messageToUser: data.messageToUser || null,
    };

    if (actionType === 'draft') {
      draftMutation.mutate(payload);
    }
  };

  const blogs = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['published', 'draft', 'archived', 'all'].map(f => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPage(0);
            }}
            className={`
              px-4 py-2 rounded-lg font-bold text-sm transition-colors
              ${filter === f
                ? 'bg-cta text-white'
                : 'bg-cbg text-sti hover:bg-cbg/70'
              }
            `}
          >
            {f === 'published' && '✅ Yayında'}
            {f === 'draft' && '📦 Taslak'}
            {f === 'archived' && '🗄️ Arşiv'}
            {f === 'all' && '📋 Tümü'}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-cta" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sti font-bold">Bu filtre için blog yok</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {blogs.map(blog => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onAction={handleAction}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 bg-cbg text-mtf rounded-lg font-bold disabled:opacity-50"
              >
                ← Önceki
              </button>
              <span className="px-4 py-2 bg-white text-mtf font-bold">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 bg-cbg text-mtf rounded-lg font-bold disabled:opacity-50"
              >
                Sonraki →
              </button>
            </div>
          )}
        </>
      )}

      {/* Action Modal */}
      {selectedBlog && actionType && (
        <ModerationActionModal
          isOpen={true}
          onClose={() => {
            setSelectedBlog(null);
            setActionType(null);
          }}
          onSubmit={handleSubmitAction}
          title="📦 Blog Drafta Al"
          itemName={selectedBlog.title}
          actionType={actionType}
        />
      )}
    </div>
  );
};

/**
 * Blog Card Component
 */
const BlogCard = ({ blog, onAction }) => {
  return (
    <div className="bg-mbg rounded-xl p-4 border border-cbg hover:border-cta transition-all">
      <div className="flex gap-4">
        {/* Cover Image */}
        {blog.coverImage && (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
        )}

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-mtf mb-1">
                {blog.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-sti">
                <span className="font-bold">
                  👤 {blog.author?.displayName || blog.author?.username}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(blog.createdAt).toLocaleDateString('tr-TR')}
                </span>
                {blog.category && (
                  <span className="px-2 py-1 bg-white rounded-lg font-bold">
                    {blog.category}
                  </span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <span className={`
              px-3 py-1 rounded-lg text-xs font-bold
              ${blog.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                blog.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                'bg-blue-100 text-blue-700'}
            `}>
              {blog.status === 'PUBLISHED' && '✅ Yayında'}
              {blog.status === 'DRAFT' && '📦 Taslak'}
              {blog.status === 'ARCHIVED' && '🗄️ Arşiv'}
            </span>
          </div>

          {blog.excerpt && (
            <p className="text-sm text-sti line-clamp-2 mb-3">
              {blog.excerpt}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {blog.status === 'PUBLISHED' && (
              <button
                onClick={() => onAction(blog, 'draft')}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
              >
                <Archive size={14} />
                Drafta Al
              </button>
            )}

            <a
              href={`/blog/${blog.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors"
            >
              <Eye size={14} />
              Görüntüle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogModeration;