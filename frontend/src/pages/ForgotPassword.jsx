import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { FiMail, FiSmartphone, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [method, setMethod] = useState(null);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSmsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const data = await authService.sendOtp(email);
      setMessage(data.message);
      setShowOtp(true);
      setMethod("sms");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setOtpLoading(true);
    try {
      const data = await authService.verifyOtp(email, otpCode);
      navigate(`/reset-password?token=${encodeURIComponent(data.resetToken)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-green-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00A651]">CEFOR FÉNIX</h1>
          <p className="text-gray-500 mt-2">Recuperar Contraseña</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}

        {showOtp ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-gray-600 text-sm">Ingresa el código de 6 dígitos que enviamos a tu teléfono</p>
            <div>
              <label className="block text-gray-700 mb-2">Código de verificación</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={otpLoading || otpCode.length !== 6}
              className="w-full bg-[#00A651] text-white py-3 rounded-lg font-semibold hover:bg-[#008f45] transition-colors disabled:opacity-50"
            >
              {otpLoading ? "Verificando..." : "Verificar código"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-500 text-sm text-center mb-4">Elige cómo recuperar tu contraseña</p>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
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

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00A651] text-white py-3 rounded-lg font-semibold hover:bg-[#008f45] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiMail size={18} />
                  {loading ? "Enviando..." : "Enviar al correo"}
                </button>

                <button
                  type="button"
                  onClick={handleSmsSubmit}
                  disabled={loading}
                  className="w-full border border-[#00A651] text-[#00A651] py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiSmartphone size={18} />
                  {loading ? "Enviando..." : "Enviar código por SMS"}
                </button>
              </div>
            </form>
          </div>
        )}

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
