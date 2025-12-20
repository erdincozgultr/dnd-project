import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Yönlendirme için ileride açarsın
import { VenueType, VenueTypeLabels } from '../constants/venueEnums';
// import { createVenue } from '../services/venueService'; // Servis hazır olunca açarsın

const CreateVenuePage = () => {
  // const navigate = useNavigate();

  // Backend: VenueRequest yapısı
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: VenueType.CAFE, // Varsayılan bir değer seçili olsun
    address: '',
    city: '',
    district: '',
    latitude: 0.0,
    longitude: 0.0,
    phone: '',
    website: '',
    instagramHandle: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Backend'e gönderilecek veri:", formData);
    
    try {
      // await createVenue(formData);
      alert("Mekan başarıyla oluşturuldu! (Simülasyon)");
      // navigate('/venues'); // Listeye yönlendir
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="container" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Yeni Mekan Ekle</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Ad */}
        <div>
          <label>Mekan Adı *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Tür (Enum Seçimi) */}
        <div>
          <label>Mekan Türü *</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          >
            {Object.keys(VenueType).map((key) => (
              <option key={key} value={key}>
                {VenueTypeLabels[key]}
              </option>
            ))}
          </select>
        </div>

        {/* Açıklama */}
        <div>
          <label>Açıklama</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="3"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Adres Bilgileri */}
        <div>
          <label>Adres *</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            required
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>İl</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
                <label>İlçe</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
        </div>

        {/* Koordinatlar */}
        <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
                <label>Enlem (Latitude)</label>
                <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
            <div style={{ flex: 1 }}>
                <label>Boylam (Longitude)</label>
                <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
            </div>
        </div>

        {/* İletişim */}
        <div>
            <label>Instagram (örn: zarvekule)</label>
            <input type="text" name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} style={{ width: '100%', padding: '8px' }} />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default CreateVenuePage;