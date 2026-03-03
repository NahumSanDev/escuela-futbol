import { FiCalendar } from 'react-icons/fi';

const RESULTADOS = [
  { id: 1, rival: 'Atlético Madrid', resultado_local: 3, resultado_visitante: 1, fecha: '2026-03-01', lugar: 'Campo CEFOR' },
  { id: 2, rival: 'Sevilla FC', resultado_local: 2, resultado_visitante: 2, fecha: '2026-02-22', lugar: 'Campo Sevilla' },
  { id: 3, rival: 'Valencia CF', resultado_local: 1, resultado_visitante: 0, fecha: '2026-02-15', lugar: 'Campo CEFOR' },
  { id: 4, rival: 'Villarreal', resultado_local: 4, resultado_visitante: 2, fecha: '2026-02-08', lugar: 'Campo Villarreal' },
  { id: 5, rival: 'Betis', resultado_local: 2, resultado_visitante: 3, fecha: '2026-02-01', lugar: 'Campo CEFOR' },
];

export default function Resultados() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resultados</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {RESULTADOS.map((resultado) => (
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
            </div>
          </div>
        ))}
      </div>

      {RESULTADOS.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay resultados registrados
        </div>
      )}
    </div>
  );
}
