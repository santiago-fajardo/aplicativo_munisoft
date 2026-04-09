// Importamos nuestro nuevo servicio especializado en el cruce de pagos
const pagos2025Service = require('./catastroPagos2025Service');

const getPrediosPagos2025 = async (req, res) => {
  try {
    // 1. Llamamos al servicio para que haga el trabajo pesado (unir el mapa con REPORTE_PAGOS_2025)
    const prediosPagosGeoJSON = await pagos2025Service.obtenerPrediosGeoJSON();

    // 2. Respondemos al cliente (React) con el mapa y los datos financieros listos
    res.status(200).json(prediosPagosGeoJSON);

  } catch (error) {
    // 3. Atrapamos el error para que el servidor no se caiga si algo falla en PostgreSQL
    console.error("Error obteniendo predios con reporte de pagos 2025:", error);
    res.status(500).json({ error: 'Error interno cruzando los pagos con el mapa catastral' });
  }
};

module.exports = { getPrediosPagos2025 };