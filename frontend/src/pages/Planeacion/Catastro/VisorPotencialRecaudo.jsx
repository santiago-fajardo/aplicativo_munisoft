import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet'; 
import L from 'leaflet'; 
import axios from 'axios';
import Swal from 'sweetalert2';

import Dashboard from './components/Dashboard_VisorPotencialRecaudo';
import BaseMap from '../../../components/map/BaseMap';

// =====================================================================
// COMPONENTE INVISIBLE: Mueve la cámara hacia el predio buscado
// =====================================================================
const EnfocarPredio = ({ predioEncontrado }) => {
  const map = useMap(); 

  useEffect(() => {
    if (predioEncontrado) {
      try {
        const capaTemporal = L.geoJSON(predioEnfoundado);
        const limites = capaTemporal.getBounds();
        
        map.flyToBounds(limites, { 
          padding: [50, 50], 
          maxZoom: 18, 
          duration: 1.5 
        });
      } catch (error) {
        console.error("Error al enfocar el mapa:", error);
      }
    }
  }, [predioEncontrado, map]);

  return null; 
};

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================
const VisorPotencialRecaudo = () => {
  const [predios, setPredios] = useState(null);
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState(null);
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null); 
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [predioEnfoque, setPredioEnfoque] = useState(null);

  useEffect(() => {
    Swal.showLoading();
    axios.get('http://localhost:3000/api/catastro/predios')
      .then(response => {
        setPredios(response.data);
        Swal.close(); 
      })
      .catch(error => {
        console.error(error);
        Swal.fire('Error', 'No se pudo conectar con el Backend', 'error');
      });
  }, []);

  const buscarPredio = () => {
    if (!codigoBusqueda.trim()) {
      Swal.fire('Atención', 'Ingrese un código predial', 'warning');
      return;
    }
    if (predios) {
      const encontrado = predios.features.find(
        (feature) => feature.properties.codigo === codigoBusqueda.trim()
      );
      if (encontrado) {
        setPredioEnfoque(encontrado); 
        setTarifaSeleccionada(null);  
        setZonaSeleccionada(null);
      } else {
        Swal.fire('No encontrado', `No existe el código: ${codigoBusqueda}`, 'error');
      }
    }
  };

  // --- LÓGICA DE COLORES POR TARIFA ---
  const estiloPredio = (feature) => {
    const tarifa = (feature.properties.tarifa || '').toString();
    
    let colorFondo = '#6c757d'; // Gris por defecto

    // Aplicamos los colores solicitados
    if (tarifa.includes('1')) colorFondo = '#dc3545';      // Rojo (Estrato 1)
    else if (tarifa.includes('2')) colorFondo = '#ffc107'; // Amarillo (Estrato 2)
    else if (tarifa.includes('3')) colorFondo = '#0d6efd'; // Azul (Estrato 3)
    else if (tarifa.includes('4')) colorFondo = '#198754'; // Verde (Estrato 4)

    const esPredioBuscado = predioEnfoque && feature.properties.codigo === predioEnfoque.properties.codigo;

    return {
      fillColor: esPredioBuscado ? '#00ffff' : colorFondo, // Cian si es buscado para que no se confunda con amarillo
      weight: esPredioBuscado ? 3 : 1, 
      color: esPredioBuscado ? '#000' : 'white', 
      fillOpacity: esPredioBuscado ? 0.9 : 0.6
    };
  };

  const onEachFeature = (feature, layer) => {
    const avaluoFormateado = new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(feature.properties.avaluo || 0);

    const popupContent = `
      <div class="card shadow-sm" style="width: 250px; font-size: 14px;">
        <div class="card-header bg-dark text-white py-2 text-center">
          <strong>🏡 Predio Catastral</strong>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <small class="text-muted d-block">Código:</small>
            <span class="fw-bold">${feature.properties.codigo || 'S/N'}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>Zona:</span>
            <span class="badge bg-secondary text-white">${feature.properties.zona || 'N/A'}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>Avalúo:</span>
            <span class="badge bg-success text-white">${avaluoFormateado}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center border-top border-2">
            <span>Tarifa / Estrato:</span>
            <span class="badge bg-dark text-white">${feature.properties.tarifa || '0'}</span>
          </li>
        </ul>
      </div>
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: '450px' }}>
        <div className="input-group shadow-lg rounded">
          <input 
            type="text" 
            className="form-control px-3" 
            placeholder="🔍 Ingrese el código del predio..." 
            value={codigoBusqueda}
            onChange={(e) => setCodigoBusqueda(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') buscarPredio(); }}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none' }}
          />
          <button className="btn btn-primary fw-bold px-4" onClick={buscarPredio}>Buscar</button>
        </div>
      </div>

      {predios && (
        <Dashboard 
          datos={predios} 
          tarifaActiva={tarifaSeleccionada}
          onSelectTarifa={setTarifaSeleccionada}
          zonaActiva={zonaSeleccionada}
          onSelectZona={setZonaSeleccionada}
        />
      )}

      <BaseMap>
        <EnfocarPredio predioEnfoundado={predioEnfoque} />
        {predios && (
          <GeoJSON 
            key={`capa-${tarifaSeleccionada}-${zonaSeleccionada}-${predioEnfoque?.properties?.codigo || 'none'}`} 
            data={predios} 
            style={estiloPredio}
            onEachFeature={onEachFeature} 
            filter={(feature) => {
              const cumpleTarifa = tarifaSeleccionada === null || feature.properties.tarifa === tarifaSeleccionada;
              let cumpleZona = true;
              if (zonaSeleccionada !== null) {
                const zonaPredio = (feature.properties.zona || '').toLowerCase();
                cumpleZona = zonaPredio.includes(zonaSeleccionada);
              }
              return cumpleTarifa && cumpleZona;
            }}
          />
        )}
      </BaseMap>
    </div>
  );
}

export default VisorPotencialRecaudo;