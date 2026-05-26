import express from 'express';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { crearNotificacion } from './notificaciones.js';

const router = express.Router();

router.get('/proximos', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM partidos 
       WHERE fecha >= CURRENT_DATE 
       ORDER BY fecha ASC, hora ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/resultados', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM partidos 
       WHERE resultado_local IS NOT NULL 
       ORDER BY fecha DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT * FROM partidos ORDER BY fecha DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rival, fecha, hora, lugar, estado, categoria } = req.body;

    const result = await query(
      `INSERT INTO partidos (rival, fecha, hora, lugar, estado, categoria) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [rival, fecha, hora, lugar, estado || 'pendiente', categoria || 'Sub 11']
    );

    await crearNotificacion({
      titulo: 'Nuevo partido',
      mensaje: `Partido vs ${rival} (${categoria || 'Sub 11'}) agendado para el ${fecha}${hora ? ` a las ${hora}` : ''}`,
      tipo: 'partido',
      referencia_tipo: 'partido',
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
    const { rival, fecha, hora, lugar, estado, resultado_local, resultado_visitante, categoria } = req.body;

    const result = await query(
      `UPDATE partidos 
       SET rival = $1, fecha = $2, hora = $3, lugar = $4, estado = $5, 
           resultado_local = $6, resultado_visitante = $7, categoria = $8
       WHERE id = $9 RETURNING *`,
      [rival, fecha, hora, lugar, estado, resultado_local, resultado_visitante, categoria, id]
    );

    if (estado === 'jugado' && result.rows[0]) {
      const p = result.rows[0];
      await crearNotificacion({
        titulo: 'Resultado registrado',
        mensaje: `Partido vs ${p.rival}: ${p.resultado_local} - ${p.resultado_visitante} (${p.categoria || 'Sub 11'})`,
        tipo: 'resultado',
        referencia_tipo: 'partido',
        referencia_id: id,
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM partidos WHERE id = $1', [id]);
    res.json({ message: 'Partido eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

export default router;
