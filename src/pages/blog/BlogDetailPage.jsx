// src/pages/blog/BlogDetailPage.jsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, Clock, Eye, Heart, ArrowLeft, Loader, 
  AlertCircle 
} from 'lucide-react';
import BlogContent from '../../components/blog/detail/BlogContent';
import BlogActions from '../../components/blog/detail/BlogActions';
import { useBlogDetail } from '../../hooks/useBlogQueries';
import { getCategoryConfig } from '../../constants/blogConstants';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // TanStack Query - Blog detay (10 dk cache)
  const { data: blog, isLoading, error } = useBlogDetail(slug);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="text-cta animate-spin mx-auto mb-4" />
          <p className="text-sti">Blog yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-8 text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-mtf mb-2">Blog Bulunamadı</h2>
          <p className="text-sti mb-6">
            {error.response?.status === 404 
              ? 'Bu blog mevcut değil veya kaldırılmış olabilir.'
              : 'Blog yüklenirken bir hata oluştu.'}
          </p>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-3 bg-cta text-white rounded-xl font-bold hover:bg-red-600 transition-colors"
          >
            ← Bloglara Dön
          </button>
        </div>
      </div>
    );
  }

  // Blog yok
  if (!blog) {
    return null;
  }

  // Category config
  const categoryConfig = getCategoryConfig(blog.category);
  const CategoryIcon = categoryConfig.icon;

  // Date format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{blog.seoTitle || blog.title} - Zar & Kule</title>
        <meta 
          name="description" 
          content={blog.seoDescription || blog.title} 
        />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.seoDescription || blog.title} />
        <meta property="og:image" content={blog.thumbnailUrl || ''} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-mbg pb-20">
        {/* Back Button */}
        <div className="bg-white border-b border-cbg sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-sti hover:text-mtf transition-colors text-sm font-medium"
            >
              <ArrowLeft size={18} />
              Bloglara Dön
            </button>
          </div>
        </div>

        {/* Hero Image */}
        {blog.thumbnailUrl && (
          <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
            <img
              src={blog.thumbnailUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-mbg via-transparent to-transparent"></div>
          </div>
        )}

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
          {/* Article Header */}
          <article className="bg-white rounded-2xl shadow-xl border border-cbg p-8 md:p-12 mb-8">
            {/* Category Badge */}
            <div className="mb-6">
              <span 
                className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${categoryConfig.bgGradient} text-white rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg`}
              >
                <CategoryIcon size={16} />
                {categoryConfig.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-mtf mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-sti border-b border-cbg pb-6 mb-8">
              {/* Date */}
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-purple-500" />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>

              {/* Reading Time */}
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-amber-500" />
                <span>{blog.readingTime || 0} dk okuma</span>
              </div>

              {/* View Count */}
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-blue-500" />
                <span>{blog.viewCount || 0} görüntülenme</span>
              </div>

              {/* Like Count */}
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-red-500" />
                <span>{blog.likeCount || 0} beğeni</span>
              </div>
            </div>

            {/* Author Card */}
            {blog.author && (
              <div className="flex items-center gap-4 bg-mbg rounded-xl p-4 mb-8">
                <img
                  src={blog.author.avatarUrl || '/default-avatar.png'}
                  alt={blog.author.displayName || blog.author.username}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div>
                  <p className="text-sm text-sti font-medium">Yazar</p>
                  <p className="text-lg font-bold text-mtf">
                    {blog.author.displayName || blog.author.username}
                  </p>
                  {blog.author.bio && (
                    <p className="text-sm text-sti mt-1">{blog.author.bio}</p>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Divider */}
            <hr className="border-cbg my-8" />

            {/* Blog Content - Markdown */}
            <BlogContent content={blog.content} />
          </article>

          {/* TODO: Comment Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-cbg p-8 mb-8">
            <h3 className="text-2xl font-bold text-mtf mb-4">
              💬 Yorumlar
            </h3>
            <div className="text-center py-8 text-sti">
              <p>Yorum özelliği yakında aktif olacak!</p>
            </div>
          </div>
        </div>

        {/* Sticky Action Buttons (Bottom) */}
        <BlogActions blog={blog} />
      </div>
    </>
  );
};

export default BlogDetailPage;