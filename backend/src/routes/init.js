import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const INIT_SQL = `
-- Tablas
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'padre')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS familias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_jugador VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS codigos_registro (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    usado BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pagos (
    id SERIAL PRIMARY KEY,
    jugador_id INTEGER REFERENCES familias(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    concepto VARCHAR(100) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

CREATE TABLE IF NOT EXISTS avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    archivo_url VARCHAR(500),
    publicado_por INTEGER REFERENCES usuarios(id),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Verificar si ya hay datos
SELECT COUNT(*) INTO @count FROM usuarios WHERE email = 'admin@cefor.com';
`;

router.post('/init', async (req, res) => {
  try {
    const statements = INIT_SQL.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
      }
    }

    // Insertar admin si no existe (password: 1234)
    const adminCheck = await query(
      "SELECT id FROM usuarios WHERE email = 'admin@cefor.com'"
    );

    if (adminCheck.rows.length === 0) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('1234', 10);
      
      await query(
        "INSERT INTO usuarios (email, password, nombre, telefono, rol) VALUES ($1, $2, $3, $4, $5)",
        ['admin@cefor.com', hashedPassword, 'Administrador', '+1234567890', 'admin']
      );
    }

    // Insertar códigos de ejemplo
    const codigosCheck = await query("SELECT COUNT(*) FROM codigos_registro");
    if (parseInt(codigosCheck.rows[0].count) === 0) {
      const codigos = ['FAMILIA2024', 'CEFOR001', 'CEFOR002', 'CEFOR003', 'CEFOR004'];
      for (const codigo of codigos) {
        await query("INSERT INTO codigos_registro (codigo) VALUES ($1)", [codigo]);
      }
    }

    // Insertar familias de ejemplo
    const familiasCheck = await query("SELECT COUNT(*) FROM familias");
    if (parseInt(familiasCheck.rows[0].count) === 0) {
      const jugadores = ['Juan Pérez', 'Carlos García', 'Miguel López', 'Pedro Martínez', 'Antonio Rodríguez'];
      for (const nombre of jugadores) {
        await query("INSERT INTO familias (nombre_jugador) VALUES ($1)", [nombre]);
      }
    }

    // Insertar pagos de ejemplo
    const pagosCheck = await query("SELECT COUNT(*) FROM pagos");
    if (parseInt(pagosCheck.rows[0].count) === 0) {
      await query("INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago) VALUES (1, '2026-03-01', 50.00, 'Mensualidad', 'Transferencia')");
      await query("INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago) VALUES (2, '2026-03-02', 35.00, 'Uniforme', 'Efectivo')");
      await query("INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago) VALUES (1, '2026-02-15', 50.00, 'Mensualidad', 'Bizum')");
      await query("INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago) VALUES (3, '2026-02-20', 25.00, 'Torneo', 'Tarjeta')");
    }

    // Insertar partidos
    const partidosCheck = await query("SELECT COUNT(*) FROM partidos");
    if (parseInt(partidosCheck.rows[0].count) === 0) {
      await query("INSERT INTO partidos (rival, fecha, hora, lugar, estado) VALUES ('Real Madrid', '2026-03-08', '10:00', 'Campo CEFOR', 'pendiente')");
      await query("INSERT INTO partidos (rival, fecha, hora, lugar, estado) VALUES ('FC Barcelona', '2026-03-15', '11:00', 'Campo Barcelona', 'pendiente')");
      await query("INSERT INTO partidos (rival, fecha, hora, lugar, estado, resultado_local, resultado_visitante) VALUES ('Atlético Madrid', '2026-03-01', '10:00', 'Campo CEFOR', 'jugado', 3, 1)");
      await query("INSERT INTO partidos (rival, fecha, hora, lugar, estado, resultado_local, resultado_visitante) VALUES ('Sevilla FC', '2026-02-22', '11:00', 'Campo Sevilla', 'jugado', 2, 2)");
    }

    // Insertar avisos
    const avisosCheck = await query("SELECT COUNT(*) FROM avisos");
    if (parseInt(avisosCheck.rows[0].count) === 0) {
      await query("INSERT INTO avisos (titulo, descripcion, publicado_por) VALUES ('Torneo Primavera 2026', 'Inscripciones abiertas para el torneo de primavera. Fecha límite: 15 de marzo.', 1)");
      await query("INSERT INTO avisos (titulo, descripcion, publicado_por) VALUES ('Uniformes Disponibles', 'Nuevos uniformes disponibles en la tienda.', 1)");
    }

    // Insertar productos
    const productosCheck = await query("SELECT COUNT(*) FROM productos");
    if (parseInt(productosCheck.rows[0].count) === 0) {
      await query("INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES ('Sudadera CEFOR', 'Sudadera con capucha oficial', 20.00, 'Uniformes')");
      await query("INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES ('Pantalón Deportivo', 'Pantalón oficial CEFOR', 18.00, 'Uniformes')");
      await query("INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES ('Chubasquero', 'Impermeable oficial', 25.00, 'Uniformes')");
      await query("INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES ('Equipación Júnior', 'Camiseta + shorts (tallas 8-14)', 35.00, 'Equipaciones')");
      await query("INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES ('Balón Match', 'Balón oficial de partido', 25.00, 'Balones')");
      await query("INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES ('Calcetines', 'Calcetines oficiales', 8.00, 'Complementos')");
    }

    res.json({ message: 'Base de datos inicializada correctamente' });
  } catch (err) {
    console.error('Error completo:', err);
    res.status(500).json({ error: 'Error al inicializar la base de datos', details: err.stack });
  }
});

export default router;
