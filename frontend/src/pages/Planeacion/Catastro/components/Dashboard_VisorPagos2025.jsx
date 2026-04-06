import React, { useMemo, useState } from 'react';

const Dashboard_VisorPagos2025 = ({ 
  datos, 
  estadoActivo, onSelectEstado, 
  zonaActiva, onSelectZona,
  tarifaActiva, onSelectTarifa // <-- RECIBIMOS LAS PROPS
}) => {
  const [vista, setVista] = useState('resumen'); 

  const estadisticas = useMemo(() => {
    if (!datos) return null;

    let stats = {
      totalPredios: 0,
      urbano: 0,
      rural: 0,
      pagados: 0,
      deudores: 0,
      dineroRecaudado: 0,
      recaudoPorTarifa: [] // Almacena el listado de tarifas
    };

    let tempTarifas = {}; 

    datos.features.forEach(feature => {
      const p = feature.properties;
      const zonaPredio = (p.zona || '').toLowerCase();
      const recaudo = p.valorrecaudo || 0;
      const tarifaPredio = p.tarifa || 'Sin Tarifa';
      
      // Totales globales por zona
      if (zonaPredio.includes('urban')) stats.urbano++;
      else if (zonaPredio.includes('rural')) stats.rural++;

      // Validar Filtros
      let pasaFiltroZona = zonaActiva === null || zonaPredio.includes(zonaActiva);
      let pasaFiltroEstado = estadoActivo === null || (estadoActivo === 'pagado' ? recaudo > 0 : recaudo === 0);
      let pasaFiltroTarifa = tarifaActiva === null || tarifaPredio === tarifaActiva;

      // Sumatorias Principales (Requiere que pasen TODOS los filtros activos)
      if (pasaFiltroZona && pasaFiltroEstado && pasaFiltroTarifa) {
        stats.totalPredios++;
        stats.dineroRecaudado += recaudo;
        
        if (recaudo > 0) stats.pagados++;
        else stats.deudores++;
      }

      // Sumatoria para la Lista de Tarifas (Ignora el filtro de tarifa actual para no vaciar la lista)
      if (pasaFiltroZona && pasaFiltroEstado) {
        if (!tempTarifas[tarifaPredio]) {
          tempTarifas[tarifaPredio] = 0;
        }
        tempTarifas[tarifaPredio] += recaudo;
      }
    });

    stats.recaudoPorTarifa = Object.entries(tempTarifas)
      .map(([nombre, totalDinero]) => ({ nombre, totalDinero, rawValue: nombre }))
      .sort((a, b) => b.totalDinero - a.totalDinero);

    return stats;
  }, [datos, zonaActiva, estadoActivo, tarifaActiva]); 

  if (!datos) return null;

  const formatearDinero = (valor) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'COP', maximumFractionDigits: 0
  }).format(valor);

  return (
    <div className="card shadow" style={estiloDashboard}>
      
      <div className="card-header bg-primary text-white pt-3 pb-2 border-0">
        <h5 className="mb-3 fw-bold text-center">💸 Recaudo Predial 2025</h5>
        
        <div className="btn-group w-100 mb-1" role="group">
          <button 
            className={`btn btn-sm ${vista === 'resumen' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
            onClick={() => setVista('resumen')}
          >
            Zonas
          </button>
          <button 
            className={`btn btn-sm ${vista === 'estado' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
            onClick={() => setVista('estado')}
          >
            Cartera
          </button>
          <button 
            className={`btn btn-sm ${vista === 'tarifas' ? 'btn-light text-primary fw-bold' : 'btn-outline-light'}`}
            onClick={() => setVista('tarifas')}
          >
            x Tarifa
          </button>
        </div>
      </div>

      <div className="card-body p-0 bg-light" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        
        <div className="p-3 text-center border-bottom bg-white">
            <span className="text-muted small fw-bold d-block">TOTAL RECAUDADO</span>
            <h3 className="text-success fw-bold mb-0">{formatearDinero(estadisticas.dineroRecaudado)}</h3>
        </div>

        {/* VISTA 1: ZONAS */}
        {vista === 'resumen' && (
          <div className="list-group list-group-flush mt-2">
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === null ? 'bg-white border-start border-primary border-4 shadow-sm' : ''}`}
              onClick={() => onSelectZona(null)}
            >
              <span className="fw-bold">Total Predios</span>
              <span className="badge bg-primary rounded-pill">{estadisticas.totalPredios}</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === 'urbana' ? 'bg-white border-start border-primary border-4 shadow-sm' : ''}`}
              onClick={() => onSelectZona('urbana')}
            >
              <span className="fw-bold text-secondary">🏙️ Zona Urbana</span>
              <span className="badge bg-secondary rounded-pill">{estadisticas.urbano}</span>
            </button>
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${zonaActiva === 'rural' ? 'bg-white border-start border-primary border-4 shadow-sm' : ''}`}
              onClick={() => onSelectZona('rural')}
            >
              <span className="fw-bold text-success">🌲 Zona Rural</span>
              <span className="badge bg-success rounded-pill">{estadisticas.rural}</span>
            </button>
          </div>
        )}

        {/* VISTA 2: ESTADO DE PAGOS */}
        {vista === 'estado' && (
          <div className="list-group list-group-flush mt-2">
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${estadoActivo === null ? 'bg-white border-start border-primary border-4 shadow-sm' : ''}`}
              onClick={() => onSelectEstado(null)}
            >
              <span className="fw-bold text-primary">Mostrar Todos</span>
              <span className="badge bg-primary rounded-pill">{estadisticas.pagados + estadisticas.deudores}</span>
            </button>

            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${estadoActivo === 'pagado' ? 'bg-white border-start border-success border-4 shadow-sm' : ''}`}
              onClick={() => onSelectEstado('pagado')}
            >
              <span className="fw-bold text-success">
                <span className="d-inline-block rounded-circle me-2 bg-success" style={{ width: '10px', height: '10px' }}></span>
                Al Día (Pagados)
              </span>
              <span className="badge bg-success rounded-pill">{estadisticas.pagados}</span>
            </button>

            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 ${estadoActivo === 'deudor' ? 'bg-white border-start border-danger border-4 shadow-sm' : ''}`}
              onClick={() => onSelectEstado('deudor')}
            >
              <span className="fw-bold text-danger">
                <span className="d-inline-block rounded-circle me-2 bg-danger" style={{ width: '10px', height: '10px' }}></span>
                En Deuda
              </span>
              <span className="badge bg-danger rounded-pill">{estadisticas.deudores}</span>
            </button>
          </div>
        )}

        {/* VISTA 3: TARIFAS INTERACTIVAS */}
        {vista === 'tarifas' && (
          <div className="list-group list-group-flush mt-2">
            
            <button 
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2 ${tarifaActiva === null ? 'bg-white border-start border-primary border-4 shadow-sm' : ''}`}
              onClick={() => onSelectTarifa(null)}
            >
              <span className="fw-bold text-primary">Mostrar Todas las Tarifas</span>
            </button>

            {estadisticas.recaudoPorTarifa.map((item, index) => (
              <button 
                key={index} 
                className={`list-group-item list-group-item-action d-flex flex-column py-2 ${tarifaActiva === item.rawValue ? 'bg-light border-start border-primary border-4 shadow-sm' : ''}`}
                onClick={() => onSelectTarifa(item.rawValue)}
              >
                <div className="d-flex justify-content-between w-100">
                  <span className={`fw-bold mb-1 ${tarifaActiva === item.rawValue ? 'text-primary' : 'text-secondary'}`} style={{ fontSize: '0.85rem' }}>
                    Tarifa: {item.nombre}
                  </span>
                </div>
                <span className={`fw-bold ${item.totalDinero > 0 ? 'text-success' : 'text-danger'}`}>
                  {formatearDinero(item.totalDinero)}
                </span>
              </button>
            ))}
          </div>
        )}

      </div>
      
      <div className="card-footer text-center bg-white text-muted py-2 border-top-0" style={{ fontSize: '0.75rem' }}>
        <strong>MuniSoft</strong> | Hacienda
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
  border: 'none',
  borderRadius: '12px',
  overflow: 'hidden'
};

export default Dashboard_VisorPagos2025;