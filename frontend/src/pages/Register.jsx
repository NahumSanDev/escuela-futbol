import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/api";
import { FiUser, FiLock, FiPhone, FiMail } from "react-icons/fi";

export default function Register() {
  const [nombrePadre, setNombrePadre] = useState("");
  const [nombreJugador, setNombreJugador] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const codigoRegistro = `CEFOR${currentYear}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validar que el código ingresado sea correcto
    if (codigo.toUpperCase() !== codigoRegistro) {
      setError(
        `Código de registro inválido. El código correcto es: ${codigoRegistro}`,
      );
      setLoading(false);
      return;
    }

    try {
      const data = await authService.register({
        codigo: codigo.toUpperCase(),
        nombre_padre: nombrePadre,
        nombre_jugador: nombreJugador,
        telefono,
        email,
        password,
      });
      localStorage.setItem("cefor_token", data.token);
      login(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-green-700 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#00A651]">CEFOR</h1>
          <p className="text-gray-500 mt-2">Registro de Familia</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Registro
            </label>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
              <p className="text-xs text-blue-700">
                Ingresa el código proporcionado por CEFOR:
              </p>
              <p className="text-lg font-bold text-blue-800 mt-1">
                {codigoRegistro}
              </p>
            </div>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none uppercase tracking-wider"
              placeholder="Ej: CEFOR2026"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Nombre del Padre/Tutor
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={nombrePadre}
                onChange={(e) => setNombrePadre(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="Nombre completo"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Nombre del Jugador
            </label>
            <input
              type="text"
              value={nombreJugador}
              onChange={(e) => setNombreJugador(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
              placeholder="Nombre del niño"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Teléfono</label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="Número de teléfono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Password (4-6 dígitos)
            </label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="Password numérico"
                minLength={4}
                maxLength={6}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A651] text-white py-3 rounded-lg font-semibold hover:bg-[#008f45] transition-colors disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-[#00A651] hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
