import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiDollarSign, FiBell, FiShoppingBag, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  const proximosPartidos = [
    { id: 1, rival: 'Real Madrid', fecha: '2026-03-08', hora: '10:00', lugar: 'Campo CEFOR' },
    { id: 2, rival: 'Barcelona', fecha: '2026-03-15', hora: '11:00', lugar: 'Campo Barcelona' },
  ];

  const ultimosResultados = [
    { id: 1, rival: 'Atlético', resultado: '3 - 1', fecha: '2026-03-01' },
    { id: 2, rival: 'Sevilla', resultado: '2 - 2', fecha: '2026-02-22' },
  ];

  const avisosRecientes = [
    { id: 1, titulo: 'Torneo Primavera', fecha: '2026-03-02' },
    { id: 2, titulo: 'Uniformes disponibles', fecha: '2026-02-28' },
  ];

  const cards = [
    {
      title: 'Próximos Partidos',
      icon: FiCalendar,
      color: 'bg-blue-500',
      items: proximosPartidos,
      link: '/partidos',
    },
    {
      title: 'Resultados',
      icon: FiCalendar,
      color: 'bg-purple-500',
      items: ultimosResultados,
      link: '/resultados',
    },
    {
      title: 'Avisos',
      icon: FiBell,
      color: 'bg-orange-500',
      items: avisosRecientes,
      link: '/avisos',
    },
  ];

  if (isAdmin) {
    cards.splice(1, 0, {
      title: 'Gestión de Pagos',
      icon: FiDollarSign,
      color: 'bg-green-500',
      link: '/pagos',
      description: 'Registrar y ver pagos',
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#00A651] text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">
          ¡Bienvenido{user?.nombre_jugador ? `, ${user.nombre_jugador}` : ''}!
        </h1>
        <p className="mt-2 opacity-90">
          {isAdmin ? 'Panel de Administración CEFOR' : 'Escuela de Fútbol CEFOR'}
        </p>
        {user?.nombre_jugador && (
          <p className="mt-1 text-sm opacity-75">Padre/Tutor: {user.nombre}</p>
        )}
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/pagos" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
            <FiDollarSign className="text-3xl text-green-500 mb-2" />
            <h3 className="font-semibold text-lg">Pagos</h3>
            <p className="text-gray-500 text-sm">Gestionar contabilidad</p>
          </Link>
          <Link to="/codigos" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
            <FiUser className="text-3xl text-blue-500 mb-2" />
            <h3 className="font-semibold text-lg">Códigos</h3>
            <p className="text-gray-500 text-sm">Generar códigos de registro</p>
          </Link>
          <Link to="/market" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
            <FiShoppingBag className="text-3xl text-purple-500 mb-2" />
            <h3 className="font-semibold text-lg">Market</h3>
            <p className="text-gray-500 text-sm">Administrar productos</p>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Link key={index} to={card.link} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className={`${card.color} p-4 text-white`}>
              <div className="flex items-center space-x-2">
                <card.icon size={20} />
                <h2 className="font-semibold text-lg">{card.title}</h2>
              </div>
            </div>
            <div className="p-4">
              {card.description && (
                <p className="text-gray-600 mb-3">{card.description}</p>
              )}
              {card.items?.map((item, i) => (
                <div key={i} className="py-2 border-b last:border-b-0">
                  {item.rival && (
                    <>
                      <p className="font-medium">{item.rival}</p>
                      <p className="text-sm text-gray-500">
                        {item.fecha} {item.hora && `• ${item.hora}`}
                        {item.resultado && ` • ${item.resultado}`}
                      </p>
                    </>
                  )}
                  {item.titulo && (
                    <>
                      <p className="font-medium">{item.titulo}</p>
                      <p className="text-sm text-gray-500">{item.fecha}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {!isAdmin && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center">
            <FiShoppingBag className="mr-2" />
            Market - Productos Destacados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { nombre: 'Balón Match', precio: '€25' },
              { nombre: 'Uniforme Júnior', precio: '€35' },
              { nombre: 'Sudadera', precio: '€20' },
              { nombre: 'Medias', precio: '€8' },
            ].map((producto, i) => (
              <div key={i} className="border rounded-lg p-3 text-center hover:border-[#00A651] transition-colors">
                <p className="font-medium">{producto.nombre}</p>
                <p className="text-[#00A651] font-bold">{producto.precio}</p>
              </div>
            ))}
          </div>
          <Link to="/market" className="block text-center mt-4 text-[#00A651] hover:underline">
            Ver todos los productos →
          </Link>
        </div>
      )}
    </div>
  );
}
