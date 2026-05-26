import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { authenticateToken, JWT_SECRET } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await query(
      "SELECT u.*, f.nombre_jugador FROM usuarios u LEFT JOIN familias f ON u.id = f.usuario_id WHERE u.email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        nombre_jugador: user.nombre_jugador,
        rol: user.rol,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { codigo, nombre_padre, nombre_jugador, telefono, email, password } =
      req.body;

    // Validar código fijo: CEFOR + año en curso
    const currentYear = new Date().getFullYear();
    const codigoValido = `CEFOR${currentYear}`;

    if (codigo !== codigoValido) {
      return res.status(400).json({
        error: `Código de registro inválido. El código válido es: CEFOR${currentYear}`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userResult = await query(
      "INSERT INTO usuarios (email, password, nombre, telefono, rol) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [email, hashedPassword, nombre_padre, telefono, "padre"],
    );

    const usuarioId = userResult.rows[0].id;

    await query(
      "INSERT INTO familias (usuario_id, nombre_jugador) VALUES ($1, $2)",
      [usuarioId, nombre_jugador],
    );

    const token = jwt.sign({ id: usuarioId, email, rol: "padre" }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      token,
      user: {
        id: usuarioId,
        email,
        nombre: nombre_padre,
        nombre_jugador,
        rol: "padre",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const result = await query(
      "SELECT u.id, u.email, u.nombre, u.telefono, u.rol, f.nombre_jugador FROM usuarios u LEFT JOIN familias f ON u.id = f.usuario_id WHERE u.id = $1",
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const result = await query("SELECT id, email FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(200).json({ message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña" });
    }

    const user = result.rows[0];
    const resetToken = jwt.sign(
      { id: user.id, type: "reset" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`[RESET] Token para ${email}: ${resetToken}`);

    res.json({
      message: "Si el email existe, recibirás instrucciones para recuperar tu contraseña",
      resetToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    if (decoded.type !== "reset") {
      return res.status(400).json({ error: "Token inválido" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query("UPDATE usuarios SET password = $1 WHERE id = $2", [hashedPassword, decoded.id]);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

export default router;
