// src/modules/planeacion/catastro/catastroPermissions.js

module.exports = {
    // Seguridad por defecto: Si un desarrollador crea una nueva ruta y olvida 
    // agregarla a 'excepciones', el sistema se cierra y solo deja entrar al admin.
    default: ['administrador'], 
    
    excepciones: {
        // Ruta 1: Mapa Catastral Básico
        // Accesible para el equipo de planeación y el administrador
        'GET /predios': ['planeacion', 'administrador'], 
        
        // Ruta 2: Mapa Catastral + Reporte Financiero 2025
        // Al ser datos financieros, agregamos también el rol de hacienda
        'GET /predios-pagos-2025': ['planeacion', 'hacienda', 'administrador']
    }
};