// CORREGIDO: Le cambiamos el nombre a viviendaService
const viviendaService = require('../../services/vivienda/villaMarianaService');

const getBeneficiariosVillamariana = async (req, res) => {
  try {
    // 1. Le pedimos al servicio que haga el cruce espacial y tabular
    const beneficiariosGeoJSON = await viviendaService.obtenerViviendaGeoJSON();

    // 2. Respondemos al cliente con éxito y los datos en formato JSON
    res.status(200).json(beneficiariosGeoJSON);

  } catch (error) {
    // 3. Manejo de errores
    console.error("Error obteniendo beneficiarios de Villamariana:", error);
    res.status(500).json({ error: 'Error interno consultando los datos de vivienda' });
  }
};

module.exports = { 
  getBeneficiariosVillamariana 
};