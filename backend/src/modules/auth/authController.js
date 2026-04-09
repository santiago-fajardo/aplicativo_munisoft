const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { usuario, password } = req.body;

    // SIMULACIÓN DE BASE DE DATOS
    let rolAsignado = null;

    if (usuario === 'admin' && password === '1234') {
        rolAsignado = 'administrador';
    } else if (usuario === 'planeacion' && password === '1234') {
        rolAsignado = 'planeacion';
    } else if (usuario === 'cajero' && password === '1234') {
        rolAsignado = 'cajero';
    }

    // Validar si las credenciales fueron correctas
    if (!rolAsignado) {
        return res.status(401).json({
            success: false,
            message: "Credenciales inválidas"
        });
    }

    // Si es correcto, creamos el "pasaporte" (Token JWT)
    const payload = {
        usuario: usuario,
        rol: rolAsignado
    };

    // Firmamos el token con la llave secreta de tu .env. Expira en 2 horas.
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    return res.status(200).json({
        success: true,
        message: `Bienvenido, has iniciado sesión como ${rolAsignado}`,
        token: token
    });
};

module.exports = { login };