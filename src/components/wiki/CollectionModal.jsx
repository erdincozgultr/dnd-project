import React, { useState, useEffect } from 'react';
import { X, Plus, FolderPlus, BookmarkCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import useAxios, { METHODS } from '../../hooks/useAxios';

/**
 * CollectionModal: Kullanıcının koleksiyonlarını listeler ve entry eklemesini sağlar.
 * @param {Long} entryId - Koleksiyona eklenecek içeriğin ID'si
 * @param {Function} onClose - Modalı kapatma fonksiyonu
 */
const CollectionModal = ({ entryId, onClose }) => {
  const { sendRequest, loading } = useAxios();
  const [collections, setCollections] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newColl, setNewColl] = useState({ name: "", description: "", isPublic: true });

  useEffect(() => {
    // Kullanıcının kendi koleksiyonlarını çek (GET /api/collections/me)
    sendRequest({
      url: '/collections/me',
      method: METHODS.GET,
      callbackSuccess: (res) => setCollections(res.data)
    });
  }, [sendRequest]);

  const handleCreateCollection = (e) => {
    e.preventDefault();
    if (!newColl.name.trim()) return;

    sendRequest({
      url: '/collections',
      method: METHODS.POST,
      data: newColl,
      callbackSuccess: (res) => {
        toast.success("Yeni koleksiyon oluşturuldu!");
        setCollections(prev => [...prev, res.data]);
        setShowCreateForm(false);
        setNewColl({ name: "", description: "", isPublic: true });
      }
    });
  };

  const handleAddToCollection = (collId) => {
 sendRequest({
        url: `/collections/${collId}/entries/${entryId}`,
        method: METHODS.POST,
        updateState: false, // Sayfa verisini bozma
        callbackSuccess: () => {
            // Sadece gerçekten başarılıysa bu mesajı ver
            toast.success("Koleksiyona başarıyla eklendi!");
            onClose();
        },
        callbackError: (err) => {
            // Eğer backend 409 dönüyorsa "Zaten eklendi" uyarısı ver
            if (err.response?.status === 409) {
                toast.warning("Bu içerik zaten koleksiyonunda mevcut.");
            } else {
                toast.error("Bir hata oluştu.");
            }
        }
    });
  };

  return (
    <div className="fixed inset-0 bg-pb/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-cbg overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-cbg flex justify-between items-center bg-mbg">
          <h3 className="font-black text-mtf uppercase text-xs flex items-center gap-2 tracking-widest">
            <BookmarkCheck size={18} className="text-cta" /> Koleksiyona Ekle
          </h3>
          <button onClick={onClose} className="text-sti hover:text-mtf"><X size={20}/></button>
        </div>

        <div className="p-4 max-h-60 overflow-y-auto space-y-2">
          {loading && collections.length === 0 ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-cta" /></div>
          ) : collections.length === 0 && !showCreateForm ? (
            <p className="text-center text-xs text-sti py-8 italic font-medium">Henüz bir koleksiyonun bulunmuyor.</p>
          ) : (
            collections.map(coll => (
              <button 
                key={coll.id}
                onClick={() => handleAddToCollection(coll.id)}
                className="w-full text-left p-3 rounded-xl border border-cbg hover:border-cta hover:bg-cta/5 transition-all flex justify-between items-center group"
              >
                <div>
                    <span className="font-bold text-sm text-mtf block">{coll.name}</span>
                    <span className="text-[10px] text-sti uppercase font-bold">{coll.itemCount} İçerik</span>
                </div>
                <Plus size={16} className="text-sti group-hover:text-cta" />
              </button>
            ))
          )}
        </div>

        <div className="p-4 bg-mbg border-t border-cbg">
          {!showCreateForm ? (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-black text-cta uppercase hover:underline"
            >
              <FolderPlus size={16} /> Yeni Koleksiyon Oluştur
            </button>
          ) : (
            <form onSubmit={handleCreateCollection} className="space-y-3 animate-fade-in">
              <input 
                className="w-full p-2.5 border border-cbg rounded-lg text-sm outline-none focus:border-cta font-bold"
                placeholder="Koleksiyon adı..."
                value={newColl.name}
                onChange={(e) => setNewColl({ ...newColl, name: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-cta text-white py-2 rounded-lg text-xs font-black uppercase">Oluştur</button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-cbg rounded-lg text-xs font-bold">Vazgeç</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionModal;