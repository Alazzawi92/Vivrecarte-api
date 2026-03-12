// db.js
import mysql from "mysql2/promise";
import { env } from "./env.js";

/**
 * Pool de connexions sécurisé pour MySQL
 * - waitForConnections : attend qu’une connexion soit disponible si le pool est full
 * - connectionLimit : nombre max de connexions simultanées
 * - namedPlaceholders : recommandé pour utiliser des requêtes préparées avec :name
 */
export const db = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 80,
  namedPlaceholders: true,
});

// Vérification de la connexion au démarrage
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("DB connection successful:", env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1); // Arrêt du serveur si DB non disponible
  }
})();