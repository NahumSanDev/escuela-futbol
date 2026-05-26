import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/api";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setToken("");
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message);
      if (data.resetToken) {
        setToken(data.resetToken);
      }
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
          <p className="text-gray-500 mt-2">Recuperar Contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {token && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded text-sm break-all">
              <p className="font-semibold mb-1">Token de recuperación (modo desarrollo):</p>
              <p className="font-mono text-xs">{token}</p>
              <p className="mt-2">
                <Link to={`/reset-password?token=${encodeURIComponent(token)}`} className="text-blue-700 underline">
                  Haz clic aquí para restablecer tu contraseña
                </Link>
              </p>
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A651] text-white py-3 rounded-lg font-semibold hover:bg-[#008f45] transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar instrucciones"}
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
