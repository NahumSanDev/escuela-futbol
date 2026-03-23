# CEFOR - Escuela de Fútbol

Sistema de gestión para escuela de fútbol CEFOR. Plataforma web para administración de pagos, partidos, avisos, market y comunicación con padres de familia.

## 🚀 Tech Stack

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 19 + Vite + Tailwind CSS 4 |
| **Backend** | Node.js + Express |
| **Base de Datos** | PostgreSQL (Railway) |
| **Autenticación** | JWT + bcryptjs |
| **Hosting** | Vercel (Frontend) + Railway (Backend) |

---

## 📁 Estructura del Proyecto

```
escuela-futbol/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración de DB
│   │   ├── controllers/    # Controladores (vacío)
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Modelos (vacío)
│   │   ├── routes/         # Rutas de la API
│   │   └── index.js        # Entry point
│   ├── migrations/         # Scripts SQL
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Páginas de la app
│   │   ├── services/       # Servicios API
│   │   ├── utils/          # Utilidades (formatters)
│   │   └── App.jsx
│   └── package.json
└── PLAN.md
```

---

## 🔧 Instalación Local

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

##  API Endpoints

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Iniciar sesión | ❌ |
| POST | `/register` | Registrar familia | ❌ |
| GET | `/me` | Obtener usuario actual | ✅ |

### Pagos (`/api/pagos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar pagos | ✅ Admin |
| POST | `/` | Crear pago | ✅ Admin |
| DELETE | `/:id` | Eliminar pago | ✅ Admin |

### Partidos (`/api/partidos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar todos | ✅ |
| GET | `/proximos` | Próximos partidos | ✅ |
| GET | `/resultados` | Resultados | ✅ |
| POST | `/` | Crear partido | ✅ Admin |
| PUT | `/:id` | Actualizar partido | ✅ Admin |
| DELETE | `/:id` | Eliminar partido | ✅ Admin |

### Avisos (`/api/avisos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar avisos | ✅ |
| POST | `/` | Crear aviso | ✅ Admin |
| DELETE | `/:id` | Eliminar aviso | ✅ Admin |

### Comentarios (`/api/comentarios`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/aviso/:avisoId` | Comentarios de un aviso | ✅ |
| POST | `/` | Crear comentario | ✅ |
| DELETE | `/:id` | Eliminar comentario | ✅ |

### Productos (`/api/productos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar productos | ✅ |
| POST | `/` | Crear producto | ✅ Admin |
| PUT | `/:id` | Actualizar producto | ✅ Admin |
| DELETE | `/:id` | Eliminar producto | ✅ Admin |

### Familias (`/api/familias`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Listar familias | ✅ Admin |
| DELETE | `/:id` | Eliminar familia | ✅ Admin |

---

## 🗄️ Base de Datos

### Tablas

**usuarios**
- `id`, `email`, `password`, `nombre`, `telefono`, `rol` (admin/padre), `activo`, `created_at`

**familias**
- `id`, `usuario_id`, `nombre_jugador`, `created_at`

**pagos**
- `id`, `jugador_id`, `fecha`, `monto`, `concepto`, `metodo_pago`, `created_at`

**partidos**
- `id`, `rival`, `fecha`, `hora`, `lugar`, `estado`, `resultado_local`, `resultado_visitante`, `created_at`

**avisos**
- `id`, `titulo`, `descripcion`, `archivo_url`, `publicado_por`, `fecha_publicacion`

**productos**
- `id`, `nombre`, `descripcion`, `precio`, `categoria`, `imagen_url`, `activo`, `created_at`

**comentarios**
- `id`, `aviso_id`, `usuario_id`, `mensaje`, `created_at`

---

## 🔐 Sistema de Registro

### Código de Registro

- **Formato**: `CEFOR` + año en curso
- **Ejemplo 2026**: `CEFOR2026`
- **Ejemplo 2027**: `CEFOR2027`

### Flujo de Registro

1. Admin comparte el código con el padre
2. Padre va a `/register`
3. Ingresa código + datos de la familia
4. Sistema valida código (frontend + backend)
5. Si es correcto → crea usuario + familia

### Cambiar Código por Año

El código se genera automáticamente:

```javascript
const currentYear = new Date().getFullYear();
const codigoRegistro = `CEFOR${currentYear}`;
```

**No requiere cambios manuales** - se actualiza cada 1 de enero.

---

## 🚀 Deploy

### Backend (Railway)

1. Conectar repo GitHub a Railway
2. Root Directory: `backend`
3. Agregar PostgreSQL
4. Variables de entorno:
   ```
   PORT=3000
   DATABASE_URL=<auto-generado por Railway>
   JWT_SECRET=tu_secret_key
   ```
5. Ejecutar migraciones en SQL Editor

### Frontend (Vercel)

1. Importar repo desde GitHub
2. Root Directory: `frontend`
3. Variable de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```
4. Deploy automático en cada push

---

## 👥 Roles

### Admin

- ✅ CRUD completo de pagos
- ✅ CRUD de partidos, avisos, productos
- ✅ Ver/eliminar familias registradas
- ✅ Eliminar comentarios
- ✅ Acceso a todas las rutas

### Padre/Jugador

- ✅ Ver próximos partidos, resultados, calendario
- ✅ Ver avisos y comentar
- ✅ Ver market
- ✅ Ver perfil
- ✅ Registrarse con código válido

---

## 🎨 Diseño

### Colores

- **Principal**: `#00A651` (verde CEFOR)
- **Fondo**: `bg-gray-50`
- **Texto**: `text-gray-800`, `text-gray-600`

### Componentes

- Navbar responsivo con menú móvil
- Tarjetas con shadow-md
- Tablas con paginación
- Modales para formularios
- Badges de estado

---

## 📝 Migraciones

### Ejecutar en Railway SQL Editor

```sql
-- Tabla comentarios (nuevo)
CREATE TABLE IF NOT EXISTS comentarios (
    id SERIAL PRIMARY KEY,
    aviso_id INTEGER REFERENCES avisos(id) ON DELETE CASCADE,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comentarios_aviso ON comentarios(aviso_id);
CREATE INDEX idx_comentarios_usuario ON comentarios(usuario_id);
```

### Limpiar datos de ejemplo

```sql
DELETE FROM productos;
DELETE FROM avisos;
DELETE FROM partidos;
DELETE FROM pagos;
DELETE FROM familias;
DELETE FROM usuarios;
```

---

## 🔑 Credenciales por Defecto

**NO HAY** credenciales por defecto en producción.

El primer usuario admin debe crearse manualmente en la DB:

```sql
-- Generar hash en https://bcrypt-generator.com/
INSERT INTO usuarios (email, password, nombre, telefono, rol)
VALUES ('admin@cefor.com', '$2a$10$...', 'Administrador', '+1234567890', 'admin');
```

---

## 📦 Scripts

### Backend

```bash
npm start    # Producción
npm run dev  # Desarrollo (watch)
```

### Frontend

```bash
npm run dev     # Desarrollo
npm run build   # Build producción
npm run preview # Preview build
npm run lint    # Linting
```

---

## 🛠️ Utilidades

### Formato de Moneda

```javascript
// $1500.00 (punto para decimales, sin miles)
formatCurrency(1500) // "$1500.00"
formatCurrency(25.5) // "$25.50"
```

### Formato de Fecha

```javascript
// 22/03/2026
formatDate("2026-03-22") // "22/03/2026"
```

---

## 📞 Soporte

Para issues o preguntas, contactar al desarrollador.

---

**Versión**: 1.0.0  
**Última actualización**: Marzo 2026
