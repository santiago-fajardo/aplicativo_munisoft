// Archivo: src/routes/catastro.routes.js
const { Router } = require('express');
const router = Router();

// Importamos los controladores que hemos creado
const { getPredios } = require('../controllers/catastro/prediosController');
const { getPrediosPagos2025 } = require('../controllers/catastro/prediosPagos2025Controller'); // <-- NUEVO IMPORT

// Definimos las rutas finales. 
// Ojo: Ya no ponemos "/api/catastro" aquí, solo la parte final de la URL

// Ruta 1: Mapa Catastral Básico
router.get('/predios', getPredios);

// Ruta 2: Mapa Catastral + Reporte Financiero 2025
router.get('/predios-pagos-2025', getPrediosPagos2025); // <-- NUEVA RUTA

module.exports = router;