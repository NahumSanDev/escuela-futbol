import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pagos from './pages/contabilidad/Pagos';
import Partidos from './pages/partidos/Partidos';
import Resultados from './pages/partidos/Resultados';
import Avisos from './pages/avisos/Avisos';
import Market from './pages/market/Market';
import Perfil from './pages/perfil/Perfil';
import GenerarCodigos from './pages/admin/GenerarCodigos';

function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.rol !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
}

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="pagos" element={
          <PrivateRoute requireAdmin>
            <Pagos />
          </PrivateRoute>
        } />
        <Route path="partidos" element={<Partidos />} />
        <Route path="resultados" element={<Resultados />} />
        <Route path="avisos" element={<Avisos />} />
        <Route path="market" element={<Market />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="codigos" element={
          <PrivateRoute requireAdmin>
            <GenerarCodigos />
          </PrivateRoute>
        } />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}
