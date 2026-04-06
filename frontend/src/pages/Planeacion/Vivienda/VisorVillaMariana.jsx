import React, { useEffect, useState } from 'react';
import { GeoJSON, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import Swal from 'sweetalert2';

import Dashboard from './components/Dashboard_VisorVillamariana';
import BaseMap from '../../../components/map/BaseMap';

// =====================================================================
// COMPONENTE: Enfoca automáticamente el mapa al buscar un barrio
// =====================================================================
const EnfocarBarrio = ({ barrioEncontrado }) => {
    const map = useMap();
    useEffect(() => {
        if (barrioEncontrado) {
            try {
                const capaTemporal = L.geoJSON(barrioEncontrado);
                const limites = capaTemporal.getBounds();
                map.flyToBounds(limites, { padding: [50, 50], maxZoom: 16, duration: 1.5 });
            } catch (error) {
                console.error("Error al enfocar el mapa:", error);
            }
        }
    }, [barrioEncontrado, map]);
    return null;
};

// =====================================================================
// COMPONENTE PRINCIPAL: Visor Villamariana
// =====================================================================
const VisorVillamariana = () => {
    const [beneficiarios, setBeneficiarios] = useState(null);
    const [barrioSeleccionado, setBarrioSeleccionado] = useState(null);
    const [zonaSeleccionada, setZonaSeleccionada] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [barrioEnfoque, setBarrioEnfoque] = useState(null);

    // --- CARGA DE DATOS ---
    useEffect(() => {
        Swal.showLoading();
        axios.get('http://localhost:3000/api/vivienda/villamariana')
            .then(response => {
                setBeneficiarios(response.data);
                Swal.close();
            })
            .catch(error => {
                console.error("Error cargando beneficiarios:", error);
                Swal.fire('Error', 'No se pudo conectar con el Backend de Vivienda', 'error');
            });
    }, []);

    // --- LÓGICA DE BÚSQUEDA ---
    const buscarBeneficiario = () => {
        if (!busqueda.trim()) {
            Swal.fire('Atención', 'Ingrese un nombre de barrio o vereda', 'warning');
            return;
        }

        if (beneficiarios) {
            // Buscamos por 'nombre_barrio' que es lo que envía el backend agrupado
            const encontrado = beneficiarios.features.find(
                (f) => (f.properties.nombre_barrio || '').toLowerCase().includes(busqueda.trim().toLowerCase())
            );

            if (encontrado) {
                setBarrioEnfoque(encontrado);
                setBarrioSeleccionado(encontrado.properties.nombre_barrio);
                setZonaSeleccionada(null); 
            } else {
                Swal.fire('No encontrado', `No hay registros para: ${busqueda}`, 'error');
            }
        }
    };

    // --- ESTILO PROFESIONAL (Mapa de Coropletas) ---
    // Define el color según la intensidad (cantidad de familias)
    const getColor = (d) => {
        return d > 20 ? '#00441b' : 
               d > 10 ? '#238b45' : 
               d > 5  ? '#74c476' : 
               d > 0  ? '#c7e9c0' : 
                        '#f7fcf5';  
    };

    const estiloPoligono = (feature) => {
        const p = feature.properties;
        const familias = p.total_familias || 0;
        const esBuscado = barrioEnfoque && p.nombre_barrio === barrioEnfoque.properties.nombre_barrio;

        return {
            fillColor: esBuscado ? '#ffc107' : getColor(familias),
            weight: esBuscado ? 3 : 1.5,
            opacity: 1,
            color: esBuscado ? '#000' : 'white',
            dashArray: esBuscado ? '0' : '3',
            fillOpacity: esBuscado ? 0.9 : 0.7
        };
    };

    // --- INTERACCIÓN Y POPUPS ---
    const onEachFeature = (feature, layer) => {
        const p = feature.properties;

        const popupContent = `
            <div class="card shadow-sm" style="width: 280px; font-size: 13px; border: none;">
                <div class="card-header bg-success text-white py-2 text-center">
                    <h6 class="mb-0 fw-bold">📍 ${p.nombre_barrio || 'S/N'}</h6>
                    <small class="opacity-75">${p.tipo_zona}</small>
                </div>
                
                <ul class="list-group list-group-flush">
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light">
                        <span class="fw-bold text-dark">Familias Beneficiarias:</span>
                        <span class="badge bg-primary fs-6 rounded-pill">${p.total_familias || 0}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center bg-light border-bottom">
                        <span class="fw-bold text-dark">Personas Impactadas:</span>
                        <span class="badge bg-success fs-6 rounded-pill">${p.total_personas || 0}</span>
                    </li>

                    <li class="list-group-item">
                        <small class="text-muted d-block mb-1">Distribución de Género:</small>
                        <span class="badge bg-info text-dark me-1">👧 Mujeres: ${p.total_mujeres || 0}</span>
                        <span class="badge bg-secondary">👦 Hombres: ${p.total_hombres || 0}</span>
                    </li>

                    <li class="list-group-item">
                        <small class="text-muted d-block mb-1">Enfoque Diferencial (Familias):</small>
                        ${p.cabeza_hogar > 0 ? `<span class="badge bg-warning text-dark me-1 mb-1">👑 Madres Cabeza: ${p.cabeza_hogar}</span>` : ''}
                        ${p.total_victimas > 0 ? `<span class="badge bg-danger me-1 mb-1">🕊️ Víctimas: ${p.total_victimas}</span>` : ''}
                        ${(!p.cabeza_hogar && !p.total_victimas) ? '<span class="text-muted fst-italic">Sin población diferencial registrada</span>' : ''}
                    </li>
                </ul>
            </div>
        `;
        layer.bindPopup(popupContent);
    };

    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>

            {/* BARRA DE BÚSQUEDA FLOTANTE */}
            <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: '450px' }}>
                <div className="input-group shadow-lg rounded">
                    <input
                        type="text"
                        className="form-control px-3"
                        placeholder="🔍 Buscar por barrio o vereda..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') buscarBeneficiario(); }}
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none' }}
                    />
                    <button className="btn btn-primary fw-bold px-4" onClick={buscarBeneficiario}>Buscar</button>
                </div>
            </div>

            {/* DASHBOARD LATERAL */}
            {beneficiarios && (
                <Dashboard
                    datos={beneficiarios}
                    barrioActivo={barrioSeleccionado}
                    onSelectBarrio={setBarrioSeleccionado}
                    zonaActiva={zonaSeleccionada}
                    onSelectZona={setZonaSeleccionada}
                />
            )}

            {/* MAPA BASE */}
            <BaseMap>
                <EnfocarBarrio barrioEncontrado={barrioEnfoque} />

                {beneficiarios && (
                    <GeoJSON
                        key={`capa-vivienda-${barrioSeleccionado}-${zonaSeleccionada}-${barrioEnfoque?.properties?.nombre_barrio || 'none'}`}
                        data={beneficiarios}
                        style={estiloPoligono}
                        onEachFeature={onEachFeature}
                        filter={(feature) => {
                            // Filtro por Barrio/Vereda
                            const cumpleBarrio = barrioSeleccionado === null || feature.properties.nombre_barrio === barrioSeleccionado;

                            // Filtro por Zona (Rural/Urbana)
                            let cumpleZona = true;
                            if (zonaSeleccionada !== null) {
                                const tipo = (feature.properties.tipo_zona || '').toLowerCase();
                                cumpleZona = tipo.includes(zonaSeleccionada);
                            }

                            return cumpleBarrio && cumpleZona;
                        }}
                    >
                        {/* Tooltip rápido al pasar el mouse */}
                        <Tooltip sticky>
                            {(layer) => {
                                const p = layer.feature.properties;
                                return `<b>${p.nombre_barrio}</b><br/>${p.total_familias} familias beneficiarias`;
                            }}
                        </Tooltip>
                    </GeoJSON>
                )}
            </BaseMap>
        </div>
    );
}

export default VisorVillamariana;