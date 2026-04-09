// src/shared/middlewares/roles.js

const aplicarPermisos = (mapaModulo) => {
    return (req, res, next) => {
        // Validación de seguridad por si olvidaste poner el auth.js antes que este middleware
        if (!req.user || !req.user.rol) {
            return res.status(403).json({
                success: false,
                message: "Error de servidor: No se pudo verificar la identidad o el rol del usuario."
            });
        }

        // En Express, si un router está montado en /api/catastro, 
        // req.path aquí adentro será solo "/" o "/pagos-2025"
        const llave = `${req.method} ${req.path}`;

        // Buscamos si hay una regla específica para esta ruta, si no, usamos la regla por defecto del módulo
        const rolesPermitidos = mapaModulo.excepciones?.[llave] ?? mapaModulo.default;

        // Verificamos si el rol del usuario está dentro del arreglo de roles permitidos
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                message: `Acceso denegado a esta función. Se requiere uno de los siguientes perfiles: ${rolesPermitidos.join(', ')}`
            });
        }

        next(); // Tiene el rol correcto, continúa al controlador
    };
};

module.exports = { aplicarPermisos };