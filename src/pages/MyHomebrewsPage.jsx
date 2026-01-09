// src/pages/MyHomebrewsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Plus, Edit3, Trash2, Eye, Heart, ChevronLeft, Loader2, Filter } from 'lucide-react';
import { toast } from 'react-toastify';
import WikiCard from '../components/wiki/list/WikiCard';
import useAxios, { METHODS } from '../hooks/useAxios';
import { REVERSE_CATEGORY_LABELS } from '../constants/wikiEnums';

const MyHomebrewsPage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { sendRequest, loading } = useAxios();

  const [homebrews, setHomebrews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Bu sayfaya erişmek için giriş yapmalısın.');
      navigate('/giris');
      return;
    }

    fetchHomebrews();
  }, [isAuthenticated]);

  const fetchHomebrews = () => {
    sendRequest({
      url: '/homebrews/my-homebrews',
      method: METHODS.GET,
      callbackSuccess: (res) => setHomebrews(res.data),
    });
  };

  const handleDelete = (id, name) => {
    if (!window.confirm(`"${name}" homebrew'unu silmek istediğine emin misin?`)) return;

    sendRequest({
      url: `/homebrews/${id}`,
      method: METHODS.DELETE,
      callbackSuccess: () => {
        toast.success('Homebrew silindi!');
        setHomebrews(homebrews.filter(h => h.id !== id));
      },
    });
  };

  const categories = [
    { id: 'ALL', name: 'Tümü' },
    ...Object.entries(REVERSE_CATEGORY_LABELS).map(([key, value]) => ({
      id: key,
      name: value
    }))
  ];

  const filteredHomebrews = selectedCategory === 'ALL'
    ? homebrews
    : homebrews.filter(h => h.category === selectedCategory);

  const stats = {
    total: homebrews.length,
    totalLikes: homebrews.reduce((acc, h) => acc + (h.likeCount || 0), 0),
    totalViews: homebrews.reduce((acc, h) => acc + (h.viewCount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-mbg font-display pb-20">
      <Helmet>
        <title>Homebrew'larım | Zar & Kule</title>
      </Helmet>

      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/wiki"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={18} />
            <span className="text-sm font-bold">Wiki'ye Dön</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold uppercase tracking-wider mb-4">
                <Sparkles size={16} />
                Homebrew'larım
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                Senin <span className="text-pink-200">Kreasyonların</span>
              </h1>
              
              <p className="text-white/80">
                Oluşturduğun homebrew içerikleri buradan yönetebilirsin
              </p>
            </div>

            <Link
              to="/create-homebrew"
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-pink-50 transition-colors shadow-lg"
            >
              <Plus size={20} /> Yeni Homebrew
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white mb-1">{stats.total}</p>
              <p className="text-xs text-white/80 uppercase tracking-wider">Toplam İçerik</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white mb-1">{stats.totalLikes}</p>
              <p className="text-xs text-white/80 uppercase tracking-wider">Beğeni</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-white mb-1">{stats.totalViews}</p>
              <p className="text-xs text-white/80 uppercase tracking-wider">Görüntülenme</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter size={18} className="text-sti flex-shrink-0" />
          {categories.map(cat => {
            const count = cat.id === 'ALL' 
              ? homebrews.length 
              : homebrews.filter(h => h.category === cat.id).length;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all
                  ${selectedCategory === cat.id
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white border border-cbg text-sti hover:border-purple-500/50'
                  }
                `}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Homebrews List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-500" size={48} />
          </div>
        ) : filteredHomebrews.length === 0 ? (
          <div className="text-center py-20 bg-white border border-cbg rounded-2xl">
            <Sparkles size={64} className="mx-auto text-cbg mb-4" />
            <h3 className="text-xl font-black text-mtf mb-2">
              {selectedCategory === 'ALL' 
                ? 'Henüz homebrew oluşturmadın'
                : 'Bu kategoride homebrew yok'
              }
            </h3>
            <p className="text-sti mb-6">İlk homebrew'unu oluşturarak başla!</p>
            <Link
              to="/create-homebrew"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-colors"
            >
              <Plus size={18} /> Homebrew Oluştur
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHomebrews.map(homebrew => (
              <div key={homebrew.id} className="relative">
                <WikiCard item={homebrew} isHomebrew={true} />
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Link
                    to={`/create-homebrew?edit=${homebrew.id}`}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                    title="Düzenle"
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(homebrew.id, homebrew.name)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                    title="Sil"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHomebrewsPage;