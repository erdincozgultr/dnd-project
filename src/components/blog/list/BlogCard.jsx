// src/components/blog/list/BlogCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Clock, Calendar } from 'lucide-react';
import { getCategoryConfig } from '../../../constants/blogConstants';

/**
 * Blog Kartı Component
 * Medium-like tasarım - minimalist, okuma odaklı
 */
const BlogCard = ({ blog, onMouseEnter }) => {
  // Kategori bilgisi
  const categoryConfig = getCategoryConfig(blog.category);
  const CategoryIcon = categoryConfig.icon;

  // Tarih formatla (örn: "5 gün önce")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <Link
      to={`/blog/${blog.slug}`}
      onMouseEnter={onMouseEnter}
      className="group block bg-white border border-cbg rounded-2xl overflow-hidden hover:border-cta/50 hover:shadow-xl transition-all duration-300"
    >
      {/* Thumbnail Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {blog.thumbnailUrl ? (
          <img
            src={blog.thumbnailUrl}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Resim yüklenemezse placeholder göster
              e.target.style.display = 'none';
            }}
          />
        ) : (
          // Resim yoksa icon göster
          <div className="w-full h-full flex items-center justify-center">
            <CategoryIcon 
              size={64} 
              className={`text-${categoryConfig.color}-300 opacity-50`} 
            />
          </div>
        )}

        {/* Category Badge - Sol üst köşe */}
        <div 
          className={`absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r ${categoryConfig.bgGradient} text-white rounded-lg shadow-lg`}
        >
          <div className="flex items-center gap-1.5">
            <CategoryIcon size={14} />
            <span className="text-xs font-bold uppercase tracking-wide">
              {categoryConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-xl font-bold text-mtf group-hover:text-cta transition-colors line-clamp-2 mb-3 leading-tight">
          {blog.title}
        </h3>

        {/* Author & Date */}
        {blog.author && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-cbg">
            {/* Author Avatar */}
            <img
              src={blog.author.avatarUrl || '/default-avatar.png'}
              alt={blog.author.displayName || blog.author.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-cbg"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            
            {/* Author Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-mtf truncate">
                {blog.author.displayName || blog.author.username}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-sti">
                <Calendar size={12} />
                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats - Icons */}
        <div className="flex items-center gap-4 text-sm text-sti">
          {/* Reading Time */}
          <div className="flex items-center gap-1.5">
            <Clock size={16} className="text-amber-500" />
            <span className="font-medium">{blog.readingTime || 0} dk</span>
          </div>

          {/* View Count */}
          <div className="flex items-center gap-1.5">
            <Eye size={16} className="text-blue-500" />
            <span className="font-medium">{blog.viewCount || 0}</span>
          </div>

          {/* Like Count */}
          <div className="flex items-center gap-1.5">
            <Heart size={16} className="text-red-500" />
            <span className="font-medium">{blog.likeCount || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;