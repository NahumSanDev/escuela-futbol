# Plan de Modificaciones - CEFOR (Basado en COMENTARIOS PLATAFORMA.docx)

## 1. Pagos — Gestión de Pagos

| # | Solicitud | Estado |
|---|-----------|--------|
| 1.1 | Nuevos conceptos: Semana, Arbitraje, Uniforme, Torneo, Vacaciones, Otro (con entrada manual) | ✅ Completado |
| 1.2 | Bug: solo muestra 10 registros, el #11 desplaza al #1 | ✅ Completado |
| 1.3 | Bug Excel: solo exporta últimos 10 registros | ✅ Completado |

## 2. Partidos — Categorías y Resultados

| # | Solicitud | Estado |
|---|-----------|--------|
| 2.1 | Campo categoría: Sub 9, Sub 11, Sub 13 | ✅ Completado |
| 2.2 | Resultado en calendario + registro desde Partidos | ✅ Completado |

## 3. Registro/Login — Recuperación de Contraseña

| # | Solicitud | Estado |
|---|-----------|--------|
| 3.1 | Recuperar password para padres (con email) | ✅ Completado |

## 4. Calendario — Eventos y Actividades

| # | Solicitud | Estado |
|---|-----------|--------|
| 4.1 | Agregar eventos: cierre de ciclo, posada, día del niño, fin torneo, cumpleaños | ⏳ Pendiente |

## 5. FÉNIX MARKET — Categorías e Imágenes

| # | Solicitud | Estado |
|---|-----------|--------|
| 5.1 | Nuevas categorías: "Negocios" y "Bazar" | ⏳ Pendiente |
| 5.2 | Subir imágenes de productos | ⏳ Pendiente |

## 6. Notificaciones (Futuro)

| # | Solicitud | Estado |
|---|-----------|--------|
| 6.1 | Notificaciones a padres (in-app: bell + dropdown, auto-creación al registrar eventos/partidos/productos) | ✅ Completado |

## 7. Preguntas del Cliente

| # | Pregunta | Respuesta |
|---|----------|-----------|
| 7.1 | ¿Cuánto tiempo se almacena la información? | No hay límite definido. Se almacena permanentemente mientras no se elimine. |
| 7.2 | ¿Cuánto tiempo se almacenan comentarios y archivos? | Misma respuesta: permanentemente, mientras no se eliminen manualmente. |

## 8. Recibos / Nota de Venta (Nuevo)

| # | Solicitud | Estado |
|---|-----------|--------|
| 8.1 | Generar recibo/nota de venta descargable (imagen PNG o PDF) por pago | ✅ Completado |
| 8.2 | Campo categoría en pagos y recibo: PONY, SUB 9, SUB 11, SUB 13 | ✅ Completado |
| 8.3 | Logo CEFOR en el comprobante descargable | ✅ Completado |

> **Nota deploy**: la migración `backend/migrations/add_categoria_pagos.sql` debe ejecutarse en el SQL Editor de Railway antes de poder guardar la categoría.
