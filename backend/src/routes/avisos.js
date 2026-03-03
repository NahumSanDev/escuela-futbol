import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, u.nombre as publicado_por_nombre 
       FROM avisos a 
       LEFT JOIN usuarios u ON a.publicado_por = u.id 
       ORDER BY a.fecha_publicacion DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { titulo, descripcion, archivo_url } = req.body;

    const result = await query(
      `INSERT INTO avisos (titulo, descripcion, archivo_url, publicado_por) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, descripcion, archivo_url, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, archivo_url } = req.body;

    const result = await query(
      `UPDATE avisos SET titulo = $1, descripcion = $2, archivo_url = $3 WHERE id = $4 RETURNING *`,
      [titulo, descripcion, archivo_url, id]
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
    await query('DELETE FROM avisos WHERE id = $1', [id]);
    res.json({ message: 'Aviso eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
