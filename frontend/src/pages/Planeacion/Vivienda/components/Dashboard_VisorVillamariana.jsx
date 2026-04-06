import React, { useMemo, useState } from 'react';

const Dashboard_VisorVillamariana = ({ datos, barrioActivo, onSelectBarrio, zonaActiva, onSelectZona }) => {
  // Ahora la vista por defecto es el resumen de "impacto"
  const [vista, setVista] = useState('impacto'); 

  // --- LÓGICA DE PROCESAMIENTO ---
  const estadisticas = useMemo(() => {
    if (!datos) return null;

    let stats = {
      familias: 0,
      personas: 0,
      mujeres: 0,
      hombres: 0,
      cabeza_hogar: 0,
      victimas: 0,
      discapacidad: 0,
      lgtbiq: 0,
      urbanoFamilias: 0,
      ruralFamilias: 0,
      rankingBarrios: []
    };

    const conteoBarrios = {};

    datos.features.forEach(feature => {
      // IMPORTANTE: Solo sumamos los polígonos para no contar doble (por los centroides)
      if (feature.properties.tipo !== 'poligono') return;

      const p = feature.properties;
      const zonaPredio = (p.tipo_zona || '').toLowerCase();
      
      // Contar totales para la pestaña de "Zonas" sin importar el filtro
      if (zonaPredio.includes('urban')) stats.urbanoFamilias += (p.total_familias || 0);
      else if (zonaPredio.includes('rural')) stats.ruralFamilias += (p.total_familias || 0);

      // Verificamos si este polígono debe sumar a las estadísticas actuales según la zona seleccionada
      let pasaFiltroZona = true;
      if (zonaActiva !== null) {
        pasaFiltroZona = zonaPredio.includes(zonaActiva);
      }

      if (pasaFiltroZona) {
        // Sumatorias sociodemográficas
        stats.familias += (p.total_familias || 0);
        stats.personas += (p.total_personas || 0);
        stats.mujeres += (p.total_mujeres || 0);
        stats.hombres += (p.total_hombres || 0);
        stats.cabeza_hogar += (p.cabeza_hogar || 0);
        stats.victimas += (p.total_victimas || 0);
        stats.discapacidad += (p.total_discapacidad || 0);
        stats.lgtbiq += (p.total_lgtbiq || 0);

        // Agrupar para el ranking de Barrios
        const barrioRaw = p.nombre_barrio;
        const barrioLabel = barrioRaw ? barrioRaw.toUpperCase() : 'SIN BARRIO';
          
        if (!conteoBarrios[barrioLabel]) {
          conteoBarrios[barrioLabel] = { cantidad: 0, rawValue: barrioRaw || null };
        }
        conteoBarrios[barrioLabel].cantidad += (p.total_familias || 0);
      }
    });

    // Ordenar barrios de mayor a menor impacto
    stats.rankingBarrios = Object.entries(conteoBarrios)
      .map(([nombre, data]) => ({ nombre, cantidad: data.cantidad, rawValue: data.rawValue }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return stats;
  }, [datos, zonaActiva]); 

  if (!datos) return null;

  return (
    <div className="card shadow-lg" style={estiloDashboard}>
      
      {/* ENCABEZADO Y TABS */}
      <div className="card-header bg-success text-white pt-3 pb-2 border-0">
        <h5 className="mb-3 fw-bold text-center">
          <span className="fs-4 me-2">🏘️</span>
          Proyecto Villamariana
        </h5>
        
        <div className="btn-group w-100 shadow-sm" role="group">
          <button 
            type="button" 
            className={`btn btn-sm ${vista === 'impacto' ? 'btn-light text-success fw-bold' : 'btn-outline-light'}`}
            onClick={() => setVista('impacto')}
          >
            📊 Impacto
          </button>
          <button 
            type="button" 
            className={`btn btn-sm ${vista === 'zonas' ? 'btn-light text-success fw-bold' : 'btn-outline-light'}`}
            onClick={() => setVista('zonas')}
          >
            🗺️ Zonas
          </button>
          <button 
            type="button" 
            className={`btn btn-sm ${vista === 'barrios' ? 'btn-light text-success fw-bold' : 'btn-outline-light'}`}
            onClick={() => setVista('barrios')}
          >
            📍 Barrios
          </button>
        </div>
      </div>

      <div className="card-body p-0 bg-light" style={{ maxHeight: '65vh', overflowY: 'auto', overflowX: 'hidden' }}>
        
        {/* =========================================================================
            VISTA 1: IMPACTO SOCIODEMOGRÁFICO (La vista hermosa)
            ========================================================================= */}
        {vista === 'impacto' && (
          <div className="p-3">
            {/* Aviso de filtro activo */}
            {zonaActiva && (
              <div className="alert alert-warning py-1 px-2 text-center small mb-3 shadow-sm border-0">
                Mostrando datos solo para zona: <strong>{zonaActiva.toUpperCase()}</strong>
              </div>
            )}

            {/* Tarjetas Principales */}
            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="card border-0 shadow-sm bg-primary text-white text-center h-100 py-2">
                  <h3 className="mb-0 fw-bold">{estadisticas.familias}</h3>
                  <small className="opacity-75" style={{ fontSize: '0.7rem' }}>FAMILIAS BENEFICIARIAS</small>
                </div>
              </div>
              <div className="col-6">
                <div className="card border-0 shadow-sm bg-info text-dark text-center h-100 py-2">
                  <h3 className="mb-0 fw-bold">{estadisticas.personas}</h3>
                  <small className="opacity-75 fw-bold" style={{ fontSize: '0.7rem' }}>PERSONAS IMPACTADAS</small>
                </div>
              </div>
            </div>

            <h6 className="fw-bold text-muted border-bottom pb-1 mb-2" style={{ fontSize: '0.8rem' }}>ENFOQUE DIFERENCIAL</h6>
            
            {/* Cuadrícula de Enfoques */}
            <div className="row g-2">
              <div className="col-6">
                <div className="bg-white p-2 rounded shadow-sm border-start border-warning border-4">
                  <div className="text-muted" style={{ fontSize: '0.65rem' }}>MADRES CABEZA</div>
                  <div className="fw-bold fs-5 text-dark">👑 {estadisticas.cabeza_hogar}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-white p-2 rounded shadow-sm border-start border-danger border-4">
                  <div className="text-muted" style={{ fontSize: '0.65rem' }}>VÍCTIMAS</div>
                  <div className="fw-bold fs-5 text-dark">🕊️ {estadisticas.victimas}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-white p-2 rounded shadow-sm border-start border-dark border-4">
                  <div className="text-muted" style={{ fontSize: '0.65rem' }}>DISCAPACIDAD</div>
                  <div className="fw-bold fs-5 text-dark">♿ {estadisticas.discapacidad}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="bg-white p-2 rounded shadow-sm border-start border-4" style={{ borderLeftColor: '#e83e8c' }}>
                  <div className="text-muted" style={{ fontSize: '0.65rem' }}>LGTBIQ+</div>
                  <div className="fw-bold fs-5 text-dark">🏳️‍🌈 {estadisticas.lgtbiq}</div>
                </div>
              </div>
            </div>

            <h6 className="fw-bold text-muted border-bottom pb-1 mb-2 mt-3" style={{ fontSize: '0.8rem' }}>GÉNERO</h6>
            <div className="d-flex justify-content-between bg-white rounded shadow-sm p-2 px-3">
              <div className="text-center">
                <span className="fs-5">👧</span> <span className="fw-bold fs-6 text-primary">{estadisticas.mujeres}</span>
              </div>
              <div className="text-center">
                <span className="fs-5">👦</span> <span className="fw-bold fs-6 text-secondary">{estadisticas.hombres}</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VISTA 2: ZONAS
            ========================================================================= */}
        {vista === 'zonas' && (
          <div className="list-group list-group-flush">
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === null ? 'bg-white border-start border-success border-4 shadow-sm' : 'bg-light'}`}
              onClick={() => onSelectZona(null)}
            >
              <span className={`fs-6 ${zonaActiva === null ? 'fw-bold text-success' : 'fw-bold'}`}>Municipio Total</span>
              <span className="badge bg-success fs-6 rounded-pill">{estadisticas.urbanoFamilias + estadisticas.ruralFamilias} fam.</span>
            </button>
            
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === 'urbana' ? 'bg-white border-start border-success border-4 shadow-sm' : 'bg-light'}`}
              onClick={() => {
                onSelectZona('urbana');
                onSelectBarrio(null); 
              }}
            >
              <span className="fw-bold text-secondary">🏙️ Zona Urbana</span>
              <span className="badge bg-secondary fs-6 rounded-pill">{estadisticas.urbanoFamilias} fam.</span>
            </button>
            
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === 'rural' ? 'bg-white border-start border-success border-4 shadow-sm' : 'bg-light'}`}
              onClick={() => {
                onSelectZona('rural');
                onSelectBarrio(null); 
              }}
            >
              <span className="fw-bold text-success">🌲 Zona Rural</span>
              <span className="badge bg-success fs-6 rounded-pill">{estadisticas.ruralFamilias} fam.</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            VISTA 3: BARRIOS
            ========================================================================= */}
        {vista === 'barrios' && (
          <div className="list-group list-group-flush">
            <div className="bg-white text-center text-muted small py-2 fw-bold border-bottom">
              Ranking de Barrios {zonaActiva === 'urbana' ? '(🏙️ Urbana)' : zonaActiva === 'rural' ? '(🌲 Rural)' : ''}
            </div>

            <button 
              className={`list-group-item list-group-item-action fw-bold text-center ${barrioActivo === null ? 'active bg-success border-success' : 'text-success'}`}
              onClick={() => onSelectBarrio(null)}
            >
              Mostrar Todos en el Mapa
            </button>

            {estadisticas.rankingBarrios.map((item, index) => (
              <button 
                key={index} 
                className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${barrioActivo === item.rawValue ? 'bg-light border-start border-success border-4' : ''}`}
                onClick={() => onSelectBarrio(item.rawValue)}
              >
                <span style={{ fontSize: '0.85rem' }} className={barrioActivo === item.rawValue ? 'fw-bold text-success' : ''}>
                  {index + 1}. {item.nombre}
                </span>
                <span className={`badge rounded-pill ${barrioActivo === item.rawValue ? 'bg-success' : 'bg-secondary'}`}>
                  {item.cantidad} fam.
                </span>
              </button>
            ))}
          </div>
        )}

      </div>
      
      <div className="card-footer text-center bg-white text-muted py-2 border-top-0" style={{ fontSize: '0.7rem' }}>
        <strong>MuniSoft</strong> | Secretaría de Planeación
      </div>
    </div>
  );
};

const estiloDashboard = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  width: '350px', // Un poco más ancho para que la cuadrícula respire
  zIndex: 1000,
  border: 'none',
  borderRadius: '12px',
  overflow: 'hidden'
};

export default Dashboard_VisorVillamariana;