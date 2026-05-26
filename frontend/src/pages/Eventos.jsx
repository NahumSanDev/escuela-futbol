import { useState, useEffect } from "react";
import { FiPlus, FiX, FiTrash2, FiCalendar, FiClock } from "react-icons/fi";
import { eventosService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/formatters";

const TIPOS = ["evento", "torneo", "cumpleaños", "cierre", "festejo"];

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    tipo: "evento",
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const data = await eventosService.getAll();
      setEventos(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventosService.create(nuevoEvento);
      await fetchData();
      setShowModal(false);
      setNuevoEvento({ titulo: "", descripcion: "", fecha: "", hora: "", tipo: "evento" });
    } catch (err) {
      alert("Error al crear evento");
    }
  };

  const eliminarEvento = async (id) => {
    if (!confirm("¿Eliminar este evento?")) return;
    try {
      await eventosService.delete(id);
      setEventos(eventos.filter(e => e.id !== id));
    } catch (err) {
      alert("Error al eliminar evento");
    }
  };

  const getTipoColor = (tipo) => {
    const colores = {
      evento: "bg-blue-100 text-blue-700",
      torneo: "bg-purple-100 text-purple-700",
      cumpleaños: "bg-pink-100 text-pink-700",
      cierre: "bg-red-100 text-red-700",
      festejo: "bg-yellow-100 text-yellow-700",
    };
    return colores[tipo] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Eventos y Actividades</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]"
          >
            <FiPlus size={18} />
            <span>Nuevo Evento</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {eventos.map((evento) => (
            <div key={evento.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTipoColor(evento.tipo)}`}>
                  {evento.tipo}
                </span>
                {isAdmin && (
                  <button
                    onClick={() => eliminarEvento(evento.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{evento.titulo}</h3>
              {evento.descripcion && (
                <p className="text-sm text-gray-600 mb-3">{evento.descripcion}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiCalendar size={14} />
                  {formatDate(evento.fecha)}
                </span>
                {evento.hora && (
                  <span className="flex items-center gap-1">
                    <FiClock size={14} />
                    {evento.hora}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {eventos.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No hay eventos registrados
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nuevo Evento</h2>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input type="text" value={nuevoEvento.titulo} onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={nuevoEvento.descripcion} onChange={(e) => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" value={nuevoEvento.fecha} onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                  <input type="time" value={nuevoEvento.hora} onChange={(e) => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select value={nuevoEvento.tipo} onChange={(e) => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
