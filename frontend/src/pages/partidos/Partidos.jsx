import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiMapPin,
  FiClock,
  FiPlus,
  FiX,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";
import { partidosService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CATEGORIAS = ["Sub 9", "Sub 11", "Sub 13"];

export default function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [partidoResultado, setPartidoResultado] = useState(null);
  const [nuevoPartido, setNuevoPartido] = useState({
    rival: "",
    fecha: "",
    hora: "",
    lugar: "",
    estado: "pendiente",
    categoria: "Sub 11",
  });
  const [resultado, setResultado] = useState({
    resultado_local: "",
    resultado_visitante: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await partidosService.getAll();
      setPartidos(data.filter((p) => p.estado === "pendiente"));
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este partido?")) return;
    try {
      await partidosService.delete(id);
      await fetchData();
    } catch (err) {
      alert("Error al eliminar partido");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await partidosService.create(nuevoPartido);
      await fetchData();
      setShowModal(false);
      setNuevoPartido({
        rival: "",
        fecha: "",
        hora: "",
        lugar: "",
        estado: "pendiente",
        categoria: "Sub 11",
      });
    } catch (err) {
      alert("Error al crear partido");
    }
  };

  const openResultModal = (partido) => {
    setPartidoResultado(partido);
    setResultado({ resultado_local: "", resultado_visitante: "" });
    setShowResultModal(true);
  };

  const handleResultSubmit = async (e) => {
    e.preventDefault();
    try {
      await partidosService.update(partidoResultado.id, {
        ...partidoResultado,
        resultado_local: parseInt(resultado.resultado_local),
        resultado_visitante: parseInt(resultado.resultado_visitante),
        estado: "jugado",
      });
      setShowResultModal(false);
      setPartidoResultado(null);
      setResultado({ resultado_local: "", resultado_visitante: "" });
      await fetchData();
    } catch (err) {
      alert("Error al registrar resultado");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Próximos Partidos</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]"
          >
            <FiPlus size={18} />
            <span>Nuevo Partido</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {partidos.map((partido) => (
            <div
              key={partido.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-[#00A651] text-white p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded">{partido.categoria || 'Sub 11'}</span>
                  <span className="text-xs">CEFOR</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">CEFOR</span>
                  <span className="text-2xl font-bold">vs</span>
                  <span className="font-semibold text-lg">{partido.rival}</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-2" />
                  <span>{partido.fecha}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span>{partido.hora}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="mr-2" />
                  <span>{partido.lugar}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                    Por jugar
                  </span>
                  {isAdmin && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openResultModal(partido)}
                        className="flex items-center text-green-600 hover:text-green-800 text-sm"
                      >
                        <FiCheckCircle className="mr-1" size={16} />
                        Resultado
                      </button>
                      <button
                        onClick={() => handleDelete(partido.id)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm"
                      >
                        <FiTrash2 className="mr-1" size={16} />
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {partidos.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No hay partidos programados
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nuevo Partido</h2>
              <button onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rival
                </label>
                <input
                  type="text"
                  value={nuevoPartido.rival}
                  onChange={(e) =>
                    setNuevoPartido({ ...nuevoPartido, rival: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={nuevoPartido.fecha}
                  onChange={(e) =>
                    setNuevoPartido({ ...nuevoPartido, fecha: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={nuevoPartido.hora}
                  onChange={(e) =>
                    setNuevoPartido({ ...nuevoPartido, hora: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lugar
                </label>
                <input
                  type="text"
                  value={nuevoPartido.lugar}
                  onChange={(e) =>
                    setNuevoPartido({ ...nuevoPartido, lugar: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  value={nuevoPartido.categoria}
                  onChange={(e) =>
                    setNuevoPartido({ ...nuevoPartido, categoria: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {CATEGORIAS.map(c => (
                    <option key={c} value={c}>{c}</option>
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

      {showResultModal && partidoResultado && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Registrar Resultado</h2>
              <button onClick={() => { setShowResultModal(false); setPartidoResultado(null); }}>
                <FiX />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              CEFOR vs <strong>{partidoResultado.rival}</strong> ({partidoResultado.categoria || 'Sub 11'})
            </p>
            <form onSubmit={handleResultSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goles CEFOR</label>
                  <input
                    type="number"
                    value={resultado.resultado_local}
                    onChange={(e) => setResultado({ ...resultado, resultado_local: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goles Rival</label>
                  <input
                    type="number"
                    value={resultado.resultado_visitante}
                    onChange={(e) => setResultado({ ...resultado, resultado_visitante: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowResultModal(false); setPartidoResultado(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]"
                >
                  Guardar Resultado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
