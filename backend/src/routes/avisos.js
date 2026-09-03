import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT a.*, u.nombre as publicado_por_nombre,
              COALESCE(clics.total_clics, 0) AS total_clics,
              COALESCE(clics.usuarios_clic, 0) AS usuarios_clic
       FROM avisos a 
       LEFT JOIN usuarios u ON a.publicado_por = u.id
       LEFT JOIN (
         SELECT aviso_id, COUNT(*) AS total_clics, COUNT(DISTINCT usuario_id) AS usuarios_clic
         FROM avisos_clics
         GROUP BY aviso_id
       ) clics ON clics.aviso_id = a.id
       ORDER BY a.fecha_publicacion DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/:id/clics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT c.id, c.created_at, u.id AS usuario_id, u.nombre, u.rol
       FROM avisos_clics c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.aviso_id = $1
       ORDER BY c.created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/:id/clic', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await query(
      `INSERT INTO avisos_clics (aviso_id, usuario_id)
       VALUES ($1, $2)
       ON CONFLICT (aviso_id, usuario_id) DO NOTHING`,
      [id, req.user.id]
    );
    res.json({ message: 'Clic registrado' });
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
