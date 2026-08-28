import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { jugador_id, page = 1, limit } = req.query;
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

    let queryText = `SELECT p.*, f.nombre_jugador 
       FROM pagos p 
       LEFT JOIN familias f ON p.jugador_id = f.id 
       ${whereClause}
       ORDER BY p.fecha DESC`;

    const queryParams = [...params];
    if (limit) {
      queryText += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
      queryParams.push(limit, offset);
    }

    const result = await query(queryText, queryParams);

    const total = parseInt(countResult.rows[0].count);
    res.json({
      pagos: result.rows,
      total,
      pagina: parseInt(page),
      totalPaginas: limit ? Math.ceil(total / limit) : 1
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { jugador_id, fecha, monto, concepto, metodo_pago, categoria } = req.body;

    const result = await query(
      `INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago, categoria) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [jugador_id, fecha, monto, concepto, metodo_pago, categoria]
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
    const { jugador_id, fecha, monto, concepto, metodo_pago, categoria } = req.body;

    const result = await query(
      `UPDATE pagos SET jugador_id = $1, fecha = $2, monto = $3, concepto = $4, metodo_pago = $5, categoria = $6 
       WHERE id = $7 RETURNING *`,
      [jugador_id, fecha, monto, concepto, metodo_pago, categoria, id]
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
