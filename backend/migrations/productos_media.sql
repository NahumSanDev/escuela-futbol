-- Migración: media de productos (market)
-- imagen_url era VARCHAR(500); las imágenes se guardan como data URI base64
-- (JPEG 800px optimizado) que supera con facilidad 500 caracteres, por lo que el
-- INSERT fallaba y la imagen no se guardaba. Se pasa a TEXT para que quepan.
-- Además se agrega pdf_url para adjuntar un PDF (ficha técnica, catálogo, etc.)

ALTER TABLE productos ALTER COLUMN imagen_url TYPE TEXT;
ALTER TABLE productos ADD COLUMN IF NOT EXISTS pdf_url TEXT;
