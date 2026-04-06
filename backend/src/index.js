// Archivo: src/index.js
const express = require('express');
const cors = require('cors');


const apiRoutes = require('./routes/routes');

const app = express();
app.use(cors()); 

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API Geoespacial de MuniSoft corriendo en puerto ${PORT}`);
});