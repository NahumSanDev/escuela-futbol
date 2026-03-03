import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query(
      'SELECT u.*, f.nombre_jugador FROM usuarios u LEFT JOIN familias f ON u.id = f.usuario_id WHERE u.email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        nombre_jugador: user.nombre_jugador,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { codigo, nombre_padre, nombre_jugador, telefono, email, password } = req.body;

    const codigoResult = await query(
      'SELECT * FROM codigos_registro WHERE codigo = $1 AND usado = false',
      [codigo]
    );

    if (codigoResult.rows.length === 0) {
      return res.status(400).json({ error: 'Código de registro inválido o ya usado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await query(
      'INSERT INTO usuarios (email, password, nombre, telefono, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, hashedPassword, nombre_padre, telefono, 'padre']
    );

    const usuarioId = userResult.rows[0].id;

    await query(
      'INSERT INTO familias (usuario_id, nombre_jugador) VALUES ($1, $2)',
      [usuarioId, nombre_jugador]
    );

    await query(
      'UPDATE codigos_registro SET usado = true WHERE codigo = $1',
      [codigo]
    );

    const token = jwt.sign(
      { id: usuarioId, email, rol: 'padre' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: usuarioId,
        email,
        nombre: nombre_padre,
        nombre_jugador,
        rol: 'padre'
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT u.id, u.email, u.nombre, u.telefono, u.rol, f.nombre_jugador FROM usuarios u LEFT JOIN familias f ON u.id = f.usuario_id WHERE u.id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
