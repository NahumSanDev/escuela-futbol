-- Control de Pagos: identificar semanas (ancladas al Sábado, días Mar/Vie/Sáb)
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS mes VARCHAR(7);
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS semana INTEGER;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS tipo VARCHAR(20);

-- Backfill colegiaturas: concepto "Semana N"
UPDATE pagos
SET tipo = 'colegiatura',
    mes = to_char(fecha, 'YYYY-MM'),
    semana = CAST(substring(concepto FROM 'Semana[\\s]+([0-9])') AS INTEGER)
WHERE concepto LIKE 'Semana %' AND tipo IS NULL;

-- Backfill arbitrajes: se resume desde POST /api/init/semanas (JS) porque la
-- semana depende del anclaje al Sábado (Mar = Sáb-4, Vie = Sáb-1).