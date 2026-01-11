// src/components/common/CollectionModal.jsx

import React, { useState } from 'react';
import { X, Plus, Check, FolderPlus, Loader2, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

/**
 * Generic Collection Modal - Wiki ve Blog için kullanılabilir
 * 
 * @param {boolean} isOpen - Modal açık mı
 * @param {function} onClose - Modal kapatma fonksiyonu
 * @param {number} itemId - Eklenecek item ID (wiki veya blog)
 * @param {object} collections - Koleksiyonlar (TanStack Query'den)
 * @param {boolean} isLoadingCollections - Koleksiyonlar yükleniyor mu
 * @param {function} onAddToCollection - Koleksiyona ekleme fonksiyonu
 * @param {function} onRemoveFromCollection - Koleksiyondan çıkarma fonksiyonu
 * @param {function} onCreateCollection - Yeni koleksiyon oluşturma fonksiyonu
 * @param {string} type - 'wiki' veya 'blog'
 */
const CollectionModal = ({
  isOpen,
  onClose,
  itemId,
  collections = [],
  isLoadingCollections,
  onAddToCollection,
  onRemoveFromCollection,
  onCreateCollection,
  type = 'wiki',
}) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  // Giriş yapmamış kullanıcı kontrolü
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
          <div className="text-center">
            <FolderPlus size={48} className="mx-auto text-cta mb-4" />
            <h3 className="text-lg font-bold text-mtf mb-2">Giriş Gerekli</h3>
            <p className="text-sm text-sti mb-4">
              Koleksiyonlara eklemek için giriş yapmalısınız
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-cta text-white rounded-xl font-bold hover:bg-cta-hover transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // İtem'in hangi koleksiyonlarda olduğunu kontrol et
  const isItemInCollection = (collection) => {
    if (!collection.entries) return false;
    return collection.entries.some((entry) => entry.id === itemId);
  };

  // Yeni koleksiyon oluştur
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    setIsCreating(true);
    try {
      await onCreateCollection({
        name: newCollectionName.trim(),
        description: newCollectionDesc.trim(),
        isPublic,
      });
      // Reset form
      setNewCollectionName('');
      setNewCollectionDesc('');
      setIsPublic(true);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Create collection error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Koleksiyona ekle/çıkar toggle
  const handleToggleCollection = async (collection) => {
    const isInCollection = isItemInCollection(collection);

    if (isInCollection) {
      await onRemoveFromCollection({
        collectionId: collection.id,
        [type === 'wiki' ? 'wikiId' : 'blogId']: itemId,
      });
    } else {
      await onAddToCollection({
        collectionId: collection.id,
        [type === 'wiki' ? 'wikiId' : 'blogId']: itemId,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cbg">
          <div className="flex items-center gap-3">
            <FolderPlus size={24} className="text-cta" />
            <h2 className="text-xl font-black text-mtf">
              Koleksiyona Ekle
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cbg rounded-lg transition-colors"
          >
            <X size={20} className="text-sti" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Yeni Koleksiyon Oluştur Butonu */}
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 mb-4 border-2 border-dashed border-cbg rounded-xl text-sti hover:border-cta hover:text-cta transition-colors font-bold"
            >
              <Plus size={18} />
              Yeni Koleksiyon Oluştur
            </button>
          )}

          {/* Yeni Koleksiyon Formu */}
          {showCreateForm && (
            <form onSubmit={handleCreateCollection} className="mb-6 bg-mbg rounded-xl p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-bold text-mtf mb-1">
                    Koleksiyon Adı *
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="örn: Favori Büyülerim"
                    className="w-full px-3 py-2 border border-cbg rounded-lg text-sm focus:border-cta focus:ring-1 focus:ring-cta/20 outline-none"
                    maxLength={100}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-mtf mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={newCollectionDesc}
                    onChange={(e) => setNewCollectionDesc(e.target.value)}
                    placeholder="Koleksiyon hakkında kısa açıklama..."
                    className="w-full px-3 py-2 border border-cbg rounded-lg text-sm focus:border-cta focus:ring-1 focus:ring-cta/20 outline-none resize-none"
                    rows={2}
                    maxLength={500}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-cta border-cbg rounded focus:ring-cta"
                  />
                  <label htmlFor="isPublic" className="text-sm text-sti">
                    Herkese açık koleksiyon
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isCreating || !newCollectionName.trim()}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-cta text-white rounded-lg font-bold text-sm hover:bg-cta-hover transition-colors disabled:opacity-50"
                  >
                    {isCreating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCollectionName('');
                      setNewCollectionDesc('');
                      setIsPublic(true);
                    }}
                    className="px-4 py-2 border border-cbg rounded-lg text-sm font-bold hover:bg-cbg transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Koleksiyon Listesi */}
          {isLoadingCollections ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-cta" />
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-12">
              <FolderPlus size={48} className="mx-auto text-sti/50 mb-3" />
              <p className="text-sm text-sti font-bold mb-1">
                Henüz koleksiyonunuz yok
              </p>
              <p className="text-xs text-sti">
                İlk koleksiyonunuzu oluşturun!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {collections.map((collection) => {
                const isInCollection = isItemInCollection(collection);

                return (
                  <button
                    key={collection.id}
                    onClick={() => handleToggleCollection(collection)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all
                      ${isInCollection
                        ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-white border-cbg hover:border-cta'
                      }
                    `}
                  >
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm text-mtf">
                        {collection.name}
                      </p>
                      {collection.description && (
                        <p className="text-xs text-sti line-clamp-1">
                          {collection.description}
                        </p>
                      )}
                      <p className="text-xs text-sti mt-1">
                        {collection.itemCount || 0} öğe
                        {!collection.isPublic && ' • Özel'}
                      </p>
                    </div>

                    <div className="ml-3">
                      {isInCollection ? (
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-lg">
                          <Check size={16} className="text-white" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 bg-cbg rounded-lg">
                          <Plus size={16} className="text-sti" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cbg">
          <button
            onClick={onClose}
            className="w-full py-2 bg-mbg border border-cbg text-mtf rounded-xl font-bold hover:bg-cbg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;