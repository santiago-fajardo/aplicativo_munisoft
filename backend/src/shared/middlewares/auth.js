// src/shared/middlewares/auth.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Buscamos el token en los headers (Formato: "Bearer <token>")
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Acceso denegado. No se proporcionó un token de autenticación válido."
        });
    }

    // 2. Extraemos solo el token (quitamos la palabra "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verificamos el token usando nuestra llave secreta del .env
        // (Asegúrate de tener JWT_SECRET=tu_clave_super_segura en tu archivo .env)
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Inyectamos los datos decodificados en la request para que los siguientes pasos lo usen
        // Asumimos que al hacer login, guardaste { id: 1, rol: 'administrador' } en el token
        req.user = payload; 
        
        next(); // Todo está bien, pasamos al siguiente middleware o controlador
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Acceso denegado. El token es inválido o ha expirado."
        });
    }
};

module.exports = { verificarToken };