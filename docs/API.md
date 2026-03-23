# 📚 API Documentation

Base URL: `https://tu-backend.railway.app/api`

Todos los endpoints requieren autenticación JWT excepto `/auth/login` y `/auth/register`.

## Autenticación

### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

### Login

```http
POST /auth/login
```

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "nombre": "Juan Pérez",
    "nombre_jugador": "Carlos Pérez",
    "rol": "padre"
  }
}
```

### Register

```http
POST /auth/register
```

**Request:**
```json
{
  "codigo": "CEFOR2026",
  "nombre_padre": "Juan Pérez",
  "nombre_jugador": "Carlos Pérez",
  "telefono": "+34612345678",
  "email": "juan@ejemplo.com",
  "password": "1234"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "email": "juan@ejemplo.com",
    "nombre": "Juan Pérez",
    "nombre_jugador": "Carlos Pérez",
    "rol": "padre"
  }
}
```

### Get Current User

```http
GET /auth/me
```

**Response (200):**
```json
{
  "id": 1,
  "email": "admin@cefor.com",
  "nombre": "Administrador",
  "telefono": "+34612345678",
  "rol": "admin",
  "nombre_jugador": null
}
```

---

## Pagos

### Listar Pagos

```http
GET /pagos
```

**Response (200):**
```json
[
  {
    "id": 1,
    "jugador_id": 1,
    "fecha": "2026-03-01",
    "monto": "50.00",
    "concepto": "Mensualidad",
    "metodo_pago": "Transferencia",
    "created_at": "2026-03-01T10:00:00Z"
  }
]
```

### Crear Pago

```http
POST /pagos
```

**Request:**
```json
{
  "jugador_id": 1,
  "fecha": "2026-03-15",
  "monto": "50.00",
  "concepto": "Mensualidad",
  "metodo_pago": "Bizum"
}
```

**Response (201):**
```json
{
  "id": 2,
  "jugador_id": 1,
  "fecha": "2026-03-15",
  "monto": "50.00",
  "concepto": "Mensualidad",
  "metodo_pago": "Bizum",
  "created_at": "2026-03-15T10:00:00Z"
}
```

### Eliminar Pago

```http
DELETE /pagos/:id
```

**Response (200):**
```json
{
  "message": "Pago eliminado"
}
```

---

## Partidos

### Listar Todos

```http
GET /partidos
```

### Próximos Partidos

```http
GET /partidos/proximos
```

### Resultados

```http
GET /partidos/resultados
```

**Response (200):**
```json
[
  {
    "id": 1,
    "rival": "Real Madrid",
    "fecha": "2026-03-08",
    "hora": "10:00",
    "lugar": "Campo CEFOR",
    "estado": "pendiente",
    "resultado_local": null,
    "resultado_visitante": null
  }
]
```

### Crear Partido

```http
POST /partidos
```

**Request:**
```json
{
  "rival": "Real Madrid",
  "fecha": "2026-03-08",
  "hora": "10:00",
  "lugar": "Campo CEFOR",
  "estado": "pendiente"
}
```

### Actualizar Partido

```http
PUT /partidos/:id
```

**Request:**
```json
{
  "rival": "Real Madrid",
  "fecha": "2026-03-08",
  "hora": "10:00",
  "lugar": "Campo CEFOR",
  "estado": "jugado",
  "resultado_local": 3,
  "resultado_visitante": 1
}
```

### Eliminar Partido

```http
DELETE /partidos/:id
```

---

## Avisos

### Listar Avisos

```http
GET /avisos
```

**Response (200):**
```json
[
  {
    "id": 1,
    "titulo": "Torneo Primavera 2026",
    "descripcion": "Inscripciones abiertas...",
    "archivo_url": "https://ejemplo.com/torneo.pdf",
    "publicado_por": 1,
    "fecha_publicacion": "2026-03-01T10:00:00Z"
  }
]
```

### Crear Aviso

```http
POST /avisos
```

**Request:**
```json
{
  "titulo": "Torneo Primavera 2026",
  "descripcion": "Inscripciones abiertas hasta el 15 de marzo",
  "archivo_url": "https://ejemplo.com/torneo.pdf"
}
```

### Eliminar Aviso

```http
DELETE /avisos/:id
```

---

## Comentarios

### Listar Comentarios de un Aviso

```http
GET /comentarios/aviso/:avisoId
```

**Response (200):**
```json
[
  {
    "id": 1,
    "aviso_id": 1,
    "usuario_id": 5,
    "mensaje": "¿A qué hora es el torneo?",
    "nombre_usuario": "Juan Pérez",
    "rol": "padre",
    "created_at": "2026-03-01T12:00:00Z"
  }
]
```

### Crear Comentario

```http
POST /comentarios
```

**Request:**
```json
{
  "aviso_id": 1,
  "mensaje": "¿Mi hijo debe llevar uniforme completo?"
}
```

**Response (201):**
```json
{
  "id": 2,
  "aviso_id": 1,
  "usuario_id": 5,
  "mensaje": "¿Mi hijo debe llevar uniforme completo?",
  "created_at": "2026-03-01T12:30:00Z"
}
```

### Eliminar Comentario

```http
DELETE /comentarios/:id
```

---

## Productos

### Listar Productos

```http
GET /productos
```

**Response (200):**
```json
[
  {
    "id": 1,
    "nombre": "Sudadera CEFOR",
    "descripcion": "Sudadera con capucha oficial",
    "precio": "20.00",
    "categoria": "Uniformes",
    "imagen_url": "https://ejemplo.com/sudadera.jpg",
    "activo": true,
    "created_at": "2026-03-01T10:00:00Z"
  }
]
```

### Crear Producto

```http
POST /productos
```

**Request:**
```json
{
  "nombre": "Sudadera CEFOR",
  "descripcion": "Sudadera con capucha oficial",
  "precio": "20.00",
  "categoria": "Uniformes",
  "imagen_url": "https://ejemplo.com/sudadera.jpg"
}
```

### Actualizar Producto

```http
PUT /productos/:id
```

**Request:**
```json
{
  "nombre": "Sudadera CEFOR 2026",
  "descripcion": "Nueva versión 2026",
  "precio": "25.00",
  "categoria": "Uniformes",
  "activo": true
}
```

### Eliminar Producto

```http
DELETE /productos/:id
```

---

## Familias

### Listar Familias

```http
GET /familias
```

**Requiere:** Admin

**Response (200):**
```json
[
  {
    "id": 1,
    "nombre_jugador": "Carlos Pérez",
    "usuario_id": 5,
    "email": "juan@ejemplo.com",
    "nombre_padre": "Juan Pérez",
    "telefono": "+34612345678",
    "rol": "padre",
    "created_at": "2026-03-01T10:00:00Z"
  }
]
```

### Eliminar Familia

```http
DELETE /familias/:id
```

**Requiere:** Admin

---

## Códigos de Error

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (token inválido) |
| 403 | Forbidden (no tiene permiso) |
| 404 | Not Found |
| 500 | Internal Server Error |

## Ejemplo de Error

```json
{
  "error": "Credenciales inválidas"
}
```

---

## Rate Limiting

Actualmente no hay rate limiting implementado.

---

**Versión API**: 1.0  
**Última actualización**: Marzo 2026
