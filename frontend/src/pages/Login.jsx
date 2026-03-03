import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      if (email === 'admin@cefor.com' && password === '1234') {
        login({
          id: 1,
          email,
          nombre: 'Administrador',
          rol: 'admin'
        });
        navigate('/');
      } else if (email && password.length >= 4) {
        login({
          id: 2,
          email,
          nombre: 'Padre/Jugador',
          nombre_jugador: 'Jugador Demo',
          rol: 'padre'
        });
        navigate('/');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00A651] to-green-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#00A651]">CEFOR</h1>
          <p className="text-gray-500 mt-2">Escuela de Fútbol</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Usuario / Email</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-transparent outline-none"
                placeholder="Ingresa tu password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A651] text-white py-3 rounded-lg font-semibold hover:bg-[#008f45] transition-colors disabled:opacity-50"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/register" className="text-[#00A651] hover:underline">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">Demo:</p>
          <p>Admin: admin@cefor.com / 1234</p>
          <p>Padre: cualquier email / 4 dígitos</p>
        </div>
      </div>
    </div>
  );
}
