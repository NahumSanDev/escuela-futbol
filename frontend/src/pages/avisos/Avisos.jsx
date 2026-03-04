import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiFile, FiImage, FiX, FiTrash2, FiUpload } from 'react-icons/fi';
import { avisosService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Avisos() {
  const { isAdmin, user } = useAuth();
  const [avisos, setAvisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [nuevoAviso, setNuevoAviso] = useState({
    titulo: '',
    descripcion: '',
    archivo_url: ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await avisosService.getAll();
      setAvisos(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875571358', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setNuevoAviso({ ...nuevoAviso, archivo_url: data.data.url });
      } else {
        alert('Error al subir archivo');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al subir archivo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await avisosService.create(nuevoAviso);
      await fetchData();
      setShowModal(false);
      setNuevoAviso({ titulo: '', descripcion: '', archivo_url: '' });
    } catch (err) {
      alert('Error al crear aviso');
    }
  };

  const eliminarAviso = async (id) => {
    if (confirm('¿Estás seguro de eliminar este aviso?')) {
      try {
        await avisosService.delete(id);
        setAvisos(avisos.filter(a => a.id !== id));
      } catch (err) {
        alert('Error al eliminar aviso');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setNuevoAviso({ titulo: '', descripcion: '', archivo_url: '' });
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
                <h3 className="text-lg font-semibold text-gray-800">{aviso.titulo}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">{aviso.fecha_publicacion?.split('T')[0]}</span>
                  {isAdmin && (
                    <button onClick={() => eliminarAviso(aviso.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{aviso.descripcion}</p>
              {aviso.archivo_url && (
                <div className="flex items-center space-x-2">
                  {aviso.archivo_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <a href={aviso.archivo_url} target="_blank" rel="noopener noreferrer">
                      <img src={aviso.archivo_url} alt="Adjunto" className="max-h-40 rounded-lg" />
                    </a>
                  ) : (
                    <a href={aviso.archivo_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[#00A651] hover:underline">
                      <FiFile size={18} />
                      <span className="text-sm">Ver archivo adjunto</span>
                    </a>
                  )}
                </div>
              )}
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
              <button onClick={closeModal}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={nuevoAviso.titulo}
                  onChange={(e) => setNuevoAviso({ ...nuevoAviso, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={4}
                  value={nuevoAviso.descripcion}
                  onChange={(e) => setNuevoAviso({ ...nuevoAviso, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo Adjunto (imagen o PDF)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <FiUpload size={18} />
                    <span>{uploading ? 'Subiendo...' : 'Seleccionar archivo'}</span>
                  </button>
                  {nuevoAviso.archivo_url && (
                    <span className="text-sm text-green-600">✓ Archivo seleccionado</span>
                  )}
                </div>
                {nuevoAviso.archivo_url && (
                  <input
                    type="text"
                    value={nuevoAviso.archivo_url}
                    onChange={(e) => setNuevoAviso({ ...nuevoAviso, archivo_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-2"
                    placeholder="O pega una URL directamente"
                  />
                )}
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]">
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
