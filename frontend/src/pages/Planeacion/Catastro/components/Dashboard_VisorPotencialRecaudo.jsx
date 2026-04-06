import React, { useMemo, useState } from 'react';

const Dashboard = ({ datos, tarifaActiva, onSelectTarifa, zonaActiva, onSelectZona }) => {
  const [vista, setVista] = useState('resumen'); 

  // --- LÓGICA DE PROCESAMIENTO ---
  const estadisticas = useMemo(() => {
    if (!datos) return null;

    let totalUrbano = 0;
    let totalRural = 0;
    const conteoTarifas = {};

    datos.features.forEach(feature => {
      // 1. Obtener la zona del predio
      const zonaPredio = (feature.properties.zona || '').toLowerCase();
      
      // Contar totales globales para el Resumen (esto no se filtra)
      if (zonaPredio.includes('urban')) totalUrbano++;
      else if (zonaPredio.includes('rural')) totalRural++;

      // 2. Lógica reactiva para Tarifas: 
      // ¿Este predio debe ser contado en las tarifas según la zona activa?
      let contarEnTarifas = true;
      if (zonaActiva !== null) {
        contarEnTarifas = zonaPredio.includes(zonaActiva);
      }

      // 3. Agrupar Tarifas (SOLO si cumple la condición de zona)
      if (contarEnTarifas) {
        const tarifaRaw = feature.properties.tarifa;
        const tarifaLabel = tarifaRaw ? `Tarifa ${tarifaRaw}` : 'Sin Información';
          
        if (!conteoTarifas[tarifaLabel]) {
          conteoTarifas[tarifaLabel] = { cantidad: 0, rawValue: tarifaRaw || null };
        }
        conteoTarifas[tarifaLabel].cantidad += 1;
      }
    });

    // Convertir Tarifas a Arreglo y Ordenar
    const ranking = Object.entries(conteoTarifas)
      .map(([nombre, data]) => ({ nombre, cantidad: data.cantidad, rawValue: data.rawValue }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return {
      total: datos.features.length,
      urbano: totalUrbano,
      rural: totalRural,
      ranking: ranking,
      // Sumamos la cantidad de predios que quedaron en la lista de tarifas actual
      totalFiltrado: ranking.reduce((acc, item) => acc + item.cantidad, 0) 
    };
  }, [datos, zonaActiva]); // <-- IMPORTANTE: Ahora el useMemo también depende de zonaActiva

  if (!datos) return null;

  return (
    <div className="card shadow" style={estiloDashboard}>
      
      {/* ENCABEZADO Y PESTAÑAS */}
      <div className="card-header bg-dark text-white pt-3 pb-2">
        <h5 className="mb-3 fw-bold text-center">📊 Panel de Control</h5>
        
        <div className="btn-group w-100 mb-1" role="group">
          <button 
            type="button" 
            className={`btn btn-sm ${vista === 'resumen' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setVista('resumen')}
          >
            Resumen Zonas
          </button>
          <button 
            type="button" 
            className={`btn btn-sm ${vista === 'tarifas' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setVista('tarifas')}
          >
            Filtro Tarifas
          </button>
        </div>
      </div>

      {/* CUERPO DINÁMICO */}
      <div className="card-body p-0" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        
        {/* VISTA 1: RESUMEN ZONAS */}
        {vista === 'resumen' && (
          <div className="list-group list-group-flush">
            {/* Botón Total */}
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === null ? 'bg-light border-start border-primary border-4' : ''}`}
              onClick={() => onSelectZona(null)}
            >
              <span className={`fs-6 ${zonaActiva === null ? 'fw-bold text-primary' : 'fw-bold'}`}>Total Predios</span>
              <span className="badge bg-primary fs-6 rounded-pill">{estadisticas.total}</span>
            </button>
            
            {/* Botón Zona Urbana */}
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === 'urbana' ? 'bg-light border-start border-primary border-4' : ''}`}
              onClick={() => {
                onSelectZona('urbana');
                onSelectTarifa(null); // Limpia la tarifa al cambiar de zona para evitar inconsistencias
              }}
            >
              <span className="fw-bold text-secondary">🏙️ Zona Urbana</span>
              <span className="badge bg-secondary fs-6 rounded-pill">{estadisticas.urbano}</span>
            </button>
            
            {/* Botón Zona Rural */}
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === 'rural' ? 'bg-light border-start border-primary border-4' : ''}`}
              onClick={() => {
                onSelectZona('rural');
                onSelectTarifa(null); // Limpia la tarifa al cambiar de zona
              }}
            >
              <span className="fw-bold text-success">🌲 Zona Rural</span>
              <span className="badge bg-success fs-6 rounded-pill">{estadisticas.rural}</span>
            </button>
          </div>
        )}

        {/* VISTA 2: FILTRO DE TARIFAS REACTIVO */}
        {vista === 'tarifas' && (
          <div className="list-group list-group-flush">
            
            {/* Cabecera que indica qué zona estamos viendo */}
            <div className="list-group-item bg-light text-center text-muted small py-1">
              Mostrando tarifas para: {zonaActiva === 'urbana' ? '🏙️ Urbana' : zonaActiva === 'rural' ? '🌲 Rural' : 'Todas las zonas'}
            </div>

            <button 
              className={`list-group-item list-group-item-action fw-bold text-center ${tarifaActiva === null ? 'active' : 'text-primary'}`}
              onClick={() => onSelectTarifa(null)}
            >
              Mostrar Todos ({estadisticas.totalFiltrado})
            </button>

            {estadisticas.ranking.length === 0 ? (
              <div className="p-4 text-center text-muted small">No hay tarifas para mostrar en esta zona.</div>
            ) : (
              estadisticas.ranking.map((item, index) => (
                <button 
                  key={index} 
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${tarifaActiva === item.rawValue ? 'active' : ''}`}
                  onClick={() => onSelectTarifa(item.rawValue)}
                >
                  <span style={{ fontSize: '0.9rem' }}>
                    {index + 1}. {item.nombre}
                  </span>
                  <div className="text-end">
                    <span className={`badge rounded-pill ${tarifaActiva === item.rawValue ? 'bg-light text-dark' : 'bg-secondary'}`}>
                      {item.cantidad}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

      </div>
      
      <div className="card-footer text-center text-muted py-1" style={{ fontSize: '0.75rem' }}>
        MuniSoft Catastro
      </div>
    </div>
  );
};

const estiloDashboard = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '320px',
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
  border: 'none',
  borderRadius: '12px',
  overflow: 'hidden'
};

export default Dashboard;