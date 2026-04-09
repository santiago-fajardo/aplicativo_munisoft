const express = require('express');
const cors = require('cors');
require('dotenv').config();

// IMPORTANTE: Solo importas el Router Maestro
const masterRouter = require('./modules/index');

const app = express();

app.use(cors());
app.use(express.json());

// TODAS las rutas de Munisoft se montan bajo el prefijo /api
app.use('/api', masterRouter); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Munisoft corriendo en http://localhost:${PORT}`);
    console.log(`📍 Catastro: http://localhost:${PORT}/api/catastro`);
    console.log(`📍 Vivienda: http://localhost:${PORT}/api/vivienda`);
});