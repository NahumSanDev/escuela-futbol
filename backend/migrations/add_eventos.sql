CREATE TABLE IF NOT EXISTS eventos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora VARCHAR(10),
    tipo VARCHAR(50) DEFAULT 'evento',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
