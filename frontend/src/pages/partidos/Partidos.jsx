import { useState } from 'react';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

const PARTIDOS = [
  { id: 1, rival: 'Real Madrid', fecha: '2026-03-08', hora: '10:00', lugar: 'Campo CEFOR', estado: 'pendiente' },
  { id: 2, rival: 'FC Barcelona', fecha: '2026-03-15', hora: '11:00', lugar: 'Campo Barcelona', estado: 'pendiente' },
  { id: 3, rival: 'Atlético Madrid', fecha: '2026-03-22', hora: '09:30', lugar: 'Campo Vicente Calderón', estado: 'pendiente' },
  { id: 4, rival: 'Sevilla FC', fecha: '2026-03-29', hora: '10:30', lugar: 'Campo CEFOR', estado: 'pendiente' },
];

export default function Partidos() {
  const [partidos] = useState(PARTIDOS);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Próximos Partidos</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {partidos.map((partido) => (
          <div key={partido.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#00A651] text-white p-4">
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
              <div className="pt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  partido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {partido.estado === 'pendiente' ? 'Por jugar' : 'Jugado'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {partidos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay partidos programados
        </div>
      )}
    </div>
  );
}
