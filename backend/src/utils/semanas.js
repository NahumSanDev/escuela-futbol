export function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

/**
 * Semanas de un mes, ancladas al Sábado (los días de entrenamiento son Mar/Vie/Sáb).
 * Cada semana = [Mar, Vie, Sáb] con mar = sab - 4, vie = sab - 1.
 * @param {number} year
 * @param {number} month 1-12
 * @returns {Array<{semana: number, mar: string, vie: string, sab: string}>}
 */
export function semanasDelMes(year, month) {
  const out = [];
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  let num = 1;
  for (let d = 1; d <= days; d++) {
    const date = new Date(Date.UTC(year, month - 1, d));
    if (date.getUTCDay() === 6) {
      out.push({
        semana: num++,
        mar: toISODate(new Date(Date.UTC(year, month - 1, d - 4))),
        vie: toISODate(new Date(Date.UTC(year, month - 1, d - 1))),
        sab: toISODate(date),
      });
    }
  }
  return out;
}

/**
 * Calcula mes ('YYYY-MM') y semana (1-5) a la que pertenece una fecha,
 * usando el anclaje al Sábado más cercano (incluyendo el mismo día si es Sábado).
 * @param {string} fecha fecha en formato 'YYYY-MM-DD'
 * @returns {{mes: string, semana: number}}
 */
export function mesSemanaDeFecha(fecha) {
  const d = new Date(String(fecha).slice(0, 10) + 'T00:00:00Z');
  const add = (6 - d.getUTCDay() + 7) % 7;
  const sat = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + add));
  const year = sat.getUTCFullYear();
  const month = sat.getUTCMonth() + 1;
  const sats = semanasDelMes(year, month);
  const isoSat = toISODate(sat);
  const found = sats.find((s) => s.sab === isoSat) || sats[0];
  return {
    mes: `${year}-${String(month).padStart(2, '0')}`,
    semana: found ? found.semana : 1,
  };
}

export function fechaToISO(fecha) {
  if (!fecha) return null;
  return fecha instanceof Date ? fecha.toISOString().slice(0, 10) : String(fecha).slice(0, 10);
}