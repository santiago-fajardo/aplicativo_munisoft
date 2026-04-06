import React from 'react';
import { Link } from 'react-router-dom';
import fotoSecretario from '../../assets/secretarioplaneacion.png';

const PanelPlaneacion = () => {
    return (
        // Ya no necesitamos el div con el 'style' del background aquí. 
        // Solo dejamos el contenedor principal.
        <div className="container py-5">

            <div className="row mb-5">
                <div className="col-12 text-center text-md-start">
                    <h2 className="fw-bold text-dark mb-1">🏛️ Secretaría de Planeación</h2>
                    <p className="text-muted fs-5">Plataforma Central de Información Municipal</p>
                </div>
            </div>

            <div className="row g-4">

                <div className="col-12 col-md-4 col-lg-3">
                    <div className="card shadow-sm border-0 text-center h-100 bg-white bg-opacity-75">
                        <div className="card-body d-flex flex-column align-items-center justify-content-center pt-5">
                            <div
                                className="rounded-circle mb-3 border border-3 border-primary shadow-sm"
                                style={{ width: '150px', height: '150px', overflow: 'hidden' }}
                            >
                                <img
                                    src={fotoSecretario}
                                    alt="Secretario de Planeación"
                                    className="img-fluid w-100 h-100 object-fit-cover"
                                />
                            </div>

                            <h5 className="card-title fw-bold text-dark mb-0">Gustavo Ledesma</h5>
                            <p className="text-muted small mb-3">Secretario de Planeación</p>

                            <hr className="w-100 opacity-25" />

                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                "Planificando el futuro de Santander de Quilichao con datos precisos y tecnología al servicio de la gente."
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-8 col-lg-9">
                    <h4 className="mb-4 fw-bold border-bottom border-secondary pb-2">Áreas de Gestión</h4>

                    <div className="row g-4">
                        <div className="col-12 col-xl-6">
                            <div className="card shadow-sm border-0 h-100 hover-elevate transition-all">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3 display-6">
                                            🗺️
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">Gestión Catastral</h5>
                                            <span className="badge bg-success">Módulo Activo</span>
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-4">
                                        Administración de la base de datos predial, actualización de avalúos y análisis de potencial de recaudo rural y urbano.
                                    </p>
                                    <Link to="/planeacion/catastro" className="btn btn-primary w-100">
                                        Ingresar a Catastro
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="card shadow-sm border-0 h-100 hover-elevate transition-all">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded p-3 me-3 display-6">
                                            🏠
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">Vivienda</h5>
                                            <span className="badge bg-success">Módulo Activo</span>
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-4">
                                        Proyectos de vivienda.
                                    </p>
                                    <Link to="/planeacion/vivienda" className="btn btn-primary w-100">
                                        Ingresar a Vivienda
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="card shadow-sm border-0 h-100 bg-light opacity-75">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-secondary bg-opacity-10 text-secondary rounded p-3 me-3 display-6">
                                            🏗️
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0 text-muted">Ordenamiento Territorial</h5>
                                            <span className="badge bg-secondary">Próximamente</span>
                                        </div>
                                    </div>
                                    <p className="text-muted small mb-4">
                                        Zonificación, usos del suelo, determinantes ambientales y control de licencias de construcción.
                                    </p>
                                    <button className="btn btn-outline-secondary w-100" disabled>
                                        En Desarrollo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PanelPlaneacion;