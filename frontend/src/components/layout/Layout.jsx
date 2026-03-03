import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiDollarSign, FiCalendar, FiBell, FiShoppingBag, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: FiHome, label: 'Inicio', exact: true },
    ...(isAdmin ? [{ to: '/pagos', icon: FiDollarSign, label: 'Pagos' }] : []),
    { to: '/partidos', icon: FiCalendar, label: 'Partidos' },
    { to: '/avisos', icon: FiBell, label: 'Avisos' },
    { to: '/market', icon: FiShoppingBag, label: 'Market' },
    { to: '/perfil', icon: FiUser, label: 'Perfil' },
    ...(isAdmin ? [{ to: '/codigos', icon: FiUser, label: 'Códigos' }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-[#00A651] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">CEFOR</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                      isActive ? 'bg-white/20' : 'hover:bg-white/10'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
              >
                <FiLogOut size={18} />
                <span>Salir</span>
              </button>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-3 ${
                    isActive ? 'bg-white/20' : 'hover:bg-white/10'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-3 w-full text-left hover:bg-white/10"
            >
              <FiLogOut size={20} />
              <span>Salir</span>
            </button>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
