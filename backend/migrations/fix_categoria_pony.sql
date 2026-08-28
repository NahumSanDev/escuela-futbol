-- Normalizar variantes de la categoría PONY en la tabla pagos
-- Solo reemplaza categorías que sean exactamente "poni" (insensible a mayúsculas, ignorando espacios)
UPDATE pagos
SET categoria = 'PONY'
WHERE regexp_replace(LOWER(categoria), '\s+', '', 'g') = 'poni';

-- Normalizar variantes de la categoría PONY en la tabla partidos
UPDATE partidos
SET categoria = 'PONY'
WHERE regexp_replace(LOWER(categoria), '\s+', '', 'g') = 'poni';
