import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, GitFork, Ghost, Skull, Sword, Feather, User } from 'lucide-react';
import { toast } from 'react-toastify';
import useAxios, { METHODS } from '../../hooks/useAxios';
import { REVERSE_CATEGORY_LABELS, LIKE_TARGET_TYPES } from '../../constants/wikiEnums';

const getCategoryIcon = (catEnum) => {
    switch(catEnum) {
        case 'SPELL': return <Ghost size={12} />;
        case 'MONSTER': return <Skull size={12} />;
        case 'ITEM': return <Sword size={12} />;
        case 'CLASS': return <User size={12} />;
        default: return <Feather size={12} />;
    }
};

const WikiCard = ({ item, variant = 'official', isAuthenticated }) => {
  const isHomebrew = variant === 'homebrew';
  const navigate = useNavigate();
  const { sendRequest } = useAxios();

  // State'ler
  const [likeCount, setLikeCount] = useState(item.likeCount || 0);
  const [isLiked, setIsLiked] = useState(item.liked === true);
  const [likeLoading, setLikeLoading] = useState(false);

  // Parent'tan gelen veri güncellemelerini (Sayfa değişimi hariç) yoksayıyoruz.
  // Sadece ID değişirse (Kart tamamen değişirse) state'i sıfırlıyoruz.
  useEffect(() => {
    setLikeCount(item.likeCount || 0);
    setIsLiked(item.liked === true);
  }, [item.id]); 

  const handleLike = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.info("Beğenmek için giriş yapmalısın.");
    
    // İşlem devam ederken ikinci tıklamayı engelle
    if (likeLoading) return;

    // 1. Loading'i başlat
    setLikeLoading(true);

    // 2. Anlık (Optimistic) Değişim
    const prevLiked = isLiked;
    const prevCount = likeCount;

    const newLiked = !isLiked;
    const newCount = newLiked ? likeCount + 1 : (likeCount > 0 ? likeCount - 1 : 0);

    // UI'ı hemen güncelle
    setIsLiked(newLiked);
    setLikeCount(newCount);

    const targetType = isHomebrew ? LIKE_TARGET_TYPES.HOMEBREW : LIKE_TARGET_TYPES.WIKI;

    // 3. İsteği Gönder
    sendRequest({
        url: '/likes',
        method: METHODS.POST,
        data: { targetType, targetId: item.id },
        updateState: false, 
        
        // BAŞARILI OLURSA: Sadece kilidi aç. UI zaten güncel.
        callbackSuccess: () => {
             setLikeLoading(false); // Kilidi aç
        },
        
        // HATA OLURSA: İşlemi geri al ve kilidi aç.
        callbackError: () => {
            setIsLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error("İşlem başarısız.");
            setLikeLoading(false); // Kilidi aç
        }
    });
  };

  const handleForkRedirect = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.info("Forklamak için oturum açmalısın.");
    // Fork kaynağı bilgisini gönderiyoruz ama create sayfasında bunu normal create olarak işleyeceğiz
    navigate(`/create-homebrew?forkSource=${item.slug}&originalId=${item.id}&isWiki=${!isHomebrew}`);
  };

  const theme = isHomebrew ? {
    wrapper: 'border-purple-200 bg-purple-50 hover:border-purple-400',
    title: 'text-purple-900',
    accent: 'text-purple-700'
  } : {
    wrapper: 'border-amber-200 bg-amber-50 hover:border-amber-400',
    title: 'text-amber-900',
    accent: 'text-amber-700'
  };

  return (
    <div className={`group flex flex-col h-full rounded-xl border transition-all duration-300 overflow-hidden shadow-sm ${theme.wrapper}`}>
      {item.imageUrl && (
        <div className="h-44 w-full overflow-hidden">
          <img src={item.imageUrl} alt={item.title || item.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
        </div>
      )}
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-black px-2 py-1 rounded uppercase border bg-white flex items-center gap-1 shadow-sm">
             {getCategoryIcon(item.category)} {REVERSE_CATEGORY_LABELS[item.category] || item.category}
          </span>
          {isHomebrew && <span className="text-[10px] font-bold text-purple-600 italic">@{item.author?.displayName}</span>}
        </div>

        <Link to={isHomebrew ? `/homebrew/${item.slug}` : `/wiki/${item.slug}`} className="mb-2">
           <h3 className={`text-lg font-black ${theme.title} group-hover:underline line-clamp-1 uppercase tracking-tight`}>
             {item.title || item.name}
           </h3>
        </Link>

        <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow font-medium leading-relaxed">
           {item.excerpt || item.description?.substring(0, 100) + "..."}
        </p>

        <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <button 
                  onClick={handleLike} 
                  disabled={likeLoading}
                  className={`flex items-center gap-1.5 text-xs font-black transition-all active:scale-95 ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'} ${likeLoading ? 'opacity-50' : ''}`}
                >
                    <Heart size={20} className={`${isLiked ? 'fill-current' : 'fill-none'} transition-colors duration-200`} /> 
                    <span>{likeCount}</span>
                </button>

                <button onClick={handleForkRedirect} className="text-slate-400 hover:text-purple-600 transition-all p-1 hover:bg-purple-50 rounded-lg">
                    <GitFork size={20} />
                </button>
            </div>
            
            <Link to={isHomebrew ? `/homebrew/${item.slug}` : `/wiki/${item.slug}`} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-transparent hover:border-current transition-all ${theme.accent}`}>
                İncele &rarr;
            </Link>
        </div>
      </div>
    </div>
  );
};

export default WikiCard;