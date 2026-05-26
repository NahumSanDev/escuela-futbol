import { useState, useEffect, useRef } from 'react';
import { FiBell } from 'react-icons/fi';
import { notificacionesService } from '../../services/api';

export default function NotificationBell() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchData = async () => {
    try {
      const data = await notificacionesService.getAll();
      setNotificaciones(data);
    } catch (err) {
      // silent
    }
  };

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const marcarLeida = async (id) => {
    await notificacionesService.marcarLeida(id);
    setNotificaciones(notificaciones.map(n => n.id === id ? { ...n, leida: true } : n));
  };

  const marcarTodas = async () => {
    await notificacionesService.marcarTodasLeidas();
    setNotificaciones(notificaciones.map(n => ({ ...n, leida: true })));
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-[#00A651] transition-colors"
      >
        <FiBell size={20} />
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="font-semibold text-gray-800">Notificaciones</span>
            {noLeidas > 0 && (
              <button onClick={marcarTodas} className="text-xs text-[#00A651] hover:underline">
                Marcar todas como leídas
              </button>
            )}
          </div>
          {notificaciones.length === 0 ? (
            <p className="p-4 text-center text-gray-500 text-sm">Sin notificaciones</p>
          ) : (
            notificaciones.map(n => (
              <div
                key={n.id}
                onClick={() => !n.leida && marcarLeida(n.id)}
                className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${!n.leida ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-800">{n.titulo}</span>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{formatTime(n.created_at)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{n.mensaje}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
