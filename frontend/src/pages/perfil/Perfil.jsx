import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { partidosService, pagosService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/formatters';

export default function Perfil() {
  const { user, isAdmin } = useAuth();
  const [partidos, setPartidos] = useState([]);
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [partidosData, pagosData] = await Promise.all([
          partidosService.getAll(),
          pagosService.getMios(),
        ]);
        if (!mounted) return;
        setPartidos(partidosData || []);
        setPagos(pagosData || []);
      } catch (err) {
        console.error('Error al cargar datos', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const proximosPartidos = (partidos || [])
    .filter(p => p.estado !== 'jugado')
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const resultados = (partidos || [])
    .filter(p => p.estado === 'jugado' && p.resultado_local !== null)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-[#00A651] rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.nombre || 'Usuario'}</h2>
            <p className="text-gray-500 capitalize">{user?.rol || 'Usuario'}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-3">
            <FiMail className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email || 'No registrado'}</p>
            </div>
          </div>
          {user?.telefono && (
            <div className="flex items-center space-x-3">
              <FiPhone className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{user.telefono}</p>
              </div>
            </div>
          )}
          {user?.nombre_jugador && (
            <div className="flex items-center space-x-3">
              <FiUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Jugador</p>
                <p className="font-medium">{user.nombre_jugador}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isAdmin && (
        <>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiDollarSign className="mr-2" />
              Mis Pagos
            </h3>
            {pagos.length === 0 ? (
              <p className="text-gray-500 text-sm">Aún no registras pagos.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="pb-2 font-medium">Jugador</th>
                      <th className="pb-2 font-medium">Concepto</th>
                      <th className="pb-2 font-medium">Fecha</th>
                      <th className="pb-2 font-medium">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map((pago) => (
                      <tr key={pago.id} className="border-b last:border-b-0">
                        <td className="py-2">{pago.nombre_jugador || '—'}</td>
                        <td className="py-2">
                          {pago.concepto}
                          {pago.categoria && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-green-100 text-[#00A651]">
                              {pago.categoria}
                            </span>
                          )}
                        </td>
                        <td className="py-2">{formatDate(pago.fecha)}</td>
                        <td className="py-2 font-semibold text-[#00A651]">{formatCurrency(pago.monto)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiCalendar className="mr-2" />
              Próximos Partidos
            </h3>
            <div className="space-y-3">
              {proximosPartidos.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay partidos próximos.</p>
              ) : (
                proximosPartidos.map((partido) => (
                  <div key={partido.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">vs {partido.rival}</p>
                      <p className="text-sm text-gray-500">{formatDate(partido.fecha)} - {partido.hora || '—'}</p>
                    </div>
                    <span className="text-sm text-gray-500">{partido.lugar}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Resultados Recientes</h3>
            <div className="space-y-3">
              {resultados.length === 0 ? (
                <p className="text-gray-500 text-sm">Aún no hay resultados.</p>
              ) : (
                resultados.map((resultado) => (
                  <div key={resultado.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">vs {resultado.rival}</p>
                      <p className="text-sm text-gray-500">{formatDate(resultado.fecha)}</p>
                    </div>
                    <span className="text-lg font-bold text-[#00A651]">{resultado.resultado_local} - {resultado.resultado_visitante}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
