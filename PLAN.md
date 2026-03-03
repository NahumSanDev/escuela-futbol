# Plan Detallado - CEFOR (Escuela de Fútbol)

## 1. Información del Proyecto

**Cliente:** CEFOR - Escuela de Fútbol
**Público objetivo:** Niños de 9 a 13 años
**Plataforma:** Web responsiva (PC y móvil)
**Hosting:** Vercel (frontend) + Railway (backend + DB)

---

## 2. Tech Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL (Railway) |
| Autenticación | JWT + códigos de registro |
| Hosting | Vercel + Railway |
| Excel | SheetJS (xlsx) |

---

## 3. Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **Admin** | Acceso total: contabilidad, pagos, partidos, avisos, market, gestión de usuarios |
| **Padre/Jugador** | Ver próximos partidos, resultados, avisos, market |

---

## 4. Módulos y Funcionalidades

### 4.1 Autenticación

**Login:**
- Usuario (código de familia o email)
- Password numérico (4-6 dígitos)

**Registro de familias:**
- Código de registro único generado por admin
- Formulario: nombre padre, nombre jugador, teléfono, email
- Password autogenerado o configurable

### 4.2 Contabilidad (Solo Admin)

**Registro de pagos:**
- Jugador (selección de lista)
- Fecha de pago
- Monto
- Concepto (lista configurable):
  - Mensualidad
  - Uniforme
  - Equipo
  - Torneo
  - Otro
- Método de pago:
  - Efectivo
  - Transferencia
  - Tarjeta
  - Bizum

**Historial de pagos:**
- Tabla con columnas: Jugador, Fecha, Monto, Concepto, Método, Acciones
- Filtro por jugador
- Paginación (10 registros por página)
- Exportar a Excel

### 4.3 Partidos

**Próximos partidos:**
- Fecha, hora, rivales, lugar
- Estado: Pendiente, Confirmado, Jugado

**Resultados:**
- Marcador, fecha, rival
- Ver detalle (opcional)

**Calendario:**
- Vista mensual de partidos

### 4.4 Avisos y Comunicación

**Envío de avisos:**
- Título
- Descripción
- Adjuntar PDF o imagen
- Destinatarios: todos o seleccionados

**Lista de avisos:**
- Vista de avisos para padres

### 4.5 Market (Catálogo)

**Catálogo de productos:**
- Imágenes, nombre, descripción, precio
- Categorías: Uniformes, Equipaciones, Complementos, Balones, Bolsas

**Pedidos (opcional):**
- Carrito de compras
- Lista de pedidos por familia

### 4.6 Perfil

**Admin:**
- Dashboard con resumen
- Gestión de usuarios
- Configuraciones

**Padre/Jugador:**
- Próximos partidos
- Resultados de juegos anteriores
- Avisos importantes
- Market

---

## 5. Estructura de Base de Datos

### Tablas

```
usuarios
- id
- email
- password (hash)
- rol (admin/padre)
- nombre_padre
- nombre_jugador
- telefono
- codigo_registro
- activo
- created_at

pagos
- id
- usuario_id
- fecha
- monto
- concepto
- metodo_pago
- created_at

partidos
- id
- fecha
- hora
- rival
- lugar
- resultado_local
- resultado_visitante
- estado (pendiente/jugado)
- created_at

avisos
- id
- titulo
- descripcion
- archivo_url
- publicado_por
- created_at

productos
- id
- nombre
- descripcion
- precio
- categoria
- imagen_url
- activo

codigos_registro
- codigo
- usado (boolean)
- created_at
```

---

## 6. Flujo de Usuario

### Admin:
1. Login → Dashboard
2. Gestionar pagos: Agregar/ver/exportar
3. Gestionar partidos: Agregar resultados
4. Gestionar avisos: Publicar
5. Gestionar productos: Agregar al market
6. Generar códigos de registro para familias

### Padre/Jugador:
1. Registro con código → Login
2. Ver próximos partidos
3. Ver resultados anteriores
4. Ver avisos
5. Ver Market

---

## 7. Diseño UI/UX

**Colores (referencia):**
- Verde CEFOR (#00A651 o similar)
- Blanco, gris claro

**Componentes:**
- Navbar responsivo
- Tarjetas para partidos/avisos
- Tablas con paginación
- Formularios limpios
- Mobile-first

---

## 8. Plan de Desarrollo (Fases)

### Fase 1: Fundamentos
- [ ] Inicializar proyecto React + Vite
- [ ] Configurar Tailwind CSS
- [ ] Configurar backend Express
- [ ] Configurar PostgreSQL en Railway
- [ ] Crear схему базы данных

### Fase 2: Autenticación
- [ ] Login admin
- [ ] Sistema de códigos de registro
- [ ] Registro de familias
- [ ] Login padre/jugador

### Fase 3: Contabilidad
- [ ] CRUD de pagos
- [ ] Historial con filtros y paginación
- [ ] Exportar a Excel

### Fase 4: Partidos
- [ ] CRUD de partidos
- [ ] Vista próximos partidos
- [ ] Vista resultados
- [ ] Calendario

### Fase 5: Comunicación
- [ ] CRUD de avisos
- [ ] Subir archivos (PDF/imágenes)
- [ ] Vista de avisos para padres

### Fase 6: Market
- [ ] Catálogo de productos
- [ ] Ver productos
- [ ] (Opcional) Carrito y pedidos

### Fase 7: Vistas padre
- [ ] Dashboard limitado
- [ ] Integrar todas las vistas de solo lectura

### Fase 8: Despliegue
- [ ] Deploy frontend en Vercel
- [ ] Deploy backend en Railway
- [ ] Configurar variables de entorno
- [ ] Testing final

---

## 9. Consideraciones Adicionales

- **Seguridad:** Hash de passwords, JWT, validación de inputs
- **Rendimiento:** Lazy loading, optimización de imágenes
- **UX:** Mensajes de éxito/error, loading states
- **Mantenimiento:** Código limpio, comentarios necesarios

---

## 10. Archivos de Referencia del Cliente

- `pantallaMuestra.png` - Mockup de referencia del cliente
- `Captura desde 2026-03-03 07-45-20.png` - DiseñoUI
- `Captura desde 2026-03-03 07-46-24.png` - DiseñoUI
- `informacion.xlsx` - Datos administrativos
- `INFORMACIÓN PARTIDOS.xlsx` - Datos de partidos
- `A_2.pdf` - Información adicional
- `catalogo.pdf` - Catálogo Fénix Market
