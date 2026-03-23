-- Limpieza de datos de ejemplo
-- Ejecutar en Railway para eliminar datos hardcodeados

-- Eliminar todos los datos de ejemplo
DELETE FROM productos;
DELETE FROM avisos;
DELETE FROM partidos;
DELETE FROM pagos;
DELETE FROM familias;
DELETE FROM usuarios;

-- Verificar que las tablas estén vacías
SELECT 'usuarios' as tabla, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'familias', COUNT(*) FROM familias
UNION ALL
SELECT 'pagos', COUNT(*) FROM pagos
UNION ALL
SELECT 'partidos', COUNT(*) FROM partidos
UNION ALL
SELECT 'avisos', COUNT(*) FROM avisos
UNION ALL
SELECT 'productos', COUNT(*) FROM productos;
