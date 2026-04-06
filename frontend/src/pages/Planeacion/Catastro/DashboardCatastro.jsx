import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCatastro = () => {
  return (
    <div className="container py-4">
      
      {/* Migas de pan (Breadcrumbs) para que el usuario no se pierda */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Inicio</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Catastro</li>
        </ol>
      </nav>

      {/* Encabezado del Área */}
      <div className="d-flex align-items-center mb-4 border-bottom pb-3">
        <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3 display-5">
          🗺️
        </div>
        <div>
          <h2 className="fw-bold text-dark mb-0">Gestión Catastral</h2>
          <p className="text-muted mb-0">Seleccione el módulo o herramienta al que desea ingresar.</p>
        </div>
      </div>

      {/* Módulos de Catastro */}
      <div className="row g-4">
        
        {/* HERRAMIENTA 1: Visor Potencial Recaudo */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 hover-elevate">
            <div className="card-body text-center p-4">
              <div className="display-4 mb-3">📍</div>
              <h5 className="fw-bold">Visor Potencial Recaudo</h5>
              <p className="text-muted small">
                Mapa interactivo con avalúos, tarifas y zonas para análisis de recaudo rural.
              </p>
              <Link to="/planeacion/catastro/potencial-recaudo" className="btn btn-primary w-100 mt-2">
                Abrir Visor
              </Link>
            </div>
          </div>
        </div>

        {/* HERRAMIENTA 2: Visor de Pagos Financieros 2025 (¡NUEVO!) */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 hover-elevate border-bottom border-success border-4">
            <div className="card-body text-center p-4">
              <div className="display-4 mb-3">💸</div>
              <h5 className="fw-bold">Estado de Pagos 2025</h5>
              <p className="text-muted small">
                Mapa semaforizado con el estado de recaudo, cartera morosa y predios al día.
              </p>
              <Link to="/planeacion/catastro/pagos-2025" className="btn btn-success w-100 mt-2">
                Abrir Visor Financiero
              </Link>
            </div>
          </div>
        </div>

        {/* HERRAMIENTA 3: Fichas Prediales (Futuro) */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-light opacity-75">
            <div className="card-body text-center p-4">
              <div className="display-4 mb-3">📄</div>
              <h5 className="fw-bold text-muted">Fichas Prediales</h5>
              <p className="text-muted small">
                Generador de certificados y consulta detallada por código predial.
              </p>
              <button className="btn btn-outline-secondary w-100 mt-2" disabled>
                Próximamente
              </button>
            </div>
          </div>
        </div>

        {/* HERRAMIENTA 4: Conservación (Futuro) */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100 bg-light opacity-75">
            <div className="card-body text-center p-4">
              <div className="display-4 mb-3">🔄</div>
              <h5 className="fw-bold text-muted">Conservación Dinámica</h5>
              <p className="text-muted small">
                Registro de mutaciones de primera, segunda y tercera clase.
              </p>
              <button className="btn btn-outline-secondary w-100 mt-2" disabled>
                Próximamente
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardCatastro;