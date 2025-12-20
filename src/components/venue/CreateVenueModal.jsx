import React, { useState } from 'react';
import venueService from '../../services/venueService';
import { VenueType, VenueTypeLabels } from '../../constants/venueEnums';
import { X } from 'lucide-react';

const CreateVenueModal = ({ onClose, onVenueCreated, userLocation }) => {
  // Madde 2: VenueRequest.java DTO yapısı ile tam uyumlu state
  const [form, setForm] = useState({
    name: '', description: '', type: 'CAFE', address: '', city: '', district: '',
    latitude: userLocation?.lat || 0, longitude: userLocation?.lng || 0,
    phone: '', website: '', instagramHandle: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await venueService.createVenue(form);
      alert("Mekan başvurusu başarıyla iletildi.");
      onVenueCreated();
      onClose();
    } catch (err) {
      alert("Hata: " + (err.response?.data?.message || "Kayıt yapılamadı."));
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[var(--color-mbg)] border-4 border-[var(--color-pb)] w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 bg-[var(--color-pb)] text-[var(--color-td)] flex justify-between items-center">
          <h2 className="font-bold uppercase tracking-tighter italic">Yeni Mekan Başvurusu</h2>
          <button onClick={onClose}><X size={24}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-[var(--color-mtf)] custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase italic">Mekan İsmi *</label>
              <input name="name" required className="w-full p-2 bg-[var(--color-cbg)] border border-stone-300 rounded" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase italic">Tür</label>
              <select name="type" className="w-full p-2 bg-[var(--color-cbg)] border border-stone-300 rounded" value={form.type} onChange={handleChange}>
                {Object.keys(VenueType).map(t => <option key={t} value={t}>{VenueTypeLabels[t]}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase italic">Şehir *</label>
              <input name="city" required className="w-full p-2 bg-[var(--color-cbg)] border border-stone-300 rounded" onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase italic">İlçe / Bölge *</label>
              <input name="district" required className="w-full p-2 bg-[var(--color-cbg)] border border-stone-300 rounded" onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase italic">Açık Adres *</label>
            <input name="address" required className="w-full p-2 bg-[var(--color-cbg)] border border-stone-300 rounded" onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase italic">Latitude *</label>
              <input type="number" step="any" name="latitude" value={form.latitude} className="w-full p-2 border" onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase italic">Longitude *</label>
              <input type="number" step="any" name="longitude" value={form.longitude} className="w-full p-2 border" onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase italic">Açıklama</label>
            <textarea name="description" rows="2" className="w-full p-2 bg-[var(--color-cbg)] border border-stone-300 rounded" onChange={handleChange} />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs font-serif italic">
            <input name="phone" placeholder="Telefon" className="p-2 border" onChange={handleChange} />
            <input name="website" placeholder="Website" className="p-2 border" onChange={handleChange} />
            <input name="instagramHandle" placeholder="@instagram" className="p-2 border" onChange={handleChange} />
          </div>

          <button type="submit" className="w-full py-4 bg-[var(--color-pb)] text-[var(--color-td)] font-black rounded uppercase hover:bg-[var(--color-mtf)] transition-colors shadow-lg">MEKANI ONAYA GÖNDER</button>
        </form>
      </div>
    </div>
  );
};

export default CreateVenueModal;