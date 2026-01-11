// src/pages/WikiCollectionDetailPage.jsx

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, Trash2, Edit, Lock, Globe, BookOpen,
  Loader2, AlertCircle, FileX
} from 'lucide-react';

import { useWikiCollection, useRemoveWikiFromCollection } from '../hooks/useWikiCollections';
import { getCategoryIcon, getCategoryLabel } from '../constants/wikiConstants';

const WikiCollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: collection, isLoading, error } = useWikiCollection(id);
  const removeFromCollectionMutation = useRemoveWikiFromCollection();

  const handleRemoveWiki = async (wikiId) => {
    if (!window.confirm('Bu wiki\'yi koleksiyondan çıkarmak istediğine emin misin?')) return;

    try {
      await removeFromCollectionMutation.mutateAsync({
        collectionId: parseInt(id),
        wikiId,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-cta" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-mbg flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-lg font-bold text-mtf mb-2">Koleksiyon bulunamadı</p>
          <button
            onClick={() => navigate('/collections/me')}
            className="text-cta hover:underline font-bold"
          >
            Koleksiyonlarıma Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mbg pb-20 font-display">
      <Helmet>
        <title>{collection.name} | Koleksiyonlarım</title>
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-mtf to-mtf/90 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <button
            onClick={() => navigate('/collections/me')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 font-bold text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            Koleksiyonlarıma Dön
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen size={32} className="text-white" />
                <h1 className="text-3xl md:text-4xl font-black text-white">
                  {collection.name}
                </h1>
              </div>

              {collection.description && (
                <p className="text-white/80 text-lg mb-4 max-w-3xl">
                  {collection.description}
                </p>
              )}

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-bold text-sm">
                  {collection.isPublic ? (
                    <>
                      <Globe size={16} />
                      Herkese Açık
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Özel
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white font-bold text-sm">
                  {collection.itemCount || 0} Wiki
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-8 max-w-6xl">
        {!collection.entries || collection.entries.length === 0 ? (
          <div className="bg-white border border-cbg rounded-2xl p-16 text-center shadow-sm">
            <FileX size={64} className="mx-auto text-cbg mb-4" />
            <p className="text-mtf font-black text-xl mb-2">Koleksiyon boş</p>
            <p className="text-sti text-sm mb-6">
              Wiki sayfalarından "Koleksiyona Ekle" butonu ile içerik ekleyebilirsin
            </p>
            <Link
              to="/wiki"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors"
            >
              <BookOpen size={18} />
              Wiki'ye Git
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.entries.map(wiki => (
              <div
                key={wiki.id}
                className="bg-white border border-cbg rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                {/* Image */}
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200">
                  {wiki.imageUrl && (
                    <img
                      src={wiki.imageUrl}
                      alt={wiki.title || wiki.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleRemoveWiki(wiki.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Koleksiyondan çıkar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                      {getCategoryIcon(wiki.category, 12)}
                      {getCategoryLabel(wiki.category)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-mtf mb-2 line-clamp-2 group-hover:text-cta transition-colors">
                    {wiki.title || wiki.name}
                  </h3>

                  <Link
                    to={`/wiki/${wiki.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-cta hover:underline"
                  >
                    Detayları Gör →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WikiCollectionDetailPage;