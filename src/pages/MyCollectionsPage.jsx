// src/pages/MyCollectionsPage.jsx - 3 KOLEKSİYON TİPİ DESTEKLER ✨

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Folder, Trash2, ChevronRight, BookOpen, Loader2, 
  Sparkles, Scroll, FileText, Plus 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// Collection hooks
import { useWikiCollections, useDeleteWikiCollection } from '../hooks/useWikiCollections';
import { useBlogCollections, useDeleteBlogCollection } from '../hooks/useBlogCollections';

// Homebrew - Mevcut useAxios kullanımı
import useAxios, { METHODS } from '../hooks/useAxios';

const MyCollectionsPage = () => {
  const [activeTab, setActiveTab] = useState('homebrew'); // homebrew, wiki, blog

  // Homebrew collections (mevcut sistem)
  const { sendRequest, loading: homebrewLoading } = useAxios();
  const [homebrewCollections, setHomebrewCollections] = React.useState([]);

  // Wiki collections (yeni)
  const { data: wikiCollections = [], isLoading: wikiLoading } = useWikiCollections();
  const deleteWikiMutation = useDeleteWikiCollection();

  // Blog collections (yeni)
  const { data: blogCollections = [], isLoading: blogLoading } = useBlogCollections();
  const deleteBlogMutation = useDeleteBlogCollection();

  // Homebrew koleksiyonları yükle
  React.useEffect(() => {
    sendRequest({
      url: '/collections/me',
      method: METHODS.GET,
      callbackSuccess: (res) => setHomebrewCollections(res.data)
    });
  }, []);

  // Homebrew koleksiyon silme
  const handleDeleteHomebrew = (id) => {
    if (!window.confirm('Koleksiyonu silmek istediğine emin misin? İçindekiler silinmez, sadece koleksiyon dağılır.')) 
      return;

    sendRequest({
      url: `/collections/${id}`,
      method: METHODS.DELETE,
      callbackSuccess: () => {
        toast.success('🗑️ Koleksiyon silindi');
        setHomebrewCollections(prev => prev.filter(c => c.id !== id));
      }
    });
  };

  // Wiki koleksiyon silme
  const handleDeleteWiki = async (id) => {
    if (!window.confirm('Wiki koleksiyonunu silmek istediğine emin misin?')) return;
    
    try {
      await deleteWikiMutation.mutateAsync(id);
    } catch (error) {
      // Error already handled by mutation
    }
  };

  // Blog koleksiyon silme
  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Blog koleksiyonunu silmek istediğine emin misin?')) return;
    
    try {
      await deleteBlogMutation.mutateAsync(id);
    } catch (error) {
      // Error already handled by mutation
    }
  };

  // Tab configs
  const tabs = [
    {
      id: 'homebrew',
      label: 'Homebrew',
      icon: <Sparkles size={16} />,
      collections: homebrewCollections,
      loading: homebrewLoading,
      handleDelete: handleDeleteHomebrew,
      emptyText: 'Homebrew koleksiyonun yok',
      emptyLink: '/create-homebrew',
      emptyLinkText: 'Homebrew oluştur',
      detailPath: '/collections',
      color: 'purple',
    },
    {
      id: 'wiki',
      label: 'Wiki',
      icon: <BookOpen size={16} />,
      collections: wikiCollections,
      loading: wikiLoading,
      handleDelete: handleDeleteWiki,
      emptyText: 'Wiki koleksiyonun yok',
      emptyLink: '/wiki',
      emptyLinkText: 'Wiki\'ye göz at',
      detailPath: '/wiki-collections',
      color: 'blue',
    },
    {
      id: 'blog',
      label: 'Blog',
      icon: <FileText size={16} />,
      collections: blogCollections,
      loading: blogLoading,
      handleDelete: handleDeleteBlog,
      emptyText: 'Blog koleksiyonun yok',
      emptyLink: '/blog',
      emptyLinkText: 'Blog\'lara göz at',
      detailPath: '/blog-collections',
      color: 'amber',
    },
  ];

  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-mbg pb-20 font-display">
      <Helmet>
        <title>Koleksiyonlarım | Zar & Kule</title>
      </Helmet>

      {/* Header */}
      <div className="bg-pb py-12 px-4 text-center border-b border-white/10">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Folder size={32} className="text-cta" />
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Koleksiyonlarım
          </h1>
        </div>
        <p className="text-white/70 font-medium">
          Kaydettiğin tüm içerikler burada toplanıyor
        </p>
      </div>

      <div className="container mx-auto px-4 mt-8 max-w-6xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-cbg pb-2 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-white text-mtf border-t-4 border-cta -mb-[2px]'
                  : 'bg-mbg text-sti hover:bg-white/50'
                }
              `}
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 px-2 py-0.5 bg-cbg rounded-full text-xs">
                {tab.collections.length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {currentTab.loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-cta" size={40} />
          </div>
        ) : currentTab.collections.length === 0 ? (
          <div className="bg-white border border-cbg rounded-2xl p-16 text-center shadow-sm">
            <Folder size={64} className="mx-auto text-cbg mb-4" />
            <p className="text-mtf font-black text-xl mb-2">
              {currentTab.emptyText}
            </p>
            <p className="text-sti text-sm mb-6">
              İçerikleri kaydederek koleksiyon oluşturabilirsin
            </p>
            <Link
              to={currentTab.emptyLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors"
            >
              <Plus size={18} />
              {currentTab.emptyLinkText}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTab.collections.map(collection => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onDelete={() => currentTab.handleDelete(collection.id)}
                detailPath={currentTab.detailPath}
                color={currentTab.color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Collection Card Component
 */
const CollectionCard = ({ collection, onDelete, detailPath, color }) => {
  const colorClasses = {
    purple: 'border-purple-500 bg-purple-50 group-hover:border-purple-600',
    blue: 'border-blue-500 bg-blue-50 group-hover:border-blue-600',
    amber: 'border-amber-500 bg-amber-50 group-hover:border-amber-600',
  };

  return (
    <div className={`
      bg-white border-2 border-cbg rounded-2xl p-6 shadow-sm 
      hover:shadow-xl transition-all group flex flex-col h-full
      ${colorClasses[color] || ''}
    `}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-black text-mtf mb-1 line-clamp-2">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-xs text-sti line-clamp-2 mb-2">
              {collection.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-mtf bg-cbg px-2 py-1 rounded-lg">
              {collection.itemCount || 0} öğe
            </span>
            {!collection.isPublic && (
              <span className="text-xs font-bold text-sti bg-amber-100 px-2 py-1 rounded-lg">
                🔒 Özel
              </span>
            )}
          </div>
        </div>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="text-sti hover:text-red-500 transition-colors p-2 bg-mbg rounded-lg hover:bg-red-50"
          title="Koleksiyonu sil"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-cbg flex justify-end">
        <Link
          to={`${detailPath}/${collection.id}`}
          className="flex items-center gap-1 text-xs font-black text-cta uppercase hover:underline transition-all group-hover:gap-2"
        >
          Koleksiyonu İncele
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default MyCollectionsPage;