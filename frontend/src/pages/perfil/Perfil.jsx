import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';

export default function Perfil() {
  const { user, isAdmin } = useAuth();

  const proximosPartidos = [
    { id: 1, rival: 'Real Madrid', fecha: '2026-03-08', hora: '10:00', lugar: 'Campo CEFOR' },
    { id: 2, rival: 'FC Barcelona', fecha: '2026-03-15', hora: '11:00', lugar: 'Campo Barcelona' },
  ];

  const ultimosResultados = [
    { id: 1, rival: 'Atlético Madrid', resultado: '3 - 1', fecha: '2026-03-01' },
    { id: 2, rival: 'Sevilla FC', resultado: '2 - 2', fecha: '2026-02-22' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-[#00A651] rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.nombre || 'Usuario'}</h2>
            <p className="text-gray-500 capitalize">{user?.rol || 'Usuario'}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-3">
            <FiMail className="text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email || 'No registrado'}</p>
            </div>
          </div>
          {user?.telefono && (
            <div className="flex items-center space-x-3">
              <FiPhone className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <p className="font-medium">{user.telefono}</p>
              </div>
            </div>
          )}
          {user?.nombre_jugador && (
            <div className="flex items-center space-x-3">
              <FiUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Jugador</p>
                <p className="font-medium">{user.nombre_jugador}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isAdmin && (
        <>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiCalendar className="mr-2" />
              Próximos Partidos
            </h3>
            <div className="space-y-3">
              {proximosPartidos.map((partido) => (
                <div key={partido.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">vs {partido.rival}</p>
                    <p className="text-sm text-gray-500">{partido.fecha} - {partido.hora}</p>
                  </div>
                  <span className="text-sm text-gray-500">{partido.lugar}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Resultados Recientes</h3>
            <div className="space-y-3">
              {ultimosResultados.map((resultado) => (
                <div key={resultado.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">vs {resultado.rival}</p>
                    <p className="text-sm text-gray-500">{resultado.fecha}</p>
                  </div>
                  <span className="text-lg font-bold text-[#00A651]">{resultado.resultado}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
