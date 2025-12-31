// src/components/wiki/list/WikiCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { 
  getCategoryConfig, 
  getCategoryIcon, 
  getCategoryDefaultImage,
  LIKE_TARGET_TYPES 
} from '../../../constants/wikiConstants';
import { getHomebrewImageUrl } from '../../../utils/homebrewTemplates';
import axiosClient from '../../../api/axiosClient';

/**
 * Wiki/Homebrew liste kartı
 * @param {object} item - Wiki veya Homebrew entry
 * @param {boolean} isHomebrew - Homebrew içerik mi?
 */
const WikiCard = ({ item, isHomebrew = false }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [isLiked, setIsLiked] = useState(item.liked || false);
  const [likeLoading, setLikeLoading] = useState(false);

  const categoryConfig = getCategoryConfig(item.category);
  
  // Image URL - Homebrew için farklı helper kullan
  const imageUrl = isHomebrew 
    ? getHomebrewImageUrl(item)
    : (item.imageUrl || getCategoryDefaultImage(item.category));

  // Link path - Homebrew için /homebrew/:slug
  const linkPath = isHomebrew ? `/homebrew/${item.slug}` : `/wiki/${item.slug}`;

  // Beğeni işlemi
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.info("Beğenmek için giriş yapmalısın.");
      return;
    }
    
    if (likeLoading) return;
    
    setLikeLoading(true);
    
    // Optimistic update
    const prevLiked = isLiked;
    const prevCount = likeCount;
    
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    try {
      await axiosClient.post('/likes', {
        targetType: isHomebrew ? LIKE_TARGET_TYPES.HOMEBREW : LIKE_TARGET_TYPES.WIKI,
        targetId: item.id
      });
    } catch (error) {
      // Rollback
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Beğeni işlemi başarısız.");
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <Link
      to={linkPath}
      className="group bg-white border-2 border-cbg rounded-2xl overflow-hidden hover:border-cta/50 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${imageUrl}')` }}
        />
        
        {/* Homebrew Badge */}
        {isHomebrew && (
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-purple-500/90 backdrop-blur-sm rounded-lg">
            <div className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wide">
                Homebrew
              </span>
            </div>
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg">
          <div className="flex items-center gap-1">
            {getCategoryIcon(item.category, 14)}
            <span className="text-xs font-bold text-white uppercase tracking-wide">
              {categoryConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-black text-mtf group-hover:text-cta transition-colors line-clamp-2 mb-2">
          {item.title || item.name}
        </h3>
        
        {item.description && (
          <p className="text-sm text-sti line-clamp-2 mb-3">
            {item.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold transition-all ${
              isLiked 
                ? 'bg-red-100 text-red-500' 
                : 'bg-mbg text-sti hover:bg-red-50 hover:text-red-500'
            } ${likeLoading ? 'opacity-50' : ''}`}
          >
            <Heart size={14} className={isLiked ? 'fill-current' : ''} />
            <span>{likeCount}</span>
          </button>

          {item.viewCount !== undefined && (
            <div className="flex items-center gap-1 text-sti">
              <Eye size={14} />
              <span>{item.viewCount}</span>
            </div>
          )}

          {/* Homebrew Author */}
          {isHomebrew && item.authorUsername && (
            <div className="ml-auto text-purple-600 font-bold">
              @{item.authorUsername}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default WikiCard;