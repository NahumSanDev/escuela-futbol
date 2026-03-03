-- Base de datos CEFOR - Estructura de tablas

-- Tabla de usuarios (admin y familias)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'padre')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de familias (jugadores)
CREATE TABLE familias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre_jugador VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de códigos de registro
CREATE TABLE codigos_registro (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    usado BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pagos
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    jugador_id INTEGER REFERENCES familias(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    concepto VARCHAR(100) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de partidos
CREATE TABLE partidos (
    id SERIAL PRIMARY KEY,
    rival VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    hora VARCHAR(10),
    lugar VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'jugado', 'cancelado')),
    resultado_local INTEGER,
    resultado_visitante INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de avisos
CREATE TABLE avisos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    archivo_url VARCHAR(500),
    publicado_por INTEGER REFERENCES usuarios(id),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos (market)
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto (password: 1234)
-- password hash: $2a$10$rQZQZQZQZQZQZQZQZQZQZ.QQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZ
-- Para usar: password = '1234'
INSERT INTO usuarios (email, password, nombre, telefono, rol)
VALUES ('admin@cefor.com', '$2a$10$X7K7K7K7K7K7K7K7K7K7KeO0K7K7K7K7K7K7K7K7K7K7K7K7K7K', 'Administrador', '+1234567890', 'admin');

-- Insertar códigos de ejemplo
INSERT INTO codigos_registro (codigo, usado) VALUES 
    ('FAMILIA2024', false),
    ('CEFOR001', false),
    ('CEFOR002', false),
    ('CEFOR003', false),
    ('CEFOR004', false);

-- Insertar familias de ejemplo
INSERT INTO familias (nombre_jugador) VALUES 
    ('Juan Pérez'),
    ('Carlos García'),
    ('Miguel López'),
    ('Pedro Martínez'),
    ('Antonio Rodríguez');

-- Insertar pagos de ejemplo
INSERT INTO pagos (jugador_id, fecha, monto, concepto, metodo_pago) VALUES 
    (1, '2026-03-01', 50.00, 'Mensualidad', 'Transferencia'),
    (2, '2026-03-02', 35.00, 'Uniforme', 'Efectivo'),
    (1, '2026-02-15', 50.00, 'Mensualidad', 'Bizum'),
    (3, '2026-02-20', 25.00, 'Torneo', 'Tarjeta');

-- Insertar partidos de ejemplo
INSERT INTO partidos (rival, fecha, hora, lugar, estado) VALUES 
    ('Real Madrid', '2026-03-08', '10:00', 'Campo CEFOR', 'pendiente'),
    ('FC Barcelona', '2026-03-15', '11:00', 'Campo Barcelona', 'pendiente'),
    ('Atlético Madrid', '2026-03-22', '09:30', 'Campo Vicente Calderón', 'pendiente'),
    ('Sevilla FC', '2026-03-29', '10:30', 'Campo CEFOR', 'pendiente');

-- Insertar resultados
INSERT INTO partidos (rival, fecha, hora, lugar, estado, resultado_local, resultado_visitante) VALUES 
    ('Atlético Madrid', '2026-03-01', '10:00', 'Campo CEFOR', 'jugado', 3, 1),
    ('Sevilla FC', '2026-02-22', '11:00', 'Campo Sevilla', 'jugado', 2, 2),
    ('Valencia CF', '2026-02-15', '10:00', 'Campo CEFOR', 'jugado', 1, 0),
    ('Villarreal', '2026-02-08', '09:30', 'Campo Villarreal', 'jugado', 4, 2);

-- Insertar avisos de ejemplo
INSERT INTO avisos (titulo, descripcion, publicado_por) VALUES 
    ('Torneo Primavera 2026', 'Inscripciones abiertas para el torneo de primavera. Fecha límite: 15 de marzo.', 1),
    ('Uniformes Disponibles', 'Nuevos uniformes disponibles en la tienda. Consulta tallas en secretaría.', 1),
    ('Partido contra Real Madrid', 'Recordatorio del partido este domingo. Hora de encuentro: 9:30.', 1),
    ('Cambio de Horario', 'A partir de abril, los entrenamientos serán de 17:00 a 18:30.', 1);

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria) VALUES 
    ('Sudadera CEFOR', 'Sudadera con capucha oficial', 20.00, 'Uniformes'),
    ('Pantalón Deportivo', 'Pantalón oficial CEFOR', 18.00, 'Uniformes'),
    ('Chubasquero', 'Impermeable oficial', 25.00, 'Uniformes'),
    ('Equipación Júnior', 'Camiseta + shorts (tallas 8-14)', 35.00, 'Equipaciones'),
    ('Equipación Senior', 'Camiseta + shorts (tallas S-XXL)', 40.00, 'Equipaciones'),
    ('Braga', 'Braga訓練', 6.00, 'Complementos'),
    ('Calcetines', 'Calcetines oficiales', 8.00, 'Complementos'),
    ('Balón Match', 'Balón oficial de partido', 25.00, 'Balones'),
    ('Balón Entrenamiento (x10)', 'Pack de 10 balones', 30.00, 'Balones'),
    ('Bolsa Viaje', 'Bolsa de viaje oficial', 18.00, 'Bolsas'),
    ('Mochila', 'Mochila escolar/deportiva', 15.00, 'Bolsas');
