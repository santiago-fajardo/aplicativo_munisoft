import React, { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet'; 
import L from 'leaflet'; 
import axios from 'axios';
import Swal from 'sweetalert2';

import Dashboard from './components/Dashboard_VisorPagos2025';
import BaseMap from '../../../components/map/BaseMap';

// =====================================================================
const EnfocarPredio = ({ predioEncontrado }) => {
  const map = useMap(); 

  useEffect(() => {
    if (predioEncontrado) {
      try {
        const capaTemporal = L.geoJSON(predioEncontrado);
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

const VisorPagos2025 = () => {
  const [predios, setPredios] = useState(null);
  
  // Filtros
  const [estadoPago, setEstadoPago] = useState(null); 
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null); 
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState(null); // <-- NUEVO ESTADO PARA TARIFA
  
  // Buscador
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [predioEnfoque, setPredioEnfoque] = useState(null);

  useEffect(() => {
    Swal.showLoading();
    axios.get('http://localhost:3000/api/catastro/predios-pagos-2025')
      .then(response => {
        setPredios(response.data);
        Swal.close(); 
      })
      .catch(error => {
        console.error(error);
        Swal.fire('Error', 'No se pudo conectar con el Backend Financiero', 'error');
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
        setEstadoPago(null);  
        setZonaSeleccionada(null);
        setTarifaSeleccionada(null); // <-- LIMPIAR AL BUSCAR
      } else {
        Swal.fire('No encontrado', `No existe el código: ${codigoBusqueda}`, 'error');
      }
    }
  };

  const estiloPredio = (feature) => {
    const recaudo = feature.properties.valorrecaudo || 0;
    
    let colorFondo = recaudo > 0 ? '#198754' : '#dc3545'; 

    const esPredioBuscado = predioEnfoque && feature.properties.codigo === predioEnfoque.properties.codigo;
    
    if (esPredioBuscado) {
      colorFondo = '#0dcaf0'; 
    }

    return {
      fillColor: colorFondo,
      weight: esPredioBuscado ? 3 : 1, 
      color: esPredioBuscado ? '#000' : 'white', 
      fillOpacity: esPredioBuscado ? 0.9 : 0.6,
      opacity: esPredioBuscado ? 1 : 0.7 
    };
  };

  const onEachFeature = (feature, layer) => {
    const p = feature.properties;

    const formatearMoneda = (valor) => new Intl.NumberFormat('es-CO', {
      style: 'currency', currency: 'COP', maximumFractionDigits: 0
    }).format(valor || 0);

    const avaluoFormateado = formatearMoneda(p.avaluo);
    const recaudoFormateado = formatearMoneda(p.valorrecaudo);
    
    const fechaPago = p.fecharecaudo 
      ? new Date(p.fecharecaudo).toLocaleDateString('es-CO') 
      : 'Sin registro';

    const estadoBadge = (p.valorrecaudo > 0) 
      ? '<span class="badge bg-success text-white">Pagado</span>'
      : '<span class="badge bg-danger text-white">En Deuda</span>';

    const tarifaBadge = p.tarifa 
      ? `<span class="badge bg-info text-dark">${p.tarifa}</span>` 
      : '<span class="badge bg-secondary">S/N</span>';

    const popupContent = `
      <div class="card shadow-sm" style="width: 260px; font-size: 13px;">
        <div class="card-header bg-primary text-white py-2 text-center">
          <strong>💰 Estado de Cuenta 2025</strong>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item d-flex justify-content-between align-items-center bg-light">
            <span class="text-muted small">Cód. Catastral:</span>
            <span class="fw-bold font-monospace">${p.codigo || 'S/N'}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>Estado:</span>
            ${estadoBadge}
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>Tarifa:</span>
            ${tarifaBadge}
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span>Avalúo:</span>
            <span class="fw-bold text-secondary">${avaluoFormateado}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center bg-light border-top border-2">
            <span>Total Pagado:</span>
            <span class="fw-bold text-success">${recaudoFormateado}</span>
          </li>
          <li class="list-group-item">
            <small class="text-muted d-block">Última fecha de pago:</small>
            <span class="fw-bold text-dark">${fechaPago}</span>
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
            placeholder="🔍 Buscar código para ver pagos..." 
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
          estadoActivo={estadoPago}
          onSelectEstado={setEstadoPago}
          zonaActiva={zonaSeleccionada}
          onSelectZona={setZonaSeleccionada}
          tarifaActiva={tarifaSeleccionada}         // <-- PASAMOS LA PROP AL DASHBOARD
          onSelectTarifa={setTarifaSeleccionada}    // <-- PASAMOS LA FUNCIÓN
        />
      )}

      <BaseMap>
        <EnfocarPredio predioEncontrado={predioEnfoque} />

        {predios && (
          <GeoJSON 
            // EL KEY AHORA INCLUYE LA TARIFA PARA RE-RENDERIZAR
            key={`capa-pagos-${estadoPago}-${zonaSeleccionada}-${tarifaSeleccionada}-${predioEnfoque?.properties?.codigo || 'none'}`} 
            data={predios} 
            style={estiloPredio}
            onEachFeature={onEachFeature} 
            filter={(feature) => {
              const recaudo = feature.properties.valorrecaudo || 0;
              
              let cumpleEstado = true;
              if (estadoPago === 'pagado') cumpleEstado = recaudo > 0;
              if (estadoPago === 'deudor') cumpleEstado = recaudo === 0;
              
              let cumpleZona = true;
              if (zonaSeleccionada !== null) {
                const zonaPredio = (feature.properties.zona || '').toLowerCase();
                cumpleZona = zonaPredio.includes(zonaSeleccionada);
              }

              // <-- NUEVO FILTRO: TARIFA -->
              let cumpleTarifa = true;
              if (tarifaSeleccionada !== null) {
                cumpleTarifa = feature.properties.tarifa === tarifaSeleccionada;
              }

              return cumpleEstado && cumpleZona && cumpleTarifa;
            }}
          />
        )}
      </BaseMap>

    </div>
  );
}

export default VisorPagos2025;