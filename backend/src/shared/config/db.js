const { Pool } = require('pg');
require('dotenv').config();

// --- DIAGNÓSTICO (Borrar después si quieres) ---
if (!process.env.DB_PASS) {
  console.error("❌ ERROR CRÍTICO: No se encontró la contraseña en el archivo .env");
  console.error("   Asegúrate de que el archivo .env esté en la carpeta raíz 'backend'");
  process.exit(1); // Detiene la app para que no explote después
}
// ----------------------------------------------

const pool = new Pool({
  user: process.env.DB_USER,      
  host: process.env.DB_HOST,      
  database: process.env.DB_NAME,  
  password: process.env.DB_PASS,  
  port: process.env.DB_PORT,      
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};