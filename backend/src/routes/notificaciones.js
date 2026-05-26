import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM notificaciones ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/:id/leer', authenticateToken, async (req, res) => {
  try {
    await query('UPDATE notificaciones SET leida = true WHERE id = $1', [req.params.id]);
    res.json({ message: 'Notificación marcada como leída' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/leer-todas', authenticateToken, async (req, res) => {
  try {
    await query('UPDATE notificaciones SET leida = true WHERE leida = false');
    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export async function crearNotificacion({ titulo, mensaje, tipo, referencia_tipo, referencia_id }) {
  try {
    await query(
      `INSERT INTO notificaciones (titulo, mensaje, tipo, referencia_tipo, referencia_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [titulo, mensaje, tipo || 'general', referencia_tipo, referencia_id]
    );
  } catch (err) {
    console.error('Error al crear notificación:', err);
  }
}

export default router;
