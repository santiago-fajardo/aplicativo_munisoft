// Archivo: src/routes/index.js
const { Router } = require('express');
const router = Router();

// Importamos las rutas de cada dependencia/módulo
const catastroRoutes = require('./catastroRoutes');
const villaMarianaRoutes = require('./villaMarianaRoutes');


router.use('/catastro', catastroRoutes);
router.use('/vivienda', villaMarianaRoutes);

module.exports = router;