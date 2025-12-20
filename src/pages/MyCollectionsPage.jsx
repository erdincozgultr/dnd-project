import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Folder, Trash2, ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAxios, { METHODS } from '../hooks/useAxios';
import { toast } from 'react-toastify';

const MyCollectionsPage = () => {
  const { sendRequest, loading } = useAxios();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    sendRequest({
      url: '/collections/me',
      method: METHODS.GET,
      callbackSuccess: (res) => setCollections(res.data)
    });
  }, []);

  const handleDelete = (id) => {
    if(!window.confirm("Koleksiyonu silmek istediğine emin misin? İçindekiler kütüphanenden silinmez, sadece koleksiyon dağılır.")) return;
    sendRequest({
      url: `/collections/${id}`,
      method: METHODS.DELETE,
      callbackSuccess: () => {
        toast.info("Koleksiyon silindi.");
        setCollections(prev => prev.filter(c => c.id !== id));
      }
    });
  };

  return (
    <div className="min-h-screen bg-mbg pb-20 font-display">
      <Helmet><title>Koleksiyonlarım | Zar & Kule</title></Helmet>
      
      <div className="bg-pb py-12 px-4 text-center">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Kişisel Arşivim</h1>
        <p className="text-sti/70 font-medium">Kaydettiğin tüm efsaneler burada toplanıyor.</p>
      </div>

      <div className="container mx-auto px-4 mt-10 max-w-4xl">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-cta" size={40} /></div>
        ) : collections.length === 0 ? (
          <div className="bg-white border border-cbg rounded-2xl p-16 text-center shadow-sm">
            <Folder size={64} className="mx-auto text-cbg mb-4" />
            <p className="text-mtf font-black text-xl mb-2">Rafın henüz boş.</p>
            <Link to="/wiki" className="text-cta font-bold hover:underline">Wiki'ye göz atarak içerik eklemeye başla</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {collections.map(coll => (
              <div key={coll.id} className="bg-white border border-cbg rounded-2xl p-6 shadow-sm hover:border-cta transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="text-xl font-black text-mtf uppercase tracking-tight">{coll.name}</h3>
                      <p className="text-[10px] font-bold text-sti mt-1 uppercase tracking-widest">{coll.itemCount} ESER</p>
                  </div>
                  <button onClick={() => handleDelete(coll.id)} className="text-sti hover:text-red-500 transition-colors p-2 bg-mbg rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="mt-auto pt-4 flex justify-end">
                    <Link 
                      to={`/collections/${coll.id}`} 
                      className="flex items-center gap-1 text-xs font-black text-cta uppercase hover:underline"
                    >
                      Koleksiyonu İncele <ChevronRight size={16} />
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

export default MyCollectionsPage;