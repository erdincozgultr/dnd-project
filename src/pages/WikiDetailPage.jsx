import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { 
  Shield, User, Share2, GitFork, BookmarkCheck, ChevronLeft, Trash2, Edit, Calendar, Tag, Eye, Heart 
} from 'lucide-react';

import useAxios, { METHODS } from '../hooks/useAxios';
import { REVERSE_CATEGORY_LABELS } from '../constants/wikiEnums';
import CollectionModal from '../components/wiki/CollectionModal';

const WikiDetailPage = ({ type = 'official' }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { sendRequest, loading } = useAxios();
  
  const [data, setData] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const isHomebrew = type === 'homebrew';

  useEffect(() => {
    const url = isHomebrew ? `/homebrews/read/${slug}` : `/wiki/${slug}`;
    sendRequest({
        url: url,
        method: METHODS.GET,
        callbackSuccess: (res) => setData(res.data)
    });
  }, [slug, isHomebrew, sendRequest]);

  const handleForkStart = () => {
    if (!isAuthenticated) return toast.info("Forklamak için oturum açmalısın.");
    // Create sayfasına yönlendir, orası veriyi slug ile çekecek
    navigate(`/create-homebrew?forkSource=${data.slug}&originalId=${data.id}&isWiki=${!isHomebrew}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Bağlantı kopyalandı! ⚔️");
  };

  const handleDelete = () => {
    if (!window.confirm("Bu içeriği silmek istediğine emin misin?")) return;
    const url = isHomebrew ? `/homebrews/${data.id}` : `/wiki/${data.id}`;
    sendRequest({
        url: url,
        method: METHODS.DELETE,
        callbackSuccess: () => {
            toast.info("İçerik silindi.");
            navigate('/wiki');
        }
    });
  };

  if (loading || !data) return <div className="p-20 text-center animate-pulse text-sti font-black uppercase">Efsane yükleniyor...</div>;

  const isOwner = isHomebrew && user && data.author?.username === user.username;

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet><title>{data.title || data.name} | Zar & Kule</title></Helmet>

      {/* Hero Header */}
      <div className="relative h-64 md:h-80 w-full bg-pb overflow-hidden">
        {data.imageUrl ? (
            <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover opacity-50" />
        ) : (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mbg to-transparent"></div>
        <div className="absolute bottom-6 left-0 w-full px-6 container mx-auto">
            <Link to="/wiki" className="text-white/60 hover:text-white flex items-center gap-1 text-[10px] font-black mb-4 w-fit transition-all tracking-widest uppercase">
                <ChevronLeft size={14} /> Kütüphaneye Dön
            </Link>
            <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${isHomebrew ? 'bg-purple-600' : 'bg-amber-600'} text-white shadow-lg`}>
                    {REVERSE_CATEGORY_LABELS[data.category] || data.category}
                </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-mtf uppercase tracking-tight leading-none">{data.title || data.name}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* İçerik Alanı */}
         <div className="lg:col-span-2 space-y-6">
             <div className="bg-white border border-cbg rounded-xl p-8 shadow-sm min-h-[400px]">
                 <div className="prose prose-stone max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                     {data.description || data.content}
                 </div>
             </div>
             {data.tags && data.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2">
                     {data.tags.map((tag, i) => (
                         <span key={i} className="flex items-center gap-1 bg-white border border-cbg px-3 py-1.5 rounded-lg text-xs font-bold text-sti">
                             <Tag size={12} className="text-cta" /> {tag}
                         </span>
                     ))}
                 </div>
             )}
         </div>

         {/* Yan Panel */}
         <div className="space-y-6">
             <div className="bg-white border border-cbg rounded-xl p-6 shadow-sm space-y-4">
                 <h3 className="text-[10px] font-black text-sti uppercase border-b border-cbg pb-2 tracking-widest">Kayıt Detayları</h3>
                 <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center font-bold">
                         <span className="text-sti font-medium">Yazar</span>
                         <span className={`${isHomebrew ? 'text-purple-600' : 'text-amber-700'} flex items-center gap-1`}>
                             {isHomebrew ? <User size={14} /> : <Shield size={14} />}
                             {isHomebrew ? data.author?.displayName : 'Official SRD'}
                         </span>
                     </div>
                     <div className="flex justify-between items-center font-bold">
                         <span className="text-sti font-medium">Oluşturulma</span>
                         <span className="text-mtf flex items-center gap-1"><Calendar size={14} /> {new Date(data.createdAt).toLocaleDateString('tr-TR')}</span>
                     </div>
                     <div className="flex justify-between items-center font-bold text-xs border-t border-cbg pt-3">
                        <div className="flex items-center gap-1 text-sti"><Eye size={14}/> {data.viewCount || 0} Görüntülenme</div>
                        <div className="flex items-center gap-1 text-red-500"><Heart size={14} className="fill-current"/> {data.likeCount || 0} Beğeni</div>
                     </div>
                 </div>
             </div>

             {/* AKSİYONLAR */}
             <div className="bg-white border border-cbg rounded-xl p-6 shadow-sm space-y-3">
                  <button 
                    onClick={() => isAuthenticated ? setShowCollectionModal(true) : toast.info("Giriş yapmalısın.")} 
                    className="w-full flex items-center justify-center gap-2 py-3 bg-mbg border border-cbg text-mtf font-black text-xs uppercase hover:bg-cta/5 hover:border-cta transition-all"
                  >
                      <BookmarkCheck size={18} className="text-cta" /> Koleksiyona Ekle
                  </button>
                  <button 
                    onClick={handleForkStart}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-mbg border border-cbg text-mtf font-black text-xs uppercase hover:bg-purple-50 hover:border-purple-500 transition-all"
                  >
                      <GitFork size={18} className="text-purple-600" /> Bunu Forkla (Geliştir)
                  </button>
                  <button 
                    onClick={handleShare}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-mbg border border-cbg text-mtf font-black text-xs uppercase hover:bg-blue-50 hover:border-blue-500 transition-all"
                  >
                      <Share2 size={18} className="text-blue-500" /> Paylaş
                  </button>
             </div>

             {/* YÖNETİM */}
             {isOwner && (
                 <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2">
                     <Link to={`/create-homebrew?edit=${data.slug}`} className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-600 font-black text-xs uppercase rounded-lg border border-red-200">
                         <Edit size={16} /> Düzenle
                     </Link>
                     <button onClick={handleDelete} className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-black text-xs uppercase rounded-lg shadow-lg">
                         <Trash2 size={16} /> Sil
                     </button>
                 </div>
             )}
         </div>
      </div>

      {showCollectionModal && <CollectionModal entryId={data.id} onClose={() => setShowCollectionModal(false)} />}
    </div>
  );
};

export default WikiDetailPage;