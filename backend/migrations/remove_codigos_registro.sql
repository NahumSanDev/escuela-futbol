-- Migración: Eliminar tabla codigos_registro
-- Fecha: 2026-03-22
-- Descripción: Elimina la tabla de códigos de registro ya que ahora se usa un código fijo anual (CEFOR + año)

DROP TABLE IF EXISTS codigos_registro;
