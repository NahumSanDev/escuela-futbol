-- Tabla para registrar los clics/visitas de usuarios a cada aviso
CREATE TABLE IF NOT EXISTS avisos_clics (
    id SERIAL PRIMARY KEY,
    aviso_id INTEGER NOT NULL REFERENCES avisos(id) ON DELETE CASCADE,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (aviso_id, usuario_id)
);
