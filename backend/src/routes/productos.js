import express from 'express';
import multer from 'multer';
import { Jimp } from 'jimp';
import { query } from '../config/db.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { crearNotificacion } from './notificaciones.js';

const router = express.Router();

const MAX_IMAGEN_MB = 5; // límite por archivo cargado (original)
const LIMITE_IMAGENES_MB = Number(process.env.LIMITE_IMAGENES_MB || 30); // límite total de imágenes de Market (30MB por defecto, acorde a plan base Railway)
const ANCHO_MAX = 800; // px máximo de ancho

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGEN_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const tipos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff'];
    if (!tipos.includes(file.mimetype)) {
      return cb(new Error('Formato de imagen no válido'));
    }
    cb(null, true);
  },
});

async function espacioImagenesUsado() {
  const result = await query(
    `SELECT COALESCE(SUM(LENGTH(imagen_url)), 0)::bigint AS bytes,
            COUNT(CASE WHEN imagen_url IS NOT NULL THEN 1 END)::int AS cantidad
     FROM productos`
  );
  return {
    bytes: Number(result.rows[0].bytes),
    cantidad: result.rows[0].cantidad,
    limiteBytes: LIMITE_IMAGENES_MB * 1024 * 1024,
    limiteMB: LIMITE_IMAGENES_MB,
  };
}

router.get('/espacio', authenticateToken, requireAdmin, async (req, res) => {
  try {
    res.json(await espacioImagenesUsado());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.post('/upload', authenticateToken, requireAdmin, upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ninguna imagen' });
    }

    const espacio = await espacioImagenesUsado();

    // Convertir a JPEG optimizado (pura JS, sin binarios nativos)
    const imagen = await Jimp.fromBuffer(req.file.buffer);
    if (imagen.bitmap.width > ANCHO_MAX) {
      imagen.resize({ w: ANCHO_MAX });
    }
    const bufferOptimizado = await imagen.getBuffer('image/jpeg', { quality: 75 });

    const nuevoBytes = bufferOptimizado.length;
    if (espacio.bytes + nuevoBytes > espacio.limiteBytes) {
      return res.status(400).json({
        error: `Límite de almacenamiento alcanzado (${espacio.limiteMB} MB). Libera espacio eliminando imágenes de productos.`,
        espacio,
      });
    }

    const dataUri = `data:image/jpeg;base64,${bufferOptimizado.toString('base64')}`;

    res.status(201).json({
      imagen_url: dataUri,
      bytes: nuevoBytes,
      espacio: { ...espacio, bytes: espacio.bytes + nuevoBytes },
    });
  } catch (err) {
    console.error(err);
    res.status(err.message === 'Formato de imagen no válido' ? 400 : 500).json({
      error: err.message === 'Formato de imagen no válido' ? err.message : 'Error al procesar la imagen',
    });
  }
});

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

    await crearNotificacion({
      titulo: 'Nuevo producto en Fénix Market',
      mensaje: `Se agregó "${nombre}" en la categoría ${categoria} con precio $${precio}`,
      tipo: 'producto',
      referencia_tipo: 'producto',
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
