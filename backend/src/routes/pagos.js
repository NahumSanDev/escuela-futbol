import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { jugador_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const params = [];
    
    if (jugador_id) {
      params.push(jugador_id);
      whereClause = 'WHERE p.jugador_id = $1';
    }

    const countResult = await query(
      `SELECT COUNT(*) FROM pagos p ${whereClause}`,
      params
    );

    const result = await query(
      `SELECT p.*, f.nombre_jugador 
       FROM pagos p 
       LEFT JOIN familias f ON p.jugador_id = f.id 
       ${whereClause}
       ORDER BY p.fecha DESC 
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    res.json({
      pagos: result.rows,
      total: parseInt(countResult.rows[0].count),
      pagina: parseInt(page),
      totalPaginas: Math.ceil(countResult.rows[0].count / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { jugador_id, fecha, monto, concepto, metodo_pago } = req.body;

    const result = await query(
      `INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [jugador_id, fecha, monto, concepto, metodo_pago]
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
    const { fecha, monto, concepto, metodo_pago } = req.body;

    const result = await query(
      `UPDATE pagos SET fecha = $1, monto = $2, concepto = $3, metodo_pago = $4 
       WHERE id = $5 RETURNING *`,
      [fecha, monto, concepto, metodo_pago, id]
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
    await query('DELETE FROM pagos WHERE id = $1', [id]);
    res.json({ message: 'Pago eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/jugadores', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, nombre_jugador FROM familias ORDER BY nombre_jugador'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
