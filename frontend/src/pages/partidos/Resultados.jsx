import { useState, useEffect } from 'react';
import { FiCalendar, FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { partidosService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Resultados() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [nuevoResultado, setNuevoResultado] = useState({
    rival: '',
    fecha: '',
    hora: '',
    lugar: '',
    resultado_local: '',
    resultado_visitante: '',
    estado: 'jugado'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await partidosService.getAll();
      setPartidos(data.filter(p => p.estado === 'jugado'));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await partidosService.create(nuevoResultado);
      await fetchData();
      setShowModal(false);
      setNuevoResultado({
        rival: '', fecha: '', hora: '', lugar: '',
        resultado_local: '', resultado_visitante: '', estado: 'jugado'
      });
    } catch (err) {
      alert('Error al crear resultado');
    }
  };

  const handleEdit = (partido) => {
    setEditando(partido);
    setNuevoResultado({
      rival: partido.rival,
      fecha: partido.fecha,
      hora: partido.hora || '',
      lugar: partido.lugar || '',
      resultado_local: partido.resultado_local,
      resultado_visitante: partido.resultado_visitante,
      estado: 'jugado'
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await partidosService.update(editando.id, nuevoResultado);
      await fetchData();
      setShowModal(false);
      setEditando(null);
      setNuevoResultado({
        rival: '', fecha: '', hora: '', lugar: '',
        resultado_local: '', resultado_visitante: '', estado: 'jugado'
      });
    } catch (err) {
      alert('Error al actualizar resultado');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditando(null);
    setNuevoResultado({
      rival: '', fecha: '', hora: '', lugar: '',
      resultado_local: '', resultado_visitante: '', estado: 'jugado'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Resultados</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]"
          >
            <FiPlus size={18} />
            <span>Nuevo Resultado</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {partidos.map((resultado) => (
            <div key={resultado.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-[#00A651] to-green-400 text-white p-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>CEFOR</span>
                  <span className="text-3xl">{resultado.resultado_local} - {resultado.resultado_visitante}</span>
                  <span>{resultado.rival}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <FiCalendar className="mr-2" />
                  <span>{resultado.fecha}</span>
                </div>
                <p className="text-sm text-gray-500">{resultado.lugar}</p>
                {isAdmin && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleEdit(resultado)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <FiEdit2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {partidos.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No hay resultados registrados
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editando ? 'Editar Resultado' : 'Nuevo Resultado'}</h2>
              <button onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={editando ? handleUpdate : handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rival</label>
                <input
                  type="text"
                  value={nuevoResultado.rival}
                  onChange={(e) => setNuevoResultado({ ...nuevoResultado, rival: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goles CEFOR</label>
                  <input
                    type="number"
                    value={nuevoResultado.resultado_local}
                    onChange={(e) => setNuevoResultado({ ...nuevoResultado, resultado_local: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goles Rival</label>
                  <input
                    type="number"
                    value={nuevoResultado.resultado_visitante}
                    onChange={(e) => setNuevoResultado({ ...nuevoResultado, resultado_visitante: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={nuevoResultado.fecha}
                  onChange={(e) => setNuevoResultado({ ...nuevoResultado, fecha: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                <input
                  type="text"
                  value={nuevoResultado.lugar}
                  onChange={(e) => setNuevoResultado({ ...nuevoResultado, lugar: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]"
                >
                  {editando ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
