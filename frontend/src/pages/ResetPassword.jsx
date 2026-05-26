import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "../services/api";
import { FiLock, FiArrowLeft } from "react-icons/fi";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.resetPassword(token, newPassword);
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-green-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00A651]">CEFOR</h1>
          <p className="text-gray-500 mt-2">Nueva Contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message} Redirigiendo al login...
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Token de recuperación</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none font-mono text-sm"
              placeholder="Pega el token aquí"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Nueva contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="Nueva contraseña"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="Repite la contraseña"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A651] text-white py-3 rounded-lg font-semibold hover:bg-[#008f45] transition-colors disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-gray-500 hover:text-[#00A651] inline-flex items-center">
            <FiArrowLeft className="mr-1" />
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
