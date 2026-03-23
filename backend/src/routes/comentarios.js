import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener comentarios de un aviso
router.get('/aviso/:avisoId', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, u.nombre as nombre_usuario, u.rol
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.aviso_id = $1
       ORDER BY c.created_at ASC`,
      [req.params.avisoId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
});

// Crear comentario
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { aviso_id, mensaje } = req.body;
    const usuario_id = req.user.id;

    const result = await query(
      `INSERT INTO comentarios (aviso_id, usuario_id, mensaje)
       VALUES ($1, $2, $3) RETURNING *`,
      [aviso_id, usuario_id, mensaje]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear comentario' });
  }
});

// Eliminar comentario (solo admin o el propio usuario)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si es admin o el dueño del comentario
    const commentCheck = await query(
      'SELECT usuario_id FROM comentarios WHERE id = $1',
      [id]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Comentario no encontrado' });
    }

    const esAdmin = req.user.rol === 'admin';
    const esDueño = commentCheck.rows[0].usuario_id === req.user.id;

    if (!esAdmin && !esDueño) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este comentario' });
    }

    await query('DELETE FROM comentarios WHERE id = $1', [id]);
    res.json({ message: 'Comentario eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
});

export default router;
