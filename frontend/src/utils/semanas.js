export function fechaISO(d) {
  return d.toISOString().slice(0, 10);
}

export function obtenerSemanasMes(mes) {
  const [y, m] = mes.split('-').map(Number);
  const out = [];
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  let num = 1;
  for (let d = 1; d <= days; d++) {
    const date = new Date(Date.UTC(y, m - 1, d));
    if (date.getUTCDay() === 6) {
      out.push({
        semana: num++,
        mar: fechaISO(new Date(Date.UTC(y, m - 1, d - 4))),
        vie: fechaISO(new Date(Date.UTC(y, m - 1, d - 1))),
        sab: fechaISO(date),
      });
    }
  }
  return out;
}

export function mesActual() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function mesAnterior(mes) {
  const [y, m] = mes.split('-').map(Number);
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`;
}

export function mesSiguiente(mes) {
  const [y, m] = mes.split('-').map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
}

const NOMBRES_MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

export function nombreMes(mes) {
  const [y, m] = mes.split('-').map(Number);
  return `${NOMBRES_MESES[m - 1]} ${y}`;
}

export function rangoSemana(mar, sab) {
  const corto = (iso) => {
    const [, m, d] = iso.split('-').map(Number);
    return `${d} ${NOMBRES_MESES[m - 1].slice(0, 3)}`;
  };
  return `${corto(mar)} – ${corto(sab)}`;
}