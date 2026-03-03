import { useState } from 'react';
import { FiPlus, FiFile, FiImage } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AVISOS = [
  { id: 1, titulo: 'Torneo Primavera 2026', descripcion: 'Inscripciones abiertas para el torneo de primavera. Fecha límite: 15 de marzo.', fecha: '2026-03-02', archivo: true },
  { id: 2, titulo: 'Uniformes Disponibles', descripcion: 'Nuevos uniformes disponibles en la tienda. Consulta tallas en secretaría.', fecha: '2026-02-28', archivo: false },
  { id: 3, titulo: 'Partido contra Real Madrid', descripcion: 'Recordatorio del partido este domingo. Hora de encuentro: 9:30.', fecha: '2026-02-25', archivo: true },
  { id: 4, titulo: 'Cambio de Horario', descripcion: 'A partir de abril, los entrenamientos serán de 17:00 a 18:30.', fecha: '2026-02-20', archivo: false },
];

export default function Avisos() {
  const { isAdmin } = useAuth();
  const [avisos] = useState(AVISOS);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Avisos y Noticias</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45]"
          >
            <FiPlus size={18} />
            <span>Nuevo Aviso</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {avisos.map((aviso) => (
          <div key={aviso.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{aviso.titulo}</h3>
              <span className="text-sm text-gray-500">{aviso.fecha}</span>
            </div>
            <p className="text-gray-600 mb-4">{aviso.descripcion}</p>
            {aviso.archivo && (
              <div className="flex items-center space-x-2 text-[#00A651]">
                <FiFile size={18} />
                <span className="text-sm hover:underline cursor-pointer">Ver archivo adjunto</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {avisos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay avisos publicados
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Publicar Aviso</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adjuntar archivo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#00A651]">
                  <FiImage className="mx-auto text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Arrastra o selecciona archivo</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-[#00A651] text-white rounded-lg hover:bg-[#008f45]">
                  Publicar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
