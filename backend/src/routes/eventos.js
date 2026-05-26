import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { crearNotificacion } from './notificaciones.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM eventos ORDER BY fecha ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora, tipo } = req.body;

    const result = await query(
      `INSERT INTO eventos (titulo, descripcion, fecha, hora, tipo)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, descripcion, fecha, hora, tipo || 'evento']
    );

    await crearNotificacion({
      titulo: 'Nuevo evento',
      mensaje: `Se agregó "${titulo}" para el ${fecha}${hora ? ` a las ${hora}` : ''}`,
      tipo: 'evento',
      referencia_tipo: 'evento',
      referencia_id: result.rows[0].id,
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha, hora, tipo } = req.body;

    const result = await query(
      `UPDATE eventos SET titulo = $1, descripcion = $2, fecha = $3, hora = $4, tipo = $5
       WHERE id = $6 RETURNING *`,
      [titulo, descripcion, fecha, hora, tipo, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM eventos WHERE id = $1', [id]);
    res.json({ message: 'Evento eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
