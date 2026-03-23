import { useState, useEffect } from "react";
import { FiTrash2, FiUsers } from "react-icons/fi";
import { familiasService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Familias() {
  const { isAdmin } = useAuth();
  const [familias, setFamilias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const data = await familiasService.getAll();
      setFamilias(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const eliminarFamilia = async (id, nombre) => {
    if (
      !confirm(
        `¿Estás seguro de eliminar a "${nombre}"? Esta acción no se puede deshacer.`
      )
    )
      return;
    try {
      await familiasService.delete(id);
      setFamilias(familias.filter((f) => f.id !== id));
    } catch (err) {
      alert("Error al eliminar familia");
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-12 text-gray-500">
        No tienes permiso para ver esta página
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Familias Registradas
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <FiUsers size={20} />
          <span className="font-medium">{familias.length} familias</span>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre del Jugador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Padre/Tutor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {familias.length > 0 ? (
                  familias.map((familia) => (
                    <tr key={familia.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {familia.nombre_jugador}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-700">{familia.nombre_padre}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{familia.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-600">{familia.telefono}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-500 text-sm">
                          {new Date(familia.created_at).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() =>
                            eliminarFamilia(familia.id, familia.nombre_jugador)
                          }
                          className="text-red-600 hover:text-red-900 flex items-center justify-end gap-1 ml-auto"
                          title="Eliminar familia"
                        >
                          <FiTrash2 size={18} />
                          <span className="text-sm">Eliminar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No hay familias registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> El código de registro para este año es{" "}
          <strong className="font-bold">CEFOR{new Date().getFullYear()}</strong>.
          Compártelo solo con los padres que quieras registrar.
        </p>
      </div>
    </div>
  );
}
