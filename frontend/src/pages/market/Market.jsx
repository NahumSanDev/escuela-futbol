import { useState } from 'react';
import { FiShoppingCart, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const PRODUCTOS = [
  { id: 1, nombre: 'Sudadera CEFOR', descripcion: 'Sudadera con capucha oficial', precio: 20, categoria: 'Uniformes', imagen: '' },
  { id: 2, nombre: 'Pantalón Deportivo', descripcion: 'Pantalón oficial CEFOR', precio: 18, categoria: 'Uniformes', imagen: '' },
  { id: 3, nombre: 'Chubasquero', descripcion: 'Impermeable oficial', precio: 25, categoria: 'Uniformes', imagen: '' },
  { id: 4, nombre: 'Equipación Júnior', descripcion: 'Camiseta + shorts (tallas 8-14)', precio: 35, categoria: 'Equipaciones', imagen: '' },
  { id: 5, nombre: 'Equipación Senior', descripcion: 'Camiseta + shorts (tallas S-XXL)', precio: 40, categoria: 'Equipaciones', imagen: '' },
  { id: 6, nombre: 'Braga', descripcion: 'Braga训练', precio: 6, categoria: 'Complementos', imagen: '' },
  { id: 7, nombre: 'Calcetines', descripcion: 'Calcetines oficiales', precio: 8, categoria: 'Complementos', imagen: '' },
  { id: 8, nombre: 'Balón Match', descripción: 'Balón oficial de partido', precio: 25, categoria: 'Balones', imagen: '' },
  { id: 9, nombre: 'Balón Entrenamiento (x10)', descripcion: 'Pack de 10 balones', precio: 30, categoria: 'Balones', imagen: '' },
  { id: 10, nombre: 'Bolsa Viaje', descripcion: 'Bolsa de viaje oficial', precio: 18, categoria: 'Bolsas', imagen: '' },
  { id: 11, nombre: 'Mochila', descripcion: 'Mochila escolar/deportiva', precio: 15, categoria: 'Bolsas', imagen: '' },
];

const CATEGORIAS = ['Todos', 'Uniformes', 'Equipaciones', 'Complementos', 'Balones', 'Bolsas'];

export default function Market() {
  const { isAdmin } = useAuth();
  const [productos] = useState(PRODUCTOS);
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');

  const productosFiltrados = categoriaFiltro === 'Todos' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaFiltro);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Fénix Market</h1>
        {isAdmin && (
          <button className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]">
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              {producto.imagen ? (
                <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">⚽</span>
              )}
            </div>
            <div className="p-4">
              <span className="text-xs text-[#00A651] font-medium">{producto.categoria}</span>
              <h3 className="font-semibold text-gray-800">{producto.nombre}</h3>
              <p className="text-sm text-gray-500 mb-2">{producto.descripcion}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#00A651]">€{producto.precio}</span>
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
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay productos en esta categoría
        </div>
      )}
    </div>
  );
}
