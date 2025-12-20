import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Haritayı Seçilen Mekana Kaydıran Bileşen
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 15, { animate: true });
  }, [center, map]);
  return null;
}

const VenueMap = ({ venues = [], onVenueSelect, focusCoords }) => {
  const defaultCenter = [40.1885, 29.0610];

  return (
    <MapContainer center={defaultCenter} zoom={13} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {/* Sidebar'dan tıklanan mekana odaklanmayı sağlar */}
      {focusCoords && <MapController center={focusCoords} />}

      {venues.map((v) => (
        v.latitude && v.longitude && (
          <Marker 
            key={v.id} 
            position={[v.latitude, v.longitude]}
            eventHandlers={{ click: () => onVenueSelect(v.id) }}
          >
            <Popup><b className="font-serif">{v.name}</b></Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default VenueMap;