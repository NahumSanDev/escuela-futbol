import { useState } from 'react';
import { FiPlus, FiCopy, FiCheck } from 'react-icons/fi';

export default function GenerarCodigos() {
  const [codigos, setCodigos] = useState([
    { id: 1, codigo: 'FAMILIA2024', usado: true, fecha_creacion: '2026-01-15' },
    { id: 2, codigo: 'CEFOR001', usado: false, fecha_creacion: '2026-02-01' },
    { id: 3, codigo: 'CEFOR002', usado: false, fecha_creacion: '2026-02-15' },
  ]);
  const [cantidad, setCantidad] = useState(1);
  const [copiado, setCopiado] = useState(null);

  const generarCodigo = () => {
    const nuevosCodigos = [];
    const prefijo = 'CEFOR';
    
    for (let i = 0; i < cantidad; i++) {
      const numero = String(Math.floor(Math.random() * 900) + 100);
      nuevosCodigos.push({
        id: Date.now() + i,
        codigo: `${prefijo}${numero}`,
        usado: false,
        fecha_creacion: new Date().toISOString().split('T')[0],
      });
    }
    
    setCodigos([...nuevosCodigos, ...codigos]);
  };

  const copiarCodigo = (codigo) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    setTimeout(() => setCopiado(null), 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Generar Códigos de Registro</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Generar nuevos códigos</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de códigos</label>
            <input
              type="number"
              min="1"
              max="50"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            onClick={generarCodigo}
            className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]"
          >
            <FiPlus size={18} />
            <span>Generar</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Códigos generados</h2>
        
        {codigos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay códigos generados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Código</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Fecha de creación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {codigos.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-medium">{item.codigo}</td>
                    <td className="px-4 py-3 text-gray-600">{item.fecha_creacion}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.usado 
                          ? 'bg-gray-100 text-gray-600' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.usado ? 'Usado' : 'Disponible'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copiarCodigo(item.codigo)}
                        className="flex items-center space-x-1 text-[#00A651] hover:underline"
                      >
                        {copiado === item.codigo ? <FiCheck size={16} /> : <FiCopy size={16} />}
                        <span>{copiado === item.codigo ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
