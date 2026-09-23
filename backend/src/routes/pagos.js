import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { semanasDelMes } from '../utils/semanas.js';

const router = express.Router();

const TIPOS = ['colegiatura', 'arbitraje'];
const ORDEN_CATEGORIAS = ['PONY', 'SUB 9', 'SUB 11', 'SUB 13'];

// Padrón de pagos por mes (control): semanas + jugadores + totales por semana
router.get('/control', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { mes } = req.query;
    if (!mes || !/^\d{4}-\d{2}$/.test(mes)) {
      return res.status(400).json({ error: 'Mes inválido (YYYY-MM)' });
    }
    const [year, month] = mes.split('-').map(Number);
    const semanas = semanasDelMes(year, month);

    const familiasResult = await query(
      'SELECT id, nombre_jugador FROM familias ORDER BY nombre_jugador'
    );

    const catResult = await query(
      `SELECT DISTINCT ON (p.jugador_id) p.jugador_id, p.categoria
       FROM pagos p
       WHERE p.categoria IS NOT NULL AND p.categoria <> ''
       ORDER BY p.jugador_id, p.fecha DESC NULLS LAST, p.id DESC`
    );
    const categoriaPorJugador = new Map(catResult.rows.map(r => [r.jugador_id, r.categoria]));

    const pagosResult = await query(
      `SELECT p.id, p.jugador_id, p.semana, p.tipo, p.monto,
              to_char(p.fecha, 'YYYY-MM-DD') AS fecha, p.metodo_pago, p.concepto
       FROM pagos p
       WHERE p.mes = $1 AND p.tipo IN ('colegiatura', 'arbitraje')
       ORDER BY p.id`,
      [mes]
    );

    const jugadores = familiasResult.rows.map(f => {
      const semanasData = {};
      const pagosJugador = [];
      for (const semana of semanas) {
        semanasData[semana.semana] = { colegiatura: 0, arbitraje: 0 };
      }
      return {
        jugador_id: f.id,
        nombre: f.nombre_jugador,
        categoria: categoriaPorJugador.get(f.id) || null,
        semanas: semanasData,
        pagos: pagosJugador,
      };
    });

    const indexPorJugador = new Map(jugadores.map(j => [j.jugador_id, j]));

    for (const p of pagosResult.rows) {
      const jugador = indexPorJugador.get(p.jugador_id);
      if (!jugador) continue;
      if (p.semana && jugador.semanas[p.semana]) {
        jugador.semanas[p.semana][p.tipo] += Number(p.monto) || 0;
      }
      jugador.pagos.push({
        id: p.id,
        tipo: p.tipo,
        semana: p.semana,
        monto: Number(p.monto),
        fecha: p.fecha,
        metodo_pago: p.metodo_pago,
        concepto: p.concepto,
      });
    }

    // Totales por semana
    const totales = {};
    for (const semana of semanas) {
      const sem = semana.semana;
      let colegiatura = 0;
      let arbitraje = 0;
      let pagados = 0;
      let pendientes = 0;
      for (const j of jugadores) {
        const sc = j.semanas[sem].colegiatura;
        const sa = j.semanas[sem].arbitraje;
        colegiatura += sc;
        arbitraje += sa;
        if (sc > 0 && sa > 0) pagados++;
        else pendientes++;
      }
      totales[sem] = { colegiatura, arbitraje, pagados, pendientes };
    }

    // Ordenar jugadores por categoría (PONY, SUB 9, SUB 11, SUB 13) y luego por nombre
    jugadores.sort((a, b) => {
      const ca = ORDEN_CATEGORIAS.indexOf(a.categoria);
      const cb = ORDEN_CATEGORIAS.indexOf(b.categoria);
      if (ca !== cb) return (ca === -1 ? 99 : ca) - (cb === -1 ? 99 : cb);
      return a.nombre.localeCompare(b.nombre, 'es');
    });

    res.json({ mes, semanas, jugadores, totales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

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

    let queryText = `SELECT p.id, p.jugador_id, to_char(p.fecha, 'YYYY-MM-DD') AS fecha, p.monto, p.concepto, p.metodo_pago, p.categoria, p.mes, p.semana, p.tipo, p.created_at, f.nombre_jugador 
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

router.get('/mios', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT p.id, p.jugador_id, to_char(p.fecha, 'YYYY-MM-DD') AS fecha, p.monto, p.concepto, p.metodo_pago, p.categoria, p.mes, p.semana, p.tipo, p.created_at, f.nombre_jugador
       FROM pagos p
       JOIN familias f ON p.jugador_id = f.id
       WHERE f.usuario_id = $1
       ORDER BY p.fecha DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { jugador_id, fecha, monto, concepto, metodo_pago, categoria, mes, semana, tipo } = req.body;

    const tipofinal = TIPOS.includes(tipo) ? tipo : null;

    const result = await query(
      `INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago, categoria, mes, semana, tipo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [jugador_id, fecha, monto, concepto, metodo_pago, categoria, mes || null, semana || null, tipofinal]
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
    const { jugador_id, fecha, monto, concepto, metodo_pago, categoria, mes, semana, tipo } = req.body;

    const tipofinal = TIPOS.includes(tipo) ? tipo : null;

    const result = await query(
      `UPDATE pagos SET jugador_id = $1, fecha = $2, monto = $3, concepto = $4, metodo_pago = $5, categoria = $6, mes = $7, semana = $8, tipo = $9
       WHERE id = $10 RETURNING *`,
      [jugador_id, fecha, monto, concepto, metodo_pago, categoria, mes || null, semana || null, tipofinal, id]
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
