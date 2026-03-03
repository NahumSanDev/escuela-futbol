import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (categoria && categoria !== 'Todos') {
      params.push(categoria);
      whereClause = 'WHERE categoria = $1';
    }

    const result = await query(
      `SELECT * FROM productos ${whereClause} ORDER BY categoria, nombre`,
      params
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/categorias', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT categoria FROM productos ORDER BY categoria');
    res.json(result.rows.map(r => r.categoria));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, imagen_url } = req.body;

    const result = await query(
      `INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_url) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nombre, descripcion, precio, categoria, imagen_url]
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
    const { nombre, descripcion, precio, categoria, imagen_url, activo } = req.body;

    const result = await query(
      `UPDATE productos 
       SET nombre = $1, descripcion = $2, precio = $3, categoria = $4, imagen_url = $5, activo = $6
       WHERE id = $7 RETURNING *`,
      [nombre, descripcion, precio, categoria, imagen_url, activo, id]
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
    await query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
