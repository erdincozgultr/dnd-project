// src/pages/BlogCollectionDetailPage.jsx

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, Trash2, Lock, Globe, FileText,
  Loader2, AlertCircle, FileX, Eye, Heart, Calendar
} from 'lucide-react';

import { useBlogCollection, useRemoveBlogFromCollection } from '../hooks/useBlogCollections';

const BlogCollectionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: collection, isLoading, error } = useBlogCollection(id);
  const removeFromCollectionMutation = useRemoveBlogFromCollection();

  const handleRemoveBlog = async (blogId) => {
    if (!window.confirm('Bu blog yazısını koleksiyondan çıkarmak istediğine emin misin?')) return;

    try {
      await removeFromCollectionMutation.mutateAsync({
        collectionId: parseInt(id),
        blogId,
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
      <div className="bg-gradient-to-br from-amber-600 to-orange-600 py-12 px-4">
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
                <FileText size={32} className="text-white" />
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
                  {collection.itemCount || 0} Blog
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
              Blog sayfalarından "Kaydet" butonu ile blog yazıları ekleyebilirsin
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors"
            >
              <FileText size={18} />
              Blog'lara Git
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {collection.entries.map(blog => (
              <div
                key={blog.id}
                className="bg-white border border-cbg rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Thumbnail */}
                    {blog.coverImage && (
                      <div className="w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <Link
                            to={`/blog/${blog.slug}`}
                            className="block"
                          >
                            <h3 className="text-2xl font-black text-mtf mb-2 group-hover:text-cta transition-colors line-clamp-2">
                              {blog.title}
                            </h3>
                          </Link>

                          {blog.summary && (
                            <p className="text-sti text-sm line-clamp-2 mb-3">
                              {blog.summary}
                            </p>
                          )}

                          {/* Meta */}
                          <div className="flex items-center gap-4 text-xs text-sti">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              {blog.viewCount || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart size={14} />
                              {blog.likeCount || 0}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveBlog(blog.id)}
                          className="p-2 text-sti hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Koleksiyondan çıkar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Author */}
                      {blog.author && (
                        <div className="flex items-center gap-2 mt-4">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cta to-cta-hover flex items-center justify-center text-white text-xs font-bold">
                            {blog.author.displayName?.[0] || blog.author.username?.[0]}
                          </div>
                          <span className="text-xs font-bold text-mtf">
                            {blog.author.displayName || blog.author.username}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCollectionDetailPage;