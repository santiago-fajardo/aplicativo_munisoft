// src/modules/index.js
const express = require('express');
const router = express.Router();

// Importar las rutas de cada secretaría
const catastroRoutes = require('./planeacion/catastro/catastroRoutes');
const viviendaRoutes = require('./planeacion/vivienda/villaMarianaRoutes');
// const transitoRoutes = require('./transito/transitoRoutes'); <-- Cuando crezca

// Definir los prefijos por secretaría
router.use('/catastro', catastroRoutes);
router.use('/vivienda', viviendaRoutes);
// router.use('/transito', transitoRoutes);

module.exports = router;