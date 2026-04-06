import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

// Recibimos "children" para poder inyectarle capas diferentes desde otras pantallas
const BaseMap = ({ center = [3.01, -76.48], zoom = 12, children }) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom}
      minZoom={2}
      maxZoom={22}
      preferCanvas={true}
      // zIndex: 0 asegura que el mapa se quede al fondo y no tape tus dashboards flotantes
      style={{ height: "100%", width: "100%", zIndex: 0 }} 
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
        minZoom={2}
        maxZoom={22}
      />
      
      {/* ¡AQUÍ ESTÁ LA MAGIA! Aquí se renderizará el GeoJSON o lo que le pasemos */}
      {children}
      
    </MapContainer>
  );
};

export default BaseMap;