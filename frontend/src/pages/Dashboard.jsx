import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  partidosService,
  avisosService,
  productosService,
} from "../services/api";
import { formatCurrency } from "../utils/formatters";
import {
  FiCalendar,
  FiDollarSign,
  FiBell,
  FiShoppingBag,
} from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [proximosPartidos, setProximosPartidos] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partidosData, avisosData, productosData] = await Promise.all([
          partidosService.getProximos(),
          avisosService.getAll(),
          productosService.getAll(),
        ]);

        setProximosPartidos(
          partidosData.filter((p) => p.estado === "pendiente").slice(0, 3),
        );
        setResultados(
          partidosData.filter((p) => p.estado === "jugado").slice(0, 3),
        );
        setAvisos(avisosData.slice(0, 3));
        setProductos(productosData.slice(0, 4));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-[#00A651] text-white rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">
          ¡Bienvenido{user?.nombre_jugador ? `, ${user.nombre_jugador}` : ""}!
        </h1>
        <p className="mt-2 opacity-90">
          {isAdmin
            ? "Panel de Administración CEFOR"
            : "Escuela de Fútbol CEFOR"}
        </p>
        {user?.nombre_jugador && (
          <p className="mt-1 text-sm opacity-75">Padre/Tutor: {user.nombre}</p>
        )}
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/pagos"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <FiDollarSign className="text-3xl text-green-500 mb-2" />
            <h3 className="font-semibold text-lg">Pagos</h3>
            <p className="text-gray-500 text-sm">Gestionar contabilidad</p>
          </Link>
          <Link
            to="/market"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <FiShoppingBag className="text-3xl text-purple-500 mb-2" />
            <h3 className="font-semibold text-lg">Market</h3>
            <p className="text-gray-500 text-sm">Administrar productos</p>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/partidos"
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div className="bg-blue-500 p-4 text-white">
            <div className="flex items-center space-x-2">
              <FiCalendar size={20} />
              <h2 className="font-semibold text-lg">Próximos Partidos</h2>
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : proximosPartidos.length === 0 ? (
              <p className="text-gray-500">No hay partidos próximos</p>
            ) : (
              proximosPartidos.map((item, i) => (
                <div key={i} className="py-2 border-b last:border-b-0">
                  <p className="font-medium">{item.rival}</p>
                  <p className="text-sm text-gray-500">
                    {item.fecha} {item.hora && `• ${item.hora}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </Link>

        <Link
          to="/resultados"
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div className="bg-purple-500 p-4 text-white">
            <div className="flex items-center space-x-2">
              <FiCalendar size={20} />
              <h2 className="font-semibold text-lg">Resultados</h2>
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : resultados.length === 0 ? (
              <p className="text-gray-500">No hay resultados</p>
            ) : (
              resultados.map((item, i) => (
                <div key={i} className="py-2 border-b last:border-b-0">
                  <p className="font-medium">{item.rival}</p>
                  <p className="text-sm text-gray-500">
                    {item.fecha} • {item.resultado_local} -{" "}
                    {item.resultado_visitante}
                  </p>
                </div>
              ))
            )}
          </div>
        </Link>

        <Link
          to="/avisos"
          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
        >
          <div className="bg-orange-500 p-4 text-white">
            <div className="flex items-center space-x-2">
              <FiBell size={20} />
              <h2 className="font-semibold text-lg">Avisos</h2>
            </div>
          </div>
          <div className="p-4">
            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : avisos.length === 0 ? (
              <p className="text-gray-500">No hay avisos</p>
            ) : (
              avisos.map((item, i) => (
                <div key={i} className="py-2 border-b last:border-b-0">
                  <p className="font-medium">{item.titulo}</p>
                  <p className="text-sm text-gray-500">
                    {item.fecha_publicacion?.split("T")[0]}
                  </p>
                </div>
              ))
            )}
          </div>
        </Link>
      </div>

      {!isAdmin && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center">
            <FiShoppingBag className="mr-2" />
            Market - Productos Destacados
          </h2>
          {loading ? (
            <p className="text-gray-500">Cargando...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productos.map((producto, i) => (
                <div
                  key={i}
                  className="border rounded-lg p-3 text-center hover:border-[#00A651] transition-colors"
                >
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-[#00A651] font-bold">
                    {formatCurrency(producto.precio)}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Link
            to="/market"
            className="block text-center mt-4 text-[#00A651] hover:underline"
          >
            Ver todos los productos →
          </Link>
        </div>
      )}
    </div>
  );
}
