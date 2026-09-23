import { useState, useEffect, useRef } from 'react';
import { FiShoppingCart, FiPlus, FiEdit2, FiTrash2, FiX, FiUpload, FiImage } from 'react-icons/fi';
import { productosService } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const CATEGORIAS = ['Todos', 'Uniformes', 'Equipaciones', 'Complementos', 'Balones', 'Bolsas', 'Negocios', 'Bazar'];

export default function Market() {
  const { isAdmin } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'Uniformes',
    imagen_url: ''
  });
  const [editProducto, setEditProducto] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [espacio, setEspacio] = useState({ bytes: 0, limiteBytes: 0, limiteMB: 30, cantidad: 0 });
  const [subiendoImg, setSubiendoImg] = useState(false);
  const fileInputRef = useRef(null);
  const fileInputEditRef = useRef(null);

  const formatBytes = (b) => {
    if (!b) return '0 MB';
    const mb = b / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(b / 1024)} KB`;
  };

  useEffect(() => {
    fetchData();
    if (isAdmin) cargarEspacio();
  }, []);

  const cargarEspacio = async () => {
    try {
      setEspacio(await productosService.getEspacio());
    } catch (err) {
      console.error('Error al cargar espacio', err);
    }
  };

  const handleUpload = async (e, esEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoImg(true);
    try {
      const res = await productosService.uploadImagen(file);
      if (esEdit) {
        setEditProducto({ ...editProducto, imagen_url: res.imagen_url });
      } else {
        setNuevoProducto({ ...nuevoProducto, imagen_url: res.imagen_url });
      }
      setEspacio(res.espacio || espacio);
    } catch (err) {
      alert(err.message || 'Error al subir imagen');
    } finally {
      setSubiendoImg(false);
      if (e.target) e.target.value = '';
    }
  };

  const fetchData = async () => {
    try {
      const data = await productosService.getAll();
      setProductos(data.filter(p => p.activo !== false));
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productosService.create(nuevoProducto);
      await fetchData();
      setShowModal(false);
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', categoria: 'Uniformes', imagen_url: '' });
    } catch (err) {
      alert('Error al crear producto');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await productosService.update(editProducto.id, editProducto);
      await fetchData();
      setShowEditModal(false);
      setEditProducto(null);
    } catch (err) {
      alert('Error al actualizar producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productosService.delete(id);
        setProductos(productos.filter(p => p.id !== id));
      } catch (err) {
        alert('Error al eliminar producto');
      }
    }
  };

  const productosFiltrados = categoriaFiltro === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaFiltro);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Fénix Market</h1>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <div className="text-xs text-gray-500 bg-white rounded-lg px-3 py-2 shadow-sm" title="Almacenamiento de imágenes de productos">
              📸 {formatBytes(espacio.bytes)} / {formatBytes(espacio.limiteBytes)}
              <div className="w-28 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full rounded-full ${espacio.bytes / espacio.limiteBytes > 0.85 ? 'bg-red-500' : 'bg-[#00A651]'}`}
                  style={{ width: `${Math.min(100, (espacio.bytes / espacio.limiteBytes) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]"
            >
              <FiPlus size={18} />
              <span>Agregar Producto</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoriaFiltro(cat)}
            className={`px-4 py-2 rounded-full transition-colors ${
              categoriaFiltro === cat 
                ? 'bg-[#00A651] text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-32 bg-gray-200 flex items-center justify-center">
                {producto.imagen_url ? (
                  <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">⚽</span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs text-[#00A651] font-medium">{producto.categoria}</span>
                <h3 className="font-semibold text-gray-800">{producto.nombre}</h3>
                <p className="text-sm text-gray-500 mb-2">{producto.descripcion}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#00A651]">{formatCurrency(producto.precio)}</span>
                  {!isAdmin && (
                    <button className="p-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]">
                      <FiShoppingCart size={18} />
                    </button>
                  )}
                  {isAdmin && (
                    <div className="flex space-x-1">
                      <button onClick={() => { setEditProducto(producto); setShowEditModal(true); }} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => eliminarProducto(producto.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {productosFiltrados.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          No hay productos en esta categoría
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nuevo Producto</h2>
              <button onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={nuevoProducto.nombre}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={nuevoProducto.descripcion}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={nuevoProducto.precio}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del producto</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
                    {nuevoProducto.imagen_url ? (
                      <img src={nuevoProducto.imagen_url} alt="Vista previa" className="w-full h-full object-cover" />
                    ) : (
                      <FiImage className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={subiendoImg}
                      className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-[#00A651] hover:text-[#00A651] disabled:opacity-50"
                    >
                      <FiUpload size={16} />
                      <span>{subiendoImg ? 'Optimizando...' : 'Subir imagen'}</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, false)} />
                    <input
                      type="url"
                      value={nuevoProducto.imagen_url || ''}
                      onChange={(e) => setNuevoProducto({ ...nuevoProducto, imagen_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="...o pega una URL de imagen"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Se optimiza automáticamente a JPEG (máx 800px) para ocupar el menor espacio.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={nuevoProducto.categoria}
                  onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {CATEGORIAS.filter(c => c !== 'Todos').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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

      {showEditModal && editProducto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Editar Producto</h2>
              <button onClick={() => { setShowEditModal(false); setEditProducto(null); }}><FiX /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editProducto.nombre}
                  onChange={(e) => setEditProducto({ ...editProducto, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={editProducto.descripcion}
                  onChange={(e) => setEditProducto({ ...editProducto, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editProducto.precio}
                  onChange={(e) => setEditProducto({ ...editProducto, precio: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del producto</label>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
                    {editProducto.imagen_url ? (
                      <img src={editProducto.imagen_url} alt="Vista previa" className="w-full h-full object-cover" />
                    ) : (
                      <FiImage className="text-gray-400" size={24} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputEditRef.current?.click()}
                      disabled={subiendoImg}
                      className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-[#00A651] hover:text-[#00A651] disabled:opacity-50"
                    >
                      <FiUpload size={16} />
                      <span>{subiendoImg ? 'Optimizando...' : 'Subir imagen'}</span>
                    </button>
                    <input ref={fileInputEditRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, true)} />
                    <input
                      type="url"
                      value={editProducto.imagen_url || ''}
                      onChange={(e) => setEditProducto({ ...editProducto, imagen_url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="...o pega una URL de imagen"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Se optimiza automáticamente a JPEG (máx 800px) para ocupar el menor espacio.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={editProducto.categoria}
                  onChange={(e) => setEditProducto({ ...editProducto, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {CATEGORIAS.filter(c => c !== 'Todos').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setEditProducto(null); }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
