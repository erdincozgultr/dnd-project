import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  ChevronLeft, Heart, Share2, Eye, BookmarkPlus, 
  Loader2, AlertCircle 
} from 'lucide-react';

import { fetchWikiDetail, clearDetail } from '../redux/actions/wikiActions';
import { CategoryDetail } from '../components/wiki/categories';
import { 
  getCategoryConfig, 
  getCategoryLabel, 
  getCategoryIcon,
  getCategoryDefaultImage 
} from '../constants/wikiConstants';

const WikiDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentEntry, detailLoading, detailError } = useSelector(state => state.wiki);
  const { isAuthenticated } = useSelector(state => state.auth);

  // Veri çekme
  useEffect(() => {
    if (slug) {
      dispatch(fetchWikiDetail(slug));
    }
    
    return () => {
      dispatch(clearDetail());
    };
  }, [slug, dispatch]);

  // Paylaş
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Bağlantı kopyalandı!");
  };

  // Koleksiyona ekle
  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.info("Koleksiyona eklemek için giriş yapmalısın.");
      return;
    }
    // TODO: Koleksiyon modal aç
    toast.info("Koleksiyon özelliği yakında!");
  };

  // Loading
  if (detailLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-cta mx-auto mb-4" />
          <p className="text-sti font-bold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error
  if (detailError) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-mtf mb-2">İçerik Bulunamadı</h2>
          <p className="text-sti mb-4">{detailError}</p>
          <Link 
            to="/wiki" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors"
          >
            <ChevronLeft size={18} />
            Wiki'ye Dön
          </Link>
        </div>
      </div>
    );
  }

  // Data yoksa
  if (!currentEntry) {
    return null;
  }

  const categoryConfig = getCategoryConfig(currentEntry.category);
  const imageUrl = currentEntry.imageUrl || getCategoryDefaultImage(currentEntry.category);

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>{currentEntry.title} | Wiki - Zar & Kule</title>
        <meta name="description" content={`${currentEntry.title} - ${getCategoryLabel(currentEntry.category)}`} />
      </Helmet>

      {/* Hero Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        {/* Background Image */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${categoryConfig.bgGradient}`}
        >
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={currentEntry.title}
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
            
            {/* Kategori badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-white/20 text-white backdrop-blur-sm`}>
                {getCategoryIcon(currentEntry.category, 14)}
                {getCategoryLabel(currentEntry.category)}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">
              {currentEntry.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sol: İçerik */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-cbg rounded-2xl p-6 shadow-sm">
              {/* Kategori bazlı detay component */}
              <CategoryDetail 
                category={currentEntry.category}
                metadata={currentEntry.metadata}
                turkishContent={currentEntry.turkishContent}
              />
            </div>
          </div>
          
          {/* Sağ: Sidebar */}
          <div className="space-y-4">
            {/* İstatistikler */}
            <div className="bg-white border border-cbg rounded-2xl p-4 shadow-sm">
              <h3 className="text-[10px] font-black text-sti uppercase tracking-widest mb-4">
                İstatistikler
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-mbg rounded-xl p-3 text-center">
                  <Eye size={18} className="text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-black text-mtf">{currentEntry.viewCount || 0}</p>
                  <p className="text-[10px] font-bold text-sti uppercase">Görüntülenme</p>
                </div>
                
                <div className="bg-mbg rounded-xl p-3 text-center">
                  <Heart size={18} className="text-red-500 mx-auto mb-1" />
                  <p className="text-lg font-black text-mtf">{currentEntry.likeCount || 0}</p>
                  <p className="text-[10px] font-bold text-sti uppercase">Beğeni</p>
                </div>
              </div>
            </div>
            
            {/* Aksiyonlar */}
            <div className="bg-white border border-cbg rounded-2xl p-4 shadow-sm space-y-2">
              <h3 className="text-[10px] font-black text-sti uppercase tracking-widest mb-3">
                Aksiyonlar
              </h3>
              
              {/* Beğen */}
              <button 
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  currentEntry.liked 
                    ? 'bg-red-100 text-red-600 border border-red-200'
                    : 'bg-mbg text-mtf border border-cbg hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                }`}
              >
                <Heart size={18} className={currentEntry.liked ? 'fill-current' : ''} />
                {currentEntry.liked ? 'Beğenildi' : 'Beğen'}
              </button>
              
              {/* Koleksiyona Ekle */}
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
            
            {/* Meta bilgiler */}
            {currentEntry.sourceKey && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-sti uppercase mb-1">Kaynak Kodu</p>
                <p className="text-xs font-mono text-slate-600 break-all">{currentEntry.sourceKey}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WikiDetailPage;
