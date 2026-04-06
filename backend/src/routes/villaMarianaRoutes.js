const { Router } = require('express');
const router = Router();

// Importamos el controlador
const { getBeneficiariosVillamariana } = require('../controllers/vivienda/villaMarianaController');

// Definimos la ruta. 
// Como en el índice general le pondremos el prefijo '/vivienda', 
// esta ruta final será: GET /api/vivienda/villamariana
router.get('/villamariana', getBeneficiariosVillamariana);

module.exports = router;