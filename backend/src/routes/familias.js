import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query('SELECT * FROM familias ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener familias' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM familias WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener familia' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nombre_jugador, usuario_id } = req.body;
    const result = await query(
      'INSERT INTO familias (nombre_jugador, usuario_id) VALUES ($1, $2) RETURNING *',
      [nombre_jugador, usuario_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear familia' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nombre_jugador } = req.body;
    const result = await query(
      'UPDATE familias SET nombre_jugador = $1 WHERE id = $2 RETURNING *',
      [nombre_jugador, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar familia' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await query('DELETE FROM familias WHERE id = $1', [req.params.id]);
    res.json({ message: 'Familia eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar familia' });
  }
});

export default router;
