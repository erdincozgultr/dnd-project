// src/components/wiki/list/WikiCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Eye,
  Sparkles,
  Shield,
  Swords,
  Flame,
  Zap,
  Skull,
  Footprints,
  Crown,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import {
  getCategoryConfig,
  getCategoryIcon,
  getCategoryDefaultImage,
  LIKE_TARGET_TYPES,
} from "../../../constants/wikiConstants";
import { getHomebrewImageUrl } from "../../../utils/homebrewTemplates";
import axiosClient from "../../../api/axiosClient";

/**
 * Wiki/Homebrew liste kartı - Kategoriye göre özelleştirilmiş
 */
const WikiCard = ({ item, isHomebrew = false }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [isLiked, setIsLiked] = useState(item.liked || false);
  const [likeLoading, setLikeLoading] = useState(false);

  const categoryConfig = getCategoryConfig(item.category);

  const imageUrl = isHomebrew
    ? getHomebrewImageUrl(item)
    : item.imageUrl || getCategoryDefaultImage(item.category);

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

    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    try {
      await axiosClient.post("/likes", {
        targetType: isHomebrew
          ? LIKE_TARGET_TYPES.HOMEBREW
          : LIKE_TARGET_TYPES.WIKI,
        targetId: item.id,
      });
    } catch (error) {
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Beğeni işlemi başarısız.");
    } finally {
      setLikeLoading(false);
    }
  };

   console.log('WikiCard item:', item);
  console.log('Category:', item.category);
  console.log('Level:', item.level);
  console.log('Type:', item.type);
  console.log('Challenge Rating:', item.challenge_rating);

  // Kategoriye göre detay bilgileri
  const renderCategoryDetails = () => {
    const data = item.categoryData;

    switch (item.category) {
      case "SPELL":
      case "SPELLS":
        return (
          <div className="flex items-center gap-2 text-xs">
            {data.level !== undefined && (
              <span className="px-2 py-0.5 bg-violet-500/10 text-violet-600 rounded font-bold">
                {data.level === 0 ? "Cantrip" : `${data.level}. Seviye`}
              </span>
            )}
            {data.school && <span className="text-sti">{data.school}</span>}
          </div>
        );

      case "MONSTER":
      case "MONSTERS":
        return (
          <div className="flex items-center gap-3 text-xs">
            {data.type && (
              <div className="flex items-center gap-1">
                <Skull size={12} className="text-red-500" />
                <span className="text-sti">{data.type}</span>
              </div>
            )}
            {data.challenge_rating && (
              <span className="px-2 py-0.5 bg-red-500/10 text-red-600 rounded font-bold">
                CR {data.challenge_rating}
              </span>
            )}
          </div>
        );

      case "MAGIC_ITEM":
        return (
          <div className="flex items-center gap-2 text-xs">
            {data.rarity && (
              <span
                className={`px-2 py-0.5 rounded font-bold ${getRarityColor(
                  data.rarity
                )}`}
              >
                {data.rarity}
              </span>
            )}
            {data.attunement && (
              <span className="flex items-center gap-1 text-amber-600">
                <Zap size={12} /> Uyum
              </span>
            )}
          </div>
        );

      case "WEAPON":
        return (
          <div className="flex items-center gap-2 text-xs text-sti">
            <Swords size={12} className="text-orange-500" />
            <span>
              {data.damage?.dice || data.damage_dice || "1d6"}{" "}
              {data.damage?.type || data.damage_type || "Hasar"}
            </span>
          </div>
        );

      case "ARMOR":
        return (
          <div className="flex items-center gap-2 text-xs">
            <Shield size={12} className="text-blue-500" />
            <span className="text-sti">
              Zırh Sınıfı {data.armor_class || data.ac || "11"}
            </span>
            {data.type && (
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded font-bold">
                {data.type}
              </span>
            )}
          </div>
        );

      case "CLASS":
      case "CLASSES":
        return (
          <div className="flex items-center gap-2 text-xs">
            <Crown size={12} className="text-amber-500" />
            <span className="text-sti">Hit Die: {data.hit_die || "d8"}</span>
            {data.primary_ability && (
              <span className="text-amber-600">• {data.primary_ability}</span>
            )}
          </div>
        );

      case "RACE":
      case "RACES":
        return (
          <div className="flex items-center gap-2 text-xs text-sti">
            <Footprints size={12} className="text-green-500" />
            <span>{data.size || "Orta"}</span>
            {data.speed && <span>• {data.speed}</span>}
          </div>
        );

      case "FEAT":
      case "FEATS":
        return (
          <div className="flex items-center gap-2 text-xs">
            <Award size={12} className="text-purple-500" />
            {data.prerequisite ? (
              <span className="text-sti">
                Ön Gereksinim: {data.prerequisite}
              </span>
            ) : (
              <span className="text-sti">Ön Gereksinim Yok</span>
            )}
          </div>
        );

      case "BACKGROUND":
        return (
          <div className="text-xs text-sti">
            {data.skill_proficiencies ? (
              <span>{data.skill_proficiencies}</span>
            ) : (
              <span>Arka Plan</span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Link
      to={linkPath}
      className="block bg-white border border-cbg rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name || item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getCategoryIcon(item.category, 48)}
          </div>
        )}

        {/* Homebrew Badge */}
        {isHomebrew && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-lg">
            <Sparkles size={12} />
            Homebrew
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-bold uppercase rounded">
          {categoryConfig.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-mtf group-hover:text-cta transition-colors truncate mb-2">
          {item.name || item.title}
        </h3>

        {/* Category Details */}
        <div className="mb-3 min-h-[24px]">{renderCategoryDetails()}</div>

        {/* Author (Homebrew için) */}
        {isHomebrew && item.author && (
          <p className="text-xs text-sti mb-3">
            Yazar: {item.author.displayName || item.author.username}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-cbg">
          <div className="flex items-center gap-3 text-xs text-sti">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
              {likeCount}
            </button>

            <span className="flex items-center gap-1">
              <Eye size={14} />
              {item.viewCount || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Rarity renk yardımcısı
const getRarityColor = (rarity) => {
  const r = rarity?.toLowerCase();
  if (r?.includes("common") || r?.includes("sıradan"))
    return "bg-gray-500/10 text-gray-600";
  if (r?.includes("uncommon") || r?.includes("nadide"))
    return "bg-green-500/10 text-green-600";
  if (r?.includes("rare") || r?.includes("nadir"))
    return "bg-blue-500/10 text-blue-600";
  if (r?.includes("very rare") || r?.includes("çok nadir"))
    return "bg-purple-500/10 text-purple-600";
  if (r?.includes("legendary") || r?.includes("efsanevi"))
    return "bg-amber-500/10 text-amber-600";
  if (r?.includes("artifact") || r?.includes("artifact"))
    return "bg-red-500/10 text-red-600";
  return "bg-gray-500/10 text-gray-600";
};

export default WikiCard;
