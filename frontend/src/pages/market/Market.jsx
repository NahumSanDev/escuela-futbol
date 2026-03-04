import { useState, useEffect } from 'react';
import { FiShoppingCart, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { productosService } from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

const CATEGORIAS = ['Todos', 'Uniformes', 'Equipaciones', 'Complementos', 'Balones', 'Bolsas'];

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
    categoria: 'Uniformes'
  });

  useEffect(() => {
    fetchData();
  }, []);

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
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', categoria: 'Uniformes' });
    } catch (err) {
      alert('Error al crear producto');
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
                      <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
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
    </div>
  );
}
