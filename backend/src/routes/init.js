import express from "express";
import { query } from "../config/db.js";

const router = express.Router();

router.post("/init", async (req, res) => {
  try {
    // Tabla usuarios
    await query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        telefono VARCHAR(50),
        rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'padre')),
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla familias
    await query(`
      CREATE TABLE IF NOT EXISTS familias (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        nombre_jugador VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla pagos
    await query(`
      CREATE TABLE IF NOT EXISTS pagos (
        id SERIAL PRIMARY KEY,
        jugador_id INTEGER REFERENCES familias(id) ON DELETE CASCADE,
        fecha DATE NOT NULL,
        monto DECIMAL(10, 2) NOT NULL,
        concepto VARCHAR(100) NOT NULL,
        metodo_pago VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla partidos
    await query(`
      CREATE TABLE IF NOT EXISTS partidos (
        id SERIAL PRIMARY KEY,
        rival VARCHAR(255) NOT NULL,
        fecha DATE NOT NULL,
        hora VARCHAR(10),
        lugar VARCHAR(255),
        estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'jugado', 'cancelado')),
        resultado_local INTEGER,
        resultado_visitante INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla avisos
    await query(`
      CREATE TABLE IF NOT EXISTS avisos (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        archivo_url VARCHAR(500),
        publicado_por INTEGER REFERENCES usuarios(id),
        fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla productos
    await query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10, 2) NOT NULL,
        categoria VARCHAR(100) NOT NULL,
        imagen_url VARCHAR(500),
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({ message: "Base de datos inicializada correctamente" });
  } catch (err) {
    console.error("Error completo:", err);
    res.status(500).json({
      error: "Error al inicializar la base de datos",
      details: err.message,
    });
  }
});

export default router;
