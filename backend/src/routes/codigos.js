import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM codigos_registro ORDER BY fecha_creacion DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { cantidad = 1 } = req.body;
    const codigos = [];
    const prefijo = 'CEFOR';

    for (let i = 0; i < cantidad; i++) {
      const numero = String(Math.floor(Math.random() * 900) + 100);
      codigos.push(`${prefijo}${numero}`);
    }

    for (const codigo of codigos) {
      await query(
        'INSERT INTO codigos_registro (codigo) VALUES ($1)',
        [codigo]
      );
    }

    const result = await query(
      'SELECT * FROM codigos_registro ORDER BY fecha_creacion DESC LIMIT $1',
      [cantidad]
    );

    res.status(201).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.delete('/:codigo', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { codigo } = req.params;
    await query('DELETE FROM codigos_registro WHERE codigo = $1', [codigo]);
    res.json({ message: 'Código eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
