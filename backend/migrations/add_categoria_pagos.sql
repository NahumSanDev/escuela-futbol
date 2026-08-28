-- Agregar campo categoria a la tabla pagos (PONY, SUB 9, SUB 11, SUB 13)
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS categoria VARCHAR(20);