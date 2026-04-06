import React from 'react';
import { Link } from 'react-router-dom';

const DashboardVivienda = () => {
    return (
        <div className="container py-5">
            {/* Encabezado */}
            <div className="row mb-4">
                <div className="col-12 text-center text-md-start">
                    <h2 className="fw-bold text-dark mb-1">🏠 Módulo de Vivienda</h2>
                    <p className="text-muted fs-5">Gestión de proyectos habitacionales y beneficiarios</p>
                </div>
            </div>

            {/* Tarjetas de Proyectos */}
            <div className="row g-4">
                
                {/* Tarjeta: Proyecto Villa Mariana */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 h-100 hover-elevate transition-all">
                        <div className="card-body p-4 text-center">
                            <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex p-3 mb-3 display-6">
                                🏘️
                            </div>
                            <h5 className="fw-bold mb-2">Proyecto Villa Mariana</h5>
                            <p className="text-muted small mb-4">
                                Visor geográfico de las familias beneficiarias del proyecto en zonas urbanas y rurales.
                            </p>
                            {/* Este botón nos llevará al mapa que estamos a punto de crear */}
                            <Link to="/planeacion/vivienda/villamariana" className="btn btn-primary w-100">
                                Ver Mapa de Beneficiarios
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tarjeta: Próximos Proyectos (De relleno para que no se vea vacío) */}
                <div className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 h-100 bg-light opacity-75">
                        <div className="card-body p-4 text-center">
                            <div className="bg-secondary bg-opacity-10 text-secondary rounded-circle d-inline-flex p-3 mb-3 display-6">
                                📝
                            </div>
                            <h5 className="fw-bold mb-2 text-muted">Mejoramiento de Vivienda</h5>
                            <p className="text-muted small mb-4">
                                Base de datos de postulantes para subsidios de mejoramiento estructural.
                            </p>
                            <button className="btn btn-outline-secondary w-100" disabled>
                                Próximamente
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DashboardVivienda;