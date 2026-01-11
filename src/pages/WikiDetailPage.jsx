// src/pages/WikiDetailPage.jsx - GitHub UI + YORUM + KOLEKSİYON SİSTEMİ ✨

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  ChevronLeft, Heart, Share2, Eye, BookmarkPlus, 
  Loader2, AlertCircle, Sparkles
} from 'lucide-react';

// Redux Actions
import { fetchWikiDetail, clearDetail } from '../redux/actions/wikiActions';

// Components
import { CategoryDetail } from '../components/wiki/categories';
import WikiCommentSection from '../components/wiki/comments/WikiCommentSection';
import CollectionModal from '../components/common/CollectionModal';

// Collection Hooks
import {
  useWikiCollections,
  useAddWikiToCollection,
  useRemoveWikiFromCollection,
  useCreateWikiCollection,
} from '../hooks/useWikiCollections';

// Utils & Constants
import { 
  getCategoryConfig,
  getCategoryLabel, 
  getCategoryIcon,
  getCategoryDefaultImage,
  LIKE_TARGET_TYPES 
} from '../constants/wikiConstants';
import { getHomebrewImageUrl } from '../utils/homebrewTemplates';
import axiosClient from '../api/axiosClient';

const WikiDetailPage = ({ type = 'official' }) => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isHomebrew = type === 'homebrew';

  // Redux state
  const { currentEntry, detailLoading, detailError } = useSelector((state) => state.wiki);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Local state
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

  // Collection hooks
  const { data: collections = [], isLoading: isLoadingCollections } = useWikiCollections();
  const addToCollectionMutation = useAddWikiToCollection();
  const removeFromCollectionMutation = useRemoveWikiFromCollection();
  const createCollectionMutation = useCreateWikiCollection();

  // Load wiki data
  useEffect(() => {
    if (slug) {
      dispatch(fetchWikiDetail(slug, isHomebrew));
    }
    
    return () => {
      dispatch(clearDetail());
    };
  }, [slug, isHomebrew, dispatch]);

  // Set liked state
  useEffect(() => {
    if (currentEntry) {
      setLikeCount(currentEntry.likeCount || 0);
      setIsLiked(currentEntry.liked || false);
    }
  }, [currentEntry]);

  // === HANDLERS ===

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Beğenmek için giriş yapmalısınız');
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
        targetId: currentEntry.id
      });

      toast.success(!isLiked ? '❤️ Beğenildi!' : 'Beğeniden çıkarıldı');
    } catch (error) {
      // Rollback
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error('Beğeni işlemi başarısız.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.info('Koleksiyona eklemek için giriş yapmalısınız');
      return;
    }
    
    setIsCollectionModalOpen(true);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: currentEntry.title || currentEntry.name,
        text: currentEntry.description || 'D&D 5e içeriği',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link kopyalandı!');
    }
  };

  // === RENDER ===

  if (detailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mbg">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-cta mx-auto mb-4" />
          <p className="text-sti">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (detailError || !currentEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mbg">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-lg font-bold text-mtf mb-2">
            {detailError || 'İçerik bulunamadı'}
          </p>
          <button
            onClick={() => navigate(isHomebrew ? '/wiki?tab=homebrew' : '/wiki')}
            className="text-cta hover:underline font-bold"
          >
            Kütüphaneye Dön
          </button>
        </div>
      </div>
    );
  }

  // Category config ve image URL
  const categoryConfig = getCategoryConfig(currentEntry.category);
  const imageUrl = isHomebrew 
    ? getHomebrewImageUrl(currentEntry)
    : (currentEntry.imageUrl || getCategoryDefaultImage(currentEntry.category));

  return (
    <>
      <Helmet>
        <title>{currentEntry.title || currentEntry.name} | Wiki - Zar & Kule</title>
        <meta name="description" content={`${currentEntry.title || currentEntry.name} - ${getCategoryLabel(currentEntry.category)}`} />
      </Helmet>

      <div className="min-h-screen bg-mbg font-display pb-20">
        {/* Hero Header - GitHub Style */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden">
          {/* Background Image */}
          <div className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.bgGradient}`}>
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={currentEntry.title || currentEntry.name}
                className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              />
            )}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-mbg via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="container mx-auto">
              {/* Geri butonu */}
              <Link 
                to="/wiki" 
                className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold uppercase tracking-widest mb-4 transition-colors"
              >
                <ChevronLeft size={14} />
                Kütüphaneye Dön
              </Link>
              
              {/* Badge'ler */}
              <div className="flex items-center gap-2 mb-3">
                {/* Kategori badge */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white/20 text-white backdrop-blur-sm">
                  {getCategoryIcon(currentEntry.category, 14)}
                  {getCategoryLabel(currentEntry.category)}
                </span>

                {/* Homebrew badge */}
                {isHomebrew && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/90 text-white backdrop-blur-sm">
                    <Sparkles size={14} />
                    HOMEBREW
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl mb-2">
                {currentEntry.title || currentEntry.name}
              </h1>

              {/* Homebrew Author */}
              {isHomebrew && currentEntry.author && (
                <p className="text-sm text-white/80">
                  Oluşturan:{' '}
                  <Link
                    to={`/profil/${currentEntry.author.username}`}
                    className="font-bold hover:text-white transition-colors"
                  >
                    @{currentEntry.author.username}
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol: İçerik + Yorumlar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Wiki İçeriği */}
              <div className="bg-white border border-cbg rounded-2xl p-6 shadow-lg">
                <CategoryDetail
                  category={currentEntry.category}
                  turkishContent={currentEntry.turkishContent || currentEntry.content}
                />
              </div>

              {/* YORUM SİSTEMİ */}
              <WikiCommentSection 
                wikiId={currentEntry.id} 
                isHomebrew={isHomebrew}
              />
            </div>

            {/* Sağ: Actions & Meta */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-cbg rounded-2xl p-6 shadow-lg sticky top-4 space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-around py-3 border-b border-cbg">
                  <div className="text-center">
                    <p className="text-2xl font-black text-mtf">
                      {likeCount}
                    </p>
                    <p className="text-xs text-sti font-bold">Beğeni</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-mtf">
                      {currentEntry.viewCount || 0}
                    </p>
                    <p className="text-xs text-sti font-bold flex items-center gap-1 justify-center">
                      <Eye size={12} />
                      Görüntülenme
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {/* Beğen */}
                  <button
                    onClick={handleLike}
                    disabled={likeLoading || !isAuthenticated}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      isLiked
                        ? 'bg-red-100 text-red-600 border border-red-200'
                        : 'bg-mbg text-mtf border border-cbg hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                    } ${likeLoading || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                    {isLiked ? 'Beğenildi' : 'Beğen'}
                  </button>

                  {/* Koleksiyona Ekle - NOW ACTIVE */}
                  <button
                    onClick={handleBookmark}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-mbg border border-cbg text-mtf rounded-xl font-bold text-sm hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 transition-all"
                  >
                    <BookmarkPlus size={18} />
                    Koleksiyona Ekle
                  </button>

                  {/* Paylaş */}
                  <button
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-mbg border border-cbg text-mtf rounded-xl font-bold text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all"
                  >
                    <Share2 size={18} />
                    Paylaş
                  </button>
                </div>

                {/* Homebrew Status */}
                {isHomebrew && currentEntry.status && (
                  <div className="bg-white border border-cbg rounded-2xl p-4 shadow-sm">
                    <h3 className="text-[10px] font-black text-sti uppercase tracking-widest mb-3">
                      Durum
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                        currentEntry.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-100 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {currentEntry.status === 'PUBLISHED' ? '✓ Yayında' : '⏳ Onay Bekliyor'}
                    </span>
                  </div>
                )}

                {/* Meta bilgiler */}
                {currentEntry.sourceKey && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-sti uppercase mb-1">Kaynak Kodu</p>
                    <p className="text-xs font-mono text-slate-600 break-all">
                      {currentEntry.sourceKey}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Modal */}
      <CollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        itemId={currentEntry?.id}
        collections={collections}
        isLoadingCollections={isLoadingCollections}
        onAddToCollection={addToCollectionMutation.mutateAsync}
        onRemoveFromCollection={removeFromCollectionMutation.mutateAsync}
        onCreateCollection={createCollectionMutation.mutateAsync}
        type="wiki"
      />
    </>
  );
};

export default WikiDetailPage;