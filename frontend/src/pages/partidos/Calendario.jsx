import { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { partidosService } from '../../services/api';
import { formatDate } from '../../utils/formatters';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function Calendario() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await partidosService.getAll();
      setPartidos(data);
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

  const getPartidosForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return partidos.filter(p => p.fecha === dateStr);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      1 className="text-2xl font-bold text-gray-800">Calendario de Partidos</h1>

      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {DAYS.map(day => (
            <div key={day} className="text-center font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {days.map((item, index) => {
            const partidosDia = getPartidosForDate(item.date);
            return (
              <div
                key={index}
                className={`min-h-[80px] border rounded-lg p-1 ${
                  item.day ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {item.day && (
                  <>
                    <div className="text-sm font-medium text-gray-700">{item.day}</div>
                    {partidosDia.map(partido => (
                      <div
                        key={partido.id}
                        className={`text-xs p-1 rounded mt-1 truncate ${
                          partido.estado === 'jugado'
                            ? 'bg-gray-200 text-gray-600'
                            : 'bg-[#00A651] text-white'
                        }`}
                      >
                        {partido.rival}
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4">
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
                </div>
                <span className="text-sm text-gray-600">{formatDate(partido.fecha)} {partido.hora}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
