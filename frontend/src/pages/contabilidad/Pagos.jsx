import { useState, useEffect } from 'react';
import { FiPlus, FiDownload, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { pagosService, familiasService } from '../../services/api';
import * as XLSX from 'xlsx';

const CONCEPTOS = ['Mensualidad', 'Uniforme', 'Equipo', 'Torneo', 'Otro'];
const METODOS = ['Efectivo', 'Transferencia', 'Tarjeta', 'Bizum'];

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filtroJugador, setFiltroJugador] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;

  const [nuevoPago, setNuevoPago] = useState({
    jugador_id: '',
    fecha: '',
    monto: '',
    concepto: '',
    metodo_pago: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pagosData, familiasData] = await Promise.all([
        pagosService.getAll(),
        familiasService.getAll()
      ]);
      setPagos(pagosData.pagos || []);
      setFamilias(familiasData || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
    } catch (err) {
      return [];
    }
  };

  const pagosFiltrados = filtroJugador
    ? pagos.filter(p => p.jugador_id === parseInt(filtroJugador))
    : pagos;

  const totalPaginas = Math.ceil(pagosFiltrados.length / registrosPorPagina);
  const pagosPaginados = pagosFiltrados.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  const getJugadorNombre = (jugadorId) => {
    const familia = familias.find(f => f.id === jugadorId);
    return familia?.nombre_jugador || 'Desconocido';
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(pagosFiltrados.map(p => ({
      Jugador: getJugadorNombre(p.jugador_id),
      Fecha: p.fecha,
      Monto: p.monto,
      Concepto: p.concepto,
      Método: p.metodo_pago,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos');
    XLSX.writeFile(wb, 'pagos_cefor.xlsx');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await pagosService.create(nuevoPago);
      await fetchData();
      setShowModal(false);
      setNuevoPago({ jugador_id: '', fecha: '', monto: '', concepto: '', metodo_pago: '' });
    } catch (err) {
      alert('Error al guardar pago');
    }
  };

  const eliminarPago = async (id) => {
    if (confirm('¿Estás seguro de eliminar este pago?')) {
      try {
        await pagosService.delete(id);
        setPagos(pagos.filter(p => p.id !== id));
      } catch (err) {
        alert('Error al eliminar pago');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
        <div className="flex gap-2">
          <button
            onClick={exportarExcel}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiDownload size={18} />
            <span>Exportar Excel</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45] transition-colors"
          >
            <FiPlus size={18} />
            <span>Nuevo Pago</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Jugador</label>
            <select
              value={filtroJugador}
              onChange={(e) => { setFiltroJugador(e.target.value); setPaginaActual(1); }}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent"
            >
              <option value="">Todos los jugadores</option>
              {familias.map(j => (
                <option key={j.id} value={j.id}>{j.nombre_jugador}</option>
              ))}
            </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Jugador</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Monto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Concepto</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Método</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagosPaginados.map((pago) => (
                <tr key={pago.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{getJugadorNombre(pago.jugador_id)}</td>
                  <td className="px-4 py-3">{pago.fecha}</td>
                  <td className="px-4 py-3 font-medium">€{pago.monto}</td>
                  <td className="px-4 py-3">{pago.concepto}</td>
                  <td className="px-4 py-3">{pago.metodo}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => eliminarPago(pago.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jugador</label>
                <select
                  value={nuevoPago.jugador_id}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, jugador_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seleccionar jugador</option>
                  {familias.map(j => (
                    <option key={j.id} value={j.id}>{j.nombre_jugador}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={nuevoPago.fecha}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={nuevoPago.monto}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, monto: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
                <select
                  value={nuevoPago.concepto}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, concepto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seleccionar concepto</option>
                  {CONCEPTOS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                <select
                  value={nuevoPago.metodo_pago}
                  onChange={(e) => setNuevoPago({ ...nuevoPago, metodo_pago: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Seleccionar método</option>
                  {METODOS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
