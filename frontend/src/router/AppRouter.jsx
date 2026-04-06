import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopNavbar from '../components/layout/TopNavbar';

// --- PÁGINAS DE INICIO ---
import PanelPlaneacion from '../pages/Inicio/PanelPlaneacion';

// --- PÁGINAS DE CATASTRO ---
import DashboardCatastro from '../pages/Planeacion/Catastro/DashboardCatastro';
import VisorPotencialRecaudo from '../pages/Planeacion/Catastro/VisorPotencialRecaudo';
import VisorPagos2025 from '../pages/Planeacion/Catastro/VisorPagos2025'; // <-- 1. IMPORTAMOS EL MAPA PADRE

// --- PÁGINAS DE VIVIENDA ---
import DashboardVivienda from '../pages/Planeacion/Vivienda/DashboardVivienda';
import VisorVillaMariana from '../pages/Planeacion/Vivienda/VisorVillaMariana'; 

// 1. IMPORTAMOS EL FONDO A NIVEL GLOBAL
import fondoSantander from '../assets/Santander.webp';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column vh-100 vw-100">
        <TopNavbar />

        {/* 2. APLICAMOS EL FONDO AL CONTENEDOR MAESTRO */}
        <div 
          className="flex-grow-1 position-relative overflow-auto"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(248, 249, 250, 0.98)), url(${fondoSantander})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <Routes>
            <Route path="/" element={<PanelPlaneacion />} />
            
            {/* Rutas de Catastro */}
            <Route path="/planeacion/catastro" element={<DashboardCatastro />} />
            <Route path="/planeacion/catastro/potencial-recaudo" element={<VisorPotencialRecaudo />} />
            
            {/* <-- 2. AQUÍ ESTÁ LA RUTA QUE FALTABA PARA VER EL MAPA DE PAGOS --> */}
            <Route path="/planeacion/catastro/pagos-2025" element={<VisorPagos2025 />} /> 
            
            {/* Rutas de Vivienda */}
            <Route path="/planeacion/vivienda" element={<DashboardVivienda />} />
            <Route path="/planeacion/vivienda/villamariana" element={<VisorVillaMariana />} /> 
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;