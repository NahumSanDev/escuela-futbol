import { useState, useEffect } from "react";
import { FiPlus, FiFile, FiX, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { avisosService, comentariosService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Avisos() {
  const { isAdmin, user } = useAuth();
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedAviso, setExpandedAviso] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState("");

  const [nuevoAviso, setNuevoAviso] = useState({
    titulo: "",
    descripcion: "",
    archivo_url: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await avisosService.getAll();
      setAvisos(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cargarComentarios = async (avisoId) => {
    try {
      const data = await comentariosService.getByAviso(avisoId);
      setComentarios({ ...comentarios, [avisoId]: data });
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    }
  };

  const toggleComentarios = (avisoId) => {
    if (expandedAviso === avisoId) {
      setExpandedAviso(null);
    } else {
      setExpandedAviso(avisoId);
      cargarComentarios(avisoId);
    }
  };

  const handleComentarioSubmit = async (avisoId) => {
    if (!nuevoComentario.trim()) return;
    try {
      await comentariosService.create({
        aviso_id: avisoId,
        mensaje: nuevoComentario,
      });
      setNuevoComentario("");
      cargarComentarios(avisoId);
    } catch (err) {
      alert("Error al publicar comentario");
    }
  };

  const eliminarComentario = async (comentarioId, avisoId) => {
    if (!confirm("¿Eliminar este comentario?")) return;
    try {
      await comentariosService.delete(comentarioId);
      cargarComentarios(avisoId);
    } catch (err) {
      alert("Error al eliminar comentario");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await avisosService.create(nuevoAviso);
      await fetchData();
      setShowModal(false);
      setNuevoAviso({ titulo: "", descripcion: "", archivo_url: "" });
    } catch (err) {
      alert("Error al crear aviso");
    }
  };

  const eliminarAviso = async (id) => {
    if (confirm("¿Estás seguro de eliminar este aviso?")) {
      try {
        await avisosService.delete(id);
        setAvisos(avisos.filter((a) => a.id !== id));
      } catch (err) {
        alert("Error al eliminar aviso");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNuevoAviso({ titulo: "", descripcion: "", archivo_url: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Avisos y Noticias</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]"
          >
            <FiPlus size={18} />
            <span>Nuevo Aviso</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="space-y-4">
          {avisos.map((aviso) => (
            <div key={aviso.id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {aviso.titulo}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {aviso.fecha_publicacion?.split("T")[0]}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => eliminarAviso(aviso.id)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{aviso.descripcion}</p>
              {aviso.archivo_url && (
                <div className="flex items-center space-x-2 mb-4">
                  {aviso.archivo_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <a
                      href={aviso.archivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={aviso.archivo_url}
                        alt="Adjunto"
                        className="max-h-40 rounded-lg"
                      />
                    </a>
                  ) : (
                    <a
                      href={aviso.archivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-[#00A651] hover:underline"
                    >
                      <FiFile size={18} />
                      <span className="text-sm">Ver archivo adjunto</span>
                    </a>
                  )}
                </div>
              )}

              {/* Sección de Comentarios */}
              <div className="border-t pt-4 mt-4">
                <button
                  onClick={() => toggleComentarios(aviso.id)}
                  className="flex items-center space-x-2 text-[#00A651] hover:underline"
                >
                  <FiMessageSquare size={18} />
                  <span className="font-medium">
                    {expandedAviso === aviso.id
                      ? "Ocultar comentarios"
                      : `Ver comentarios (${comentarios[aviso.id]?.length || 0})`}
                  </span>
                </button>

                {expandedAviso === aviso.id && (
                  <div className="mt-4 space-y-3">
                    {/* Lista de comentarios */}
                    <div className="space-y-2">
                      {comentarios[aviso.id]?.length > 0 ? (
                        comentarios[aviso.id].map((comentario) => (
                          <div
                            key={comentario.id}
                            className="bg-gray-50 rounded-lg p-3"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-gray-800">
                                    {comentario.nombre_usuario}
                                  </span>
                                  {comentario.rol === "admin" && (
                                    <span className="text-xs bg-[#00A651] text-white px-2 py-0.5 rounded">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-700 text-sm mt-1">
                                  {comentario.mensaje}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    comentario.created_at,
                                  ).toLocaleString("es-ES", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              {(isAdmin ||
                                comentario.usuario_id === user?.id) && (
                                <button
                                  onClick={() =>
                                    eliminarComentario(comentario.id, aviso.id)
                                  }
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  <FiTrash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">
                          Sé el primero en comentar
                        </p>
                      )}
                    </div>

                    {/* Formulario para nuevo comentario */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        placeholder="Escribe tu comentario..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleComentarioSubmit(aviso.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComentarioSubmit(aviso.id)}
                        className="px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45] text-sm"
                      >
                        Comentar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {avisos.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No hay avisos publicados
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Publicar Aviso</h2>
              <button onClick={closeModal}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={nuevoAviso.titulo}
                  onChange={(e) =>
                    setNuevoAviso({ ...nuevoAviso, titulo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={4}
                  value={nuevoAviso.descripcion}
                  onChange={(e) =>
                    setNuevoAviso({
                      ...nuevoAviso,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del archivo (imagen o PDF)
                </label>
                <input
                  type="url"
                  value={nuevoAviso.archivo_url}
                  onChange={(e) =>
                    setNuevoAviso({
                      ...nuevoAviso,
                      archivo_url: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://ejemplo.com/archivo.pdf"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ejemplo: https://nagasasa.github.io/escuela-futbol/aviso.pdf
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]"
                >
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
