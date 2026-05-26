import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiStar } from 'react-icons/fi';
import { partidosService, eventosService } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function Calendario() {
  const [partidos, setPartidos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [partidosData, eventosData] = await Promise.all([
        partidosService.getAll(),
        eventosService.getAll(),
      ]);
      setPartidos(partidosData);
      setEventos(eventosData);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, date: null });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        date: new Date(year, month, i)
      });
    }
    
    return days;
  };

  const getItemsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];

    const partidosDia = partidos.filter(p => {
      if (!p.fecha) return false;
      return p.fecha.toString().split('T')[0] === dateStr;
    }).map(p => ({ ...p, _type: 'partido' }));

    const eventosDia = eventos.filter(e => {
      if (!e.fecha) return false;
      return e.fecha.toString().split('T')[0] === dateStr;
    }).map(e => ({ ...e, _type: 'evento' }));

    return [...partidosDia, ...eventosDia];
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  const getItemColor = (item) => {
    if (item._type === 'partido') {
      if (item.estado !== 'jugado') return 'bg-gray-200 text-gray-600';
      if (item.resultado_local > item.resultado_visitante) return 'bg-green-500 text-white';
      if (item.resultado_local < item.resultado_visitante) return 'bg-orange-500 text-white';
      return 'bg-yellow-400 text-gray-800';
    }
    const colores = {
      torneo: 'bg-purple-500 text-white',
      cumpleaños: 'bg-pink-400 text-white',
      cierre: 'bg-red-500 text-white',
      festejo: 'bg-yellow-400 text-gray-800',
    };
    return colores[item.tipo] || 'bg-blue-500 text-white';
  };

  const getItemLabel = (item) => {
    if (item._type === 'partido') return item.rival;
    return item.titulo;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Calendario</h1>
        <Link to="/eventos" className="flex items-center space-x-1 text-sm text-[#00A651] hover:underline">
          <FiStar size={16} />
          <span>Ver eventos</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map(day => (
            <div key={day} className="text-center font-semibold text-gray-500 py-2">{day}</div>
          ))}
          
          {days.map((item, index) => {
            const itemsDia = getItemsForDate(item.date);
            return (
              <div key={index} className={`min-h-[90px] border rounded-lg p-1 ${item.day ? 'bg-white' : 'bg-gray-50'}`}>
                {item.day && (
                  <>
                    <div className="text-sm font-medium text-gray-700">{item.day}</div>
                    {itemsDia.slice(0, 3).map((i, idx) => (
                      <div
                        key={`${i._type}-${i.id}`}
                        className={`text-xs p-1 rounded mt-1 truncate ${getItemColor(i)}`}
                        title={i._type === 'partido' ? `${i.categoria || 'Sub 11'} - ${i.estado === 'jugado' ? `${i.resultado_local}-${i.resultado_visitante}` : ''}` : i.titulo}
                      >
                        {getItemLabel(i)}
                      </div>
                    ))}
                    {itemsDia.length > 3 && (
                      <div className="text-xs text-gray-400 mt-1">+{itemsDia.length - 3} más</div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-semibold mb-3">Leyenda</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 rounded text-xs bg-green-500 text-white">Ganado</span>
          <span className="px-2 py-1 rounded text-xs bg-yellow-400 text-gray-800">Empate</span>
          <span className="px-2 py-1 rounded text-xs bg-orange-500 text-white">Perdido</span>
          <span className="px-2 py-1 rounded text-xs bg-gray-200 text-gray-600">Por jugar</span>
          <span className="px-2 py-1 rounded text-xs bg-blue-500 text-white">Evento</span>
          <span className="px-2 py-1 rounded text-xs bg-purple-500 text-white">Torneo</span>
          <span className="px-2 py-1 rounded text-xs bg-pink-400 text-white">Cumpleaños</span>
        </div>

        <h3 className="font-semibold mb-3">Próximos Partidos</h3>
        <div className="space-y-2">
          {partidos
            .filter(p => p.estado === 'pendiente')
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .map(partido => (
              <div key={partido.id} className="flex justify-between items-center p-2 border-b">
                <div>
                  <span className="font-medium">vs {partido.rival}</span>
                  <span className="text-gray-500 ml-2">{partido.lugar}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 ml-2 px-1.5 py-0.5 rounded">{partido.categoria || 'Sub 11'}</span>
                </div>
                <span className="text-sm text-gray-600">{formatDate(partido.fecha)} {partido.hora}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
