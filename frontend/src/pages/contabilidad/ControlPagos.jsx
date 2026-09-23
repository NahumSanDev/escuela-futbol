import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus, FiTrash2 } from 'react-icons/fi';
import { pagosService, familiasService } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { mesAnterior, mesSiguiente, mesActual, nombreMes, rangoSemana } from '../../utils/semanas';

const METODOS = ['Efectivo', 'Transferencia', 'Tarjeta', 'Bizum'];
const TIPOS = [
  { valor: 'colegiatura', etiqueta: 'Colegiatura' },
  { valor: 'arbitraje', etiqueta: 'Arbitraje' },
];

export default function ControlPagos() {
  const [mes, setMes] = useState(mesActual());
  const [data, setData] = useState(null);
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semanaActiva, setSemanaActiva] = useState(1);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([pagosService.getControl(mes), familiasService.getAll()])
      .then(([control, fam]) => {
        setData(control);
        setFamilias(fam || []);
        setSemanaActiva((prev) => {
          if (!control.semanas.some((s) => s.semana === prev)) {
            return control.semanas.length ? control.semanas[0].semana : 1;
          }
          return prev;
        });
      })
      .catch((err) => console.error('Error al cargar control de pagos', err))
      .finally(() => setLoading(false));
  }, [mes]);

  const cambiarMes = (dir) => setMes(dir === 'prev' ? mesAnterior(mes) : mesSiguiente(mes));

  const semanaInfo = data?.semanas.find((s) => s.semana === semanaActiva);
  const totalSemana = data?.totales?.[semanaActiva];

  const abrirModal = (opciones) => {
    const pagoExistente = opciones.jugador
      ? (opciones.jugador.pagos || []).find(
          (p) => p.tipo === opciones.tipo && p.semana === semanaActiva
        )
      : null;
    setModal({
      ...opciones,
      pagoExistente,
      monto: pagoExistente ? String(pagoExistente.monto) : '',
      fecha: pagoExistente ? pagoExistente.fecha : new Date().toISOString().slice(0, 10),
      metodo_pago: pagoExistente?.metodo_pago || 'Efectivo',
    });
  };

  const guardarPago = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const jugadorId = parseInt(f.get('jugador_id'), 10);
    const jugadorPadron = data?.jugadores.find((j) => j.jugador_id === jugadorId);
    const payload = {
      jugador_id: jugadorId,
      fecha: f.get('fecha'),
      monto: parseFloat(f.get('monto')),
      concepto: f.get('tipo') === 'colegiatura' ? `Semana ${semanaActiva}` : 'Arbitraje',
      metodo_pago: f.get('metodo_pago'),
      categoria: jugadorPadron?.categoria || '',
      mes,
      semana: semanaActiva,
      tipo: f.get('tipo'),
    };
    try {
      if (modal.pagoExistente) {
        await pagosService.update(modal.pagoExistente.id, payload);
      } else {
        await pagosService.create(payload);
      }
      setModal(null);
      const control = await pagosService.getControl(mes);
      setData(control);
    } catch (err) {
      alert('Error al guardar el pago');
    }
  };

  const eliminarPago = async () => {
    if (!modal?.pagoExistente) return;
    if (!confirm('¿Eliminar este pago?')) return;
    try {
      await pagosService.delete(modal.pagoExistente.id);
      setModal(null);
      const control = await pagosService.getControl(mes);
      setData(control);
    } catch (err) {
      alert('Error al eliminar el pago');
    }
  };

  const Celda = ({ jugador, tipo }) => {
    const valor = jugador.semanas[semanaActiva][tipo];
    const pagado = valor > 0;
    return (
      <td className="px-3 py-2">
        <button
          onClick={() => abrirModal({ jugador, tipo })}
          className={`w-full text-center rounded-md px-2 py-1 transition-colors ${
            pagado
              ? 'text-[#00A651] font-semibold hover:bg-green-50'
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title={pagado ? 'Editar pago' : `Registrar ${tipo}`}
        >
          {pagado ? formatCurrency(valor) : <span className="text-gray-300">+</span>}
        </button>
      </td>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Control de Pagos</h1>
          <p className="text-sm text-gray-500">Padrón semanal de colegiatura y arbitraje por jugador.</p>
        </div>
        <button
          onClick={() => abrirModal({ jugador: null, tipo: 'colegiatura' })}
          className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45] transition-colors"
        >
          <FiPlus size={18} />
          <span>Nuevo Pago</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => cambiarMes('prev')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              title="Mes anterior"
            >
              <FiChevronLeft size={18} />
            </button>
            <input
              type="month"
              value={mes}
              onChange={(e) => e.target.value && setMes(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-center font-semibold text-gray-800 uppercase"
            />
            <button
              onClick={() => cambiarMes('next')}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              title="Mes siguiente"
            >
              <FiChevronRight size={18} />
            </button>
            <span className="hidden sm:inline text-sm text-gray-400">{nombreMes(mes)}</span>
          </div>

          {data && (
            <div className="flex flex-wrap gap-2">
              {data.semanas.map((s) => (
                <button
                  key={s.semana}
                  onClick={() => setSemanaActiva(s.semana)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    semanaActiva === s.semana
                      ? 'bg-[#00A651] text-white border-[#00A651]'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-bold">Semana {s.semana}</span>
                  <span className="ml-2 text-xs opacity-80">{rangoSemana(s.mar, s.sab)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Cargando...</p>
        ) : !data ? (
          <p className="text-center text-gray-500 py-10">No se pudo cargar la información del mes.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <p className="text-sm text-orange-700 font-medium">Colegiatura cobrada</p>
                <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalSemana.colegiatura)}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-sm text-blue-700 font-medium">Arbitraje cobrado</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSemana.arbitraje)}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-green-700 font-medium">Jugadores pagados</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalSemana.pagados}{' '}
                  <span className="text-base font-medium text-green-500">de {totalSemana.pendientes + totalSemana.pagados}</span>
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-600 w-12">No.</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-600">Jugador</th>
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-600">Categoría</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">Colegiatura</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">Arbitraje</th>
                    <th className="px-3 py-3 text-center text-sm font-semibold text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.jugadores.map((jugador, idx) => {
                    const sc = jugador.semanas[semanaActiva].colegiatura;
                    const sa = jugador.semanas[semanaActiva].arbitraje;
                    const pagado = sc > 0 && sa > 0;
                    return (
                      <tr key={jugador.jugador_id} className={`border-t hover:bg-gray-50 ${!pagado ? 'text-gray-500' : ''}`}>
                        <td className="px-3 py-2 text-sm text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-2 font-medium">{jugador.nombre}</td>
                        <td className="px-3 py-2">
                          {jugador.categoria ? (
                            <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-[#00A651]">
                              {jugador.categoria}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        <Celda jugador={jugador} tipo="colegiatura" />
                        <Celda jugador={jugador} tipo="arbitraje" />
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                              pagado ? 'bg-green-100 text-[#00A651]' : 'bg-amber-100 text-amber-600'
                            }`}
                          >
                            {pagado ? 'PAGADO' : 'PENDIENTE'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-1">
              {modal.pagoExistente ? 'Editar Pago' : 'Registrar Pago'}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              {semanaInfo && `Semana ${semanaInfo.semana} · ${rangoSemana(semanaInfo.mar, semanaInfo.sab)}`}
            </p>
            <form onSubmit={guardarPago} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jugador</label>
                {modal.jugador ? (
                  <input
                    readOnly
                    value={modal.jugador.nombre}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                ) : (
                  <select name="jugador_id" className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                    <option value="">Seleccionar jugador</option>
                    {familias.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nombre_jugador}
                      </option>
                    ))}
                  </select>
                )}
                {modal.jugador && <input type="hidden" name="jugador_id" value={modal.jugador.jugador_id} />}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                {modal.jugador ? (
                  <div className="space-x-2">
                    {TIPOS.map((t) => (
                      <button
                        key={t.valor}
                        type="button"
                        onClick={() => setModal({ ...modal, tipo: t.valor })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                          modal.tipo === t.valor
                            ? 'bg-[#00A651] text-white border-[#00A651]'
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        {t.etiqueta}
                      </button>
                    ))}
                  </div>
                ) : (
                  <select
                    name="tipo"
                    defaultValue={modal.tipo}
                    onChange={(e) => setModal({ ...modal, tipo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    {TIPOS.map((t) => (
                      <option key={t.valor} value={t.valor}>
                        {t.etiqueta}
                      </option>
                    ))}
                  </select>
                )}
                {modal.jugador && <input type="hidden" name="tipo" value={modal.tipo} />}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($)</label>
                <input
                  name="monto"
                  type="number"
                  step="0.01"
                  value={modal.monto}
                  onChange={(e) => setModal({ ...modal, monto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  name="fecha"
                  type="date"
                  value={modal.fecha}
                  onChange={(e) => setModal({ ...modal, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                <select
                  name="metodo_pago"
                  value={modal.metodo_pago}
                  onChange={(e) => setModal({ ...modal, metodo_pago: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  {METODOS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                {modal.pagoExistente && (
                  <button
                    type="button"
                    onClick={eliminarPago}
                    className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                    title="Eliminar pago"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]">
                  {modal.pagoExistente ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}