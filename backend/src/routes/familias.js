import express from "express";
import pool, { query } from "../config/db.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query(`
      SELECT f.id, f.nombre_jugador, f.usuario_id, f.created_at,
             u.email, u.nombre as nombre_padre, u.telefono, u.rol
      FROM familias f
      JOIN usuarios u ON f.usuario_id = u.id
      ORDER BY f.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener familias" });
  }
});

router.get("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await query("SELECT * FROM familias WHERE id = $1", [
      req.params.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener familia" });
  }
});

router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { nombre_jugador, usuario_id } = req.body;
    const result = await query(
      "INSERT INTO familias (nombre_jugador, usuario_id) VALUES ($1, $2) RETURNING *",
      [nombre_jugador, usuario_id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear familia" });
  }
});

router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { nombre_jugador, nombre_padre, email, telefono } = req.body;

  if (!nombre_jugador || !nombre_jugador.trim()) {
    return res
      .status(400)
      .json({ error: "El nombre del jugador es obligatorio" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const familia = await client.query(
      "SELECT id, usuario_id FROM familias WHERE id = $1",
      [req.params.id],
    );
    if (familia.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Familia no encontrada" });
    }

    const familiaResult = await client.query(
      "UPDATE familias SET nombre_jugador = $1 WHERE id = $2 RETURNING id, usuario_id, nombre_jugador, created_at",
      [nombre_jugador.trim(), req.params.id],
    );
    let familiaActualizada = familiaResult.rows[0];

    const { usuario_id } = familiaActualizada;
    if (
      usuario_id &&
      (nombre_padre !== undefined ||
        email !== undefined ||
        telefono !== undefined)
    ) {
      if (nombre_padre !== undefined && !nombre_padre.trim()) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: "El nombre del padre/tutor es obligatorio" });
      }
      if (email !== undefined && !email.trim()) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: "El email del padre/tutor es obligatorio" });
      }
      if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        await client.query("ROLLBACK");
        return res
          .status(400)
          .json({ error: "El email no tiene un formato válido" });
      }
      const usuarioResult = await client.query(
        `UPDATE usuarios
           SET nombre = COALESCE($1, nombre),
               email = COALESCE($2, email),
               telefono = COALESCE($3, telefono)
         WHERE id = $4
         RETURNING id, nombre, email, telefono`,
        [
          nombre_padre !== undefined ? nombre_padre.trim() : null,
          email !== undefined ? email.trim() : null,
          telefono !== undefined ? telefono.trim() : null,
          usuario_id,
        ],
      );
      familiaActualizada = {
        ...familiaActualizada,
        nombre_padre: usuarioResult.rows[0].nombre,
        email: usuarioResult.rows[0].email,
        telefono: usuarioResult.rows[0].telefono,
      };
    }

    await client.query("COMMIT");
    res.json(familiaActualizada);
  } catch (err) {
    await client.query("ROLLBACK");
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "Ya existe un usuario registrado con ese email" });
    }
    console.error(err);
    res.status(500).json({ error: "Error al actualizar familia" });
  } finally {
    client.release();
  }
});

router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    await query("DELETE FROM familias WHERE id = $1", [req.params.id]);
    res.json({ message: "Familia eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar familia" });
  }
});

export default router;
