-- Nueva tabla de comentarios para avisos
-- Ejecutar en Railway SQL Editor

CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    aviso_id INTEGER REFERENCES avisos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_comentarios_aviso ON comentarios(aviso_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_usuario ON comentarios(usuario_id);
