// Importamos el servicio (el chef)
const prediosService = require('../../services/catastro/catastroService');

const getPredios = async (req, res) => {
  try {
    // 1. Llamamos al servicio para que haga el trabajo pesado
    const prediosGeoJSON = await prediosService.obtenerPrediosGeoJSON();

    // 2. Respondemos al cliente con éxito
    res.status(200).json(prediosGeoJSON);

  } catch (error) {
    // 3. Manejamos el error si algo falla en el servicio
    console.error("Error obteniendo predios espaciales:", error);
    res.status(500).json({ error: 'Error interno en el servidor geoespacial' });
  }
};

module.exports = { getPredios };