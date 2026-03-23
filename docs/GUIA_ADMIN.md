# 👨‍ Guía del Administrador

## Índice

1. [Primer Acceso](#primer-acceso)
2. [Dashboard](#dashboard)
3. [Gestionar Pagos](#gestionar-pagos)
4. [Gestionar Familias](#gestionar-familias)
5. [Gestionar Partidos](#gestionar-partidos)
6. [Publicar Avisos](#publicar-avisos)
7. [Market](#market)
8. [Código de Registro](#código-de-registro)

---

## Primer Acceso

1. Ve a la URL de la aplicación
2. Click en **"¿No tienes cuenta? Regístrate aquí"**
3. **NO uses el registro** - el registro es solo para padres
4. Contacta al desarrollador para que cree tu usuario admin en la DB

---

## Dashboard

El panel principal muestra:

- **Accesos rápidos** a Pagos, Market
- **Próximos partidos** (últimos 3)
- **Resultados recientes** (últimos 3)
- **Avisos publicados** (últimos 3)
- **Productos destacados** (solo para padres)

---

## Gestionar Pagos

### Crear Pago

1. Menú → **Pagos**
2. Click en **"Nuevo Pago"**
3. Llenar formulario:
   - **Jugador**: Seleccionar de la lista
   - **Fecha**: Día del pago
   - **Monto**: Cantidad (ej: 50.00)
   - **Concepto**: Mensualidad, Uniforme, Equipo, Torneo, Otro
   - **Método**: Efectivo, Transferencia, Tarjeta, Bizum
4. Click en **"Guardar"**

### Eliminar Pago

1. En la tabla de pagos
2. Click en ícono de **basura** (rojo)
3. Confirmar eliminación

### Exportar a Excel

1. Click en **"Exportar Excel"**
2. Se descarga archivo `.xlsx` con todos los pagos

---

## Gestionar Familias

### Ver Familias Registradas

1. Menú → **Familias**
2. Verás tabla con:
   - Nombre del jugador (niño)
   - Nombre del padre/tutor
   - Email
   - Teléfono
   - Fecha de registro

### Eliminar Familia

Si un registro fue incorrecto o duplicado:

1. En la tabla de familias
2. Click en **"Eliminar"** (fila correspondiente)
3. Confirmar: `¿Estás seguro de eliminar a "Nombre"?`
4. La familia y su usuario se eliminan permanentemente

### Código de Registro

Al final de la página verás:

> **Nota:** El código de registro para este año es **CEFOR2026**. Compártelo solo con los padres que quieras registrar.

**Importante:**
- ✅ El código cambia cada año automáticamente
- ✅ Solo los padres con el código correcto pueden registrarse
- ✅ No muestres el código públicamente

---

## Gestionar Partidos

### Crear Partido

1. Menú → **Partidos**
2. Click en **"Nuevo Partido"**
3. Llenar formulario:
   - **Rival**: Nombre del equipo contrario
   - **Fecha**: Día del partido
   - **Hora**: Hora del encuentro
   - **Lugar**: Campo o dirección
4. Click en **"Guardar"**

### Editar Partido

1. En la tarjeta del partido
2. Click en **"Editar"**
3. Modificar datos (incluyendo resultado si ya se jugó)
4. Click en **"Guardar"**

### Eliminar Partido

1. En la tarjeta del partido
2. Click en **"Eliminar"** (esquina inferior derecha)
3. Confirmar eliminación

### Estados del Partido

- **Pendiente**: Por jugar (se muestra en "Próximos")
- **Jugado**: Con resultado (se muestra en "Resultados")
- **Cancelado**: No se realizará

---

## Publicar Avisos

### Crear Aviso

1. Menú → **Avisos**
2. Click en **"Nuevo Aviso"**
3. Llenar formulario:
   - **Título**: Ej: "Torneo Primavera 2026"
   - **Descripción**: Detalles del aviso
   - **URL del archivo** (opcional): Link a PDF o imagen
4. Click en **"Publicar"**

### Adjuntar Archivos

Los archivos deben estar alojados externamente:

**Ejemplos:**
- `https://nagasasa.github.io/escuela-futbol/aviso.pdf`
- `https://i.imgur.com/abc123.png`

**Formatos soportados:**
- 📄 PDF
- 🖼️ JPG, PNG, GIF

### Comentarios en Avisos

Los padres pueden comentar en cada aviso:

1. Click en **"Ver comentarios (X)"**
2. Leer comentarios de los padres
3. Responder creando un nuevo comentario
4. Eliminar comentarios inapropiados (ícono de basura)

**Badge de Admin:** Tus comentarios muestran etiqueta verde "Admin"

---

## Market

### Agregar Producto

1. Menú → **Market**
2. Click en **"Nuevo Producto"**
3. Llenar formulario:
   - **Nombre**: Ej: "Sudadera CEFOR"
   - **Descripción**: Detalles del producto
   - **Precio**: Ej: 20.00
   - **Categoría**: Uniformes, Equipaciones, Complementos, Balones, Bolsas
   - **URL de imagen** (opcional)
4. Click en **"Guardar"**

### Categorías Sugeridas

- **Uniformes**: Sudaderas, pantalones, chubasqueros
- **Equipaciones**: Camiseta + shorts (Júnior/Senior)
- **Complementos**: Bragas, calcetines
- **Balones**: Balones de partido, packs
- **Bolsas**: Mochilas, bolsas de viaje

### Editar/Eliminar Producto

1. En la tarjeta del producto
2. Click en **"Editar"** o **"Eliminar"**
3. Confirmar cambios

---

## Código de Registro

### ¿Qué es?

Código anual que los padres necesitan para registrarse.

### Formato

```
CEFOR + AÑO_EN_CURSO
```

**Ejemplos:**
- 2026: `CEFOR2026`
- 2027: `CEFOR2027`
- 2028: `CEFOR2028`

### ¿Cómo compartirlo?

**✅ Correcto:**
- Email directo a padres interesados
- WhatsApp personal
- En persona durante inscripción

**❌ Incorrecto:**
- Publicar en redes sociales
- Enviar a listas de difusión grandes
- Compartir con personas no autorizadas

### Cambia Automáticamente

El sistema actualiza el código cada 1 de enero sin intervención manual.

---

## Consejos

### Pagos

- Registra pagos semanalmente para mantener contabilidad al día
- Exporta Excel a fin de mes para reportes
- Usa conceptos consistentes (no crear muchos "Otros")

### Avisos

- Publica avisos con al menos 3 días de anticipación
- Usa títulos claros y descriptivos
- Adjunta PDFs cuando haya información detallada

### Partidos

- Actualiza resultados inmediatamente después del partido
- Cancela partidos con clima adverso
- Verifica lugar y hora antes de publicar

### Familias

- Revisa semanalmente nuevos registros
- Elimina registros duplicados o incorrectos
- Verifica que los datos estén completos

---

## Soporte

¿Problemas o dudas? Contacta al desarrollador.

---

**Última actualización**: Marzo 2026
