import { useState, useEffect } from 'react';
import { FiDollarSign, FiFileText } from 'react-icons/fi';
import { pagosService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { obtenerSemanasMes, mesActual, rangoSemana } from '../../utils/semanas';
import ReciboPago from '../../components/ReciboPago';

export default function MisPagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reciboPago, setReciboPago] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const data = await pagosService.getMios();
        if (mounted) setPagos(data || []);
      } catch (err) {
        console.error('Error al cargar pagos', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const pagosSemana = pagos.filter((p) => p.tipo === 'colegiatura' || p.tipo === 'arbitraje');
  const mesesConTipo = [...new Set(pagosSemana.map((p) => p.mes).filter(Boolean))].sort();
  const estadoMes = mesesConTipo.length ? mesesConTipo[mesesConTipo.length - 1] : mesActual();
  const semanas = obtenerSemanasMes(estadoMes);

  const jugadores = [];
  const indexJugador = {};
  for (const p of pagosSemana) {
    const key = p.jugador_id;
    if (!(key in indexJugador)) {
      indexJugador[key] = { jugador_id: key, nombre: p.nombre_jugador || '—', categoria: p.categoria || '', semanas: {} };
      jugadores.push(indexJugador[key]);
    }
    const j = indexJugador[key];
    if (p.mes !== estadoMes || !p.semana) continue;
    if (!j.semanas[p.semana]) j.semanas[p.semana] = { colegiatura: 0, arbitraje: 0 };
    j.semanas[p.semana][p.tipo] += Number(p.monto) || 0;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Mis Pagos</h1>

      {jugadores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jugadores.map((j) => (
            <div key={j.jugador_id} className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{j.nombre}</h3>
                {j.categoria && (
                  <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-[#00A651]">
                    {j.categoria}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-3">
                Estado del mes: <span className="font-semibold text-gray-700 uppercase">{estadoMes}</span>
              </p>
              <div className="space-y-2">
                {semanas.map((s) => {
                  const d = j.semanas[s.semana] || { colegiatura: 0, arbitraje: 0 };
                  const pagado = d.colegiatura > 0 && d.arbitraje > 0;
                  return (
                    <div
                      key={s.semana}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                        pagado ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Semana {s.semana}</p>
                        <p className="text-xs text-gray-400">{rangoSemana(s.mar, s.sab)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-700">
                          Colegiatura: <span className="font-semibold">{formatCurrency(d.colegiatura)}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                          Arbitraje: <span className="font-semibold">{formatCurrency(d.arbitraje)}</span>
                        </p>
                      </div>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                          pagado ? 'bg-green-100 text-[#00A651]' : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        {pagado ? 'PAGADO' : 'PENDIENTE'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold mb-2">Historial de pagos</h3>
        <p className="text-sm text-gray-500 mb-4">Consulta aquí los pagos registrados de tu jugador. Descarga tu recibo en imagen o PDF.</p>

        {loading ? (
          <p className="text-center text-gray-500 py-8">Cargando...</p>
        ) : pagos.length === 0 ? (
          <p className="text-gray-500 text-sm py-8 text-center">Aún no registras pagos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Jugador</th>
                  <th className="pb-2 font-medium">Concepto</th>
                  <th className="pb-2 font-medium">Categoría</th>
                  <th className="pb-2 font-medium">Fecha</th>
                  <th className="pb-2 font-medium">Método</th>
                  <th className="pb-2 font-medium text-right">Monto</th>
                  <th className="pb-2 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((pago) => (
                  <tr key={pago.id} className="border-b last:border-b-0">
                    <td className="py-2.5">{pago.nombre_jugador || '—'}</td>
                    <td className="py-2.5">{pago.concepto}</td>
                    <td className="py-2.5">
                      {pago.categoria && (
                        <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-[#00A651]">
                          {pago.categoria}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5">{formatDate(pago.fecha)}</td>
                    <td className="py-2.5">{pago.metodo_pago || pago.metodo || '—'}</td>
                    <td className="py-2.5 font-semibold text-[#00A651] text-right">{formatCurrency(pago.monto)}</td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => setReciboPago(pago)}
                        title="Ver / descargar recibo"
                        className="flex items-center gap-1 text-[#00A651] hover:bg-green-50 rounded px-2 py-1 text-xs font-medium"
                      >
                        <FiFileText size={14} />
                        Recibo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {reciboPago && (
        <ReciboPago
          pago={reciboPago}
          nombreJugador={reciboPago.nombre_jugador}
          onClose={() => setReciboPago(null)}
        />
      )}
    </div>
  );
}