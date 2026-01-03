// src/pages/blog/MyBlogsPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Edit, Trash2, Archive, Eye, Heart, Clock,
  FileText, Loader, AlertCircle, Filter
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useMyBlogs, useDeleteBlog, useUpdateBlog } from '../../hooks/useBlogQueries';
import { blogService } from '../../services/blogService'; // ← Blog detay fetch için
import { 
  getCategoryConfig, 
  getStatusBadge,
  BLOG_PAGINATION 
} from '../../constants/blogConstants';

const MyBlogsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState('all'); // all, published, draft, archived

  // TanStack Query
  const { data, isLoading, error } = useMyBlogs(page, BLOG_PAGINATION.MY_BLOGS_SIZE);
  const deleteMutation = useDeleteBlog();
  const updateMutation = useUpdateBlog();

  // Pagination
  const blogs = data?.content || [];
  const totalPages = data?.totalPages || 0;

  // Filter blogs by tab
  const filteredBlogs = activeTab === 'all' 
    ? blogs 
    : blogs.filter(blog => {
        if (activeTab === 'published') return blog.status === 'PUBLISHED';
        if (activeTab === 'draft') return blog.status === 'DRAFT';
        if (activeTab === 'archived') return blog.status === 'ARCHIVED';
        return true;
      });

  // Stats calculation
  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.status === 'PUBLISHED').length,
    draft: blogs.filter(b => b.status === 'DRAFT').length,
    archived: blogs.filter(b => b.status === 'ARCHIVED').length,
    totalViews: blogs.reduce((sum, b) => sum + (b.viewCount || 0), 0),
    totalLikes: blogs.reduce((sum, b) => sum + (b.likeCount || 0), 0),
  };

  // Handlers
  const handleEdit = (blog) => {
    navigate(`/blog/duzenle/${blog.id}`, { state: { blog } });
  };

  const handleDelete = async (blog) => {
    if (!window.confirm(`"${blog.title}" adlı blogu silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(blog.id);
    } catch (error) {
      // Error already shown in mutation
    }
  };

  const handleArchive = async (blog) => {
    const toastId = toast.loading('Blog arşivleniyor...');
    
    try {
      // Status-only update endpoint kullan (moderasyon YOK)
      await blogService.updateBlogStatus(blog.id, 'ARCHIVED');
      
      // Cache'i manuel invalidate et
      queryClient.invalidateQueries(['my-blogs']);
      
      toast.update(toastId, {
        render: 'Blog arşivlendi',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error.response?.data?.message || 'Blog arşivlenirken hata oluştu',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleUnarchive = async (blog) => {
    const toastId = toast.loading('Blog yayına alınıyor...');
    
    try {
      // Status-only update endpoint kullan (moderasyon YOK)
      await blogService.updateBlogStatus(blog.id, 'PUBLISHED');
      
      // Cache'i manuel invalidate et
      queryClient.invalidateQueries(['my-blogs']);
      
      toast.update(toastId, {
        render: 'Blog yayına alındı',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: error.response?.data?.message || 'Blog yayına alınırken hata oluştu',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Bloglarım - Zar & Kule</title>
      </Helmet>

      <div className="min-h-screen bg-mbg">
        {/* Header */}
        <div className=" text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-black mb-2 text-mtf">Bloglarım</h1>
                <p className="text-mtf">
                  Tüm bloglarınızı buradan yönetin
                </p>
              </div>
              
              <button
                onClick={() => navigate('/blog/yaz')}
                className="flex items-center gap-2 px-6 py-3 bg-white text-cta rounded-xl font-bold hover:bg-cta-hover hover:text-white transition-colors border-cta border-1 hover:border-cta-hover"
              >
                <Plus size={20} />
                Yeni Blog Yaz
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-cbg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <StatCard
                icon={FileText}
                label="Toplam"
                value={stats.total}
                color="gray"
              />
              <StatCard
                icon={FileText}
                label="Yayında"
                value={stats.published}
                color="green"
              />
              <StatCard
                icon={FileText}
                label="Taslak"
                value={stats.draft}
                color="yellow"
              />
              <StatCard
                icon={Archive}
                label="Arşiv"
                value={stats.archived}
                color="orange"
              />
              <StatCard
                icon={Eye}
                label="Görüntülenme"
                value={stats.totalViews}
                color="blue"
              />
              <StatCard
                icon={Heart}
                label="Beğeni"
                value={stats.totalLikes}
                color="red"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-cbg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto">
              <TabButton
                active={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                label="Tümü"
                count={stats.total}
              />
              <TabButton
                active={activeTab === 'published'}
                onClick={() => setActiveTab('published')}
                label="Yayında"
                count={stats.published}
              />
              <TabButton
                active={activeTab === 'draft'}
                onClick={() => setActiveTab('draft')}
                label="Taslak"
                count={stats.draft}
              />
              <TabButton
                active={activeTab === 'archived'}
                onClick={() => setActiveTab('archived')}
                label="Arşiv"
                count={stats.archived}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader size={48} className="text-cta animate-spin mb-4" />
              <p className="text-sti">Bloglar yükleniyor...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <p className="text-red-700 font-bold mb-2">Hata</p>
              <p className="text-red-600 text-sm">
                {error.message || 'Bloglar yüklenirken bir hata oluştu'}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <FileText size={64} className="mx-auto text-sti mb-4" />
              <p className="text-xl font-bold text-mtf mb-2">
                {activeTab === 'all' 
                  ? 'Henüz blog yazmadınız' 
                  : `${activeTab === 'published' ? 'Yayında' : activeTab === 'draft' ? 'Taslak' : 'Arşivlenmiş'} blog yok`}
              </p>
              <p className="text-sti mb-6">
                İlk blogunuzu yazmaya başlayın!
              </p>
              <button
                onClick={() => navigate('/blog/yaz')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover hover:text-white transition-colors"
              >
                <Plus size={20} />
                Yeni Blog Yaz
              </button>
            </div>
          )}

          {/* Blog List */}
          {!isLoading && !error && filteredBlogs.length > 0 && (
            <>
              <div className="space-y-4">
                {filteredBlogs.map((blog) => (
                  <BlogRow
                    key={blog.id}
                    blog={blog}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onUnarchive={handleUnarchive}
                    isDeleting={deleteMutation.isLoading}
                    isUpdating={updateMutation.isLoading}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-cbg rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mbg transition-colors"
                  >
                    ← Önceki
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                          i === page
                            ? 'bg-cta text-white'
                            : 'border border-cbg hover:bg-mbg'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="px-4 py-2 border border-cbg rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-mbg transition-colors"
                  >
                    Sonraki →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * Stat Card Component
 */
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-amber-100 text-amber-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-mbg rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-sti font-medium">{label}</p>
          <p className="text-2xl font-black text-mtf">{value}</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Tab Button Component
 */
const TabButton = ({ active, onClick, label, count }) => (
  <button
    onClick={onClick}
    className={`
      px-6 py-3 font-bold text-sm whitespace-nowrap border-b-2 transition-colors
      ${active 
        ? 'border-cta text-cta' 
        : 'border-transparent text-sti hover:text-mtf'
      }
    `}
  >
    {label} ({count})
  </button>
);

/**
 * Blog Row Component
 */
const BlogRow = ({ 
  blog, 
  onEdit, 
  onDelete, 
  onArchive, 
  onUnarchive,
  isDeleting,
  isUpdating 
}) => {
  const categoryConfig = getCategoryConfig(blog.category);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-cbg rounded-xl p-6 hover:border-cta/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Thumbnail */}
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {blog.thumbnailUrl ? (
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FileText size={32} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title & Status */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-lg font-bold text-mtf line-clamp-1 flex-1">
              {blog.title}
            </h3>
            {getStatusBadge(blog.status)}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-sti mb-3">
            <span className={`px-2 py-1 bg-gradient-to-r ${categoryConfig.bgGradient} text-white rounded text-xs font-bold`}>
              {categoryConfig.label}
            </span>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              {formatDate(blog.createdAt)}
            </div>
            <div className="flex items-center gap-1">
              <Eye size={14} />
              {blog.viewCount || 0}
            </div>
            <div className="flex items-center gap-1">
              <Heart size={14} />
              {blog.likeCount || 0}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-sti">+{blog.tags.length - 3} daha</span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(blog)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              <Edit size={14} />
              Düzenle
            </button>

            {blog.status === 'PUBLISHED' && (
              <button
                onClick={() => onArchive(blog)}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors disabled:opacity-50"
              >
                <Archive size={14} />
                Arşivle
              </button>
            )}

            {blog.status === 'ARCHIVED' && (
              <button
                onClick={() => onUnarchive(blog)}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors disabled:opacity-50"
              >
                <FileText size={14} />
                Yayınla
              </button>
            )}

            <button
              onClick={() => onDelete(blog)}
              disabled={isDeleting}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors disabled:opacity-50 ml-auto"
            >
              <Trash2 size={14} />
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBlogsPage;