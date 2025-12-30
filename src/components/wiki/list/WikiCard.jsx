// src/components/wiki/list/WikiCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import { 
  getCategoryConfig, 
  getCategoryIcon, 
  getCategoryDefaultImage,
  LIKE_TARGET_TYPES 
} from '../../../constants/wikiConstants';
import axiosClient from '../../../api/axiosClient';

/**
 * Wiki liste kartı
 * WikiEntryListResponse'a göre tasarlandı (metadata yok)
 */
const WikiCard = ({ item }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [isLiked, setIsLiked] = useState(item.liked || false);
  const [likeLoading, setLikeLoading] = useState(false);

  const categoryConfig = getCategoryConfig(item.category);
  const imageUrl = item.imageUrl || getCategoryDefaultImage(item.category);

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
        targetType: LIKE_TARGET_TYPES.WIKI,
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
      to={`/wiki/${item.slug}`}
      className="group block bg-white border border-cbg rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-cta/30 transition-all duration-300"
    >
      {/* Resim */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={imageUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent`} />
        
        {/* Kategori badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-${categoryConfig.color}-500 text-white`}>
            {getCategoryIcon(item.category, 12)}
            {categoryConfig.label}
          </span>
        </div>
        
        {/* İstatistikler */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="flex items-center gap-1 text-white/80 text-xs font-bold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Eye size={12} />
            {item.viewCount || 0}
          </span>
        </div>
      </div>
      
      {/* İçerik */}
      <div className="p-4">
        {/* Başlık */}
        <h3 className="font-bold text-mtf text-lg mb-2 line-clamp-1 group-hover:text-cta transition-colors">
          {item.title}
        </h3>
        
        {/* Alt bilgi */}
        <div className="flex items-center justify-between">
          {/* Yazar (varsa) */}
          {item.authorUsername && (
            <span className="text-xs text-sti">
              @{item.authorUsername}
            </span>
          )}
          
          {/* Beğeni butonu */}
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isLiked 
                ? 'bg-red-100 text-red-500' 
                : 'bg-mbg text-sti hover:bg-red-50 hover:text-red-500'
            } ${likeLoading ? 'opacity-50' : ''}`}
          >
            <Heart size={14} className={isLiked ? 'fill-current' : ''} />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default WikiCard;