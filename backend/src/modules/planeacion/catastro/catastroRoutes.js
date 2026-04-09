// src/modules/planeacion/catastro/catastroRoutes.js
const { Router } = require('express');
const router = Router();

// 1. Importamos los middlewares de seguridad desde el núcleo global (shared)
const { verificarToken } = require('../../../shared/middlewares/auth');
const { aplicarPermisos } = require('../../../shared/middlewares/roles');

// 2. Importamos el mapa de permisos específico de este módulo
const permisosCatastro = require('./catastroPermissions');

// 3. Importamos los controladores del módulo
const { getPredios } = require('./prediosController');
const { getPrediosPagos2025 } = require('./prediosPagos2025Controller'); 


// --- BARRERA DE SEGURIDAD DEL MÓDULO ---
// Toda petición que entre a /api/catastro pasará obligatoriamente por aquí primero:

// A. ¿El usuario tiene un Token JWT válido?
router.use(verificarToken); 

// B. ¿El rol del usuario tiene permiso para la ruta solicitada según catastroPermissions?
router.use(aplicarPermisos(permisosCatastro)); 

// ----------------------------------------


// --- DEFINICIÓN DE RUTAS LIMPIAS ---
// Gracias al middleware anterior, aquí ya tenemos garantía absoluta de que 
// quien llegue a este punto está autenticado y autorizado.

// Ruta 1: Mapa Catastral Básico
router.get('/predios', getPredios);

// Ruta 2: Mapa Catastral + Reporte Financiero 2025
router.get('/predios-pagos-2025', getPrediosPagos2025);


module.exports = router;