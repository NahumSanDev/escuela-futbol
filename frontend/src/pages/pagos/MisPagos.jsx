import { useState, useEffect } from 'react';
import { FiDollarSign, FiFileText } from 'react-icons/fi';
import { pagosService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 whitespace-nowrap">Mis Pagos</h1>

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
