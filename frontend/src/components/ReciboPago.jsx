import { useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from '../utils/formatters';

const LOGO_URL = '/logoCefor.jpeg';

export default function ReciboPago({ pago, nombreJugador, onClose }) {
  const [generando, setGenerando] = useState(null);

  const capturarCanvas = async () => {
    const node = document.getElementById('recibo-pago');
    return html2canvas(node, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
  };

  const descargarPNG = async () => {
    setGenerando('png');
    try {
      const canvas = await capturarCanvas();
      const link = document.createElement('a');
      link.download = `recibo-pago-${pago.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert('Error al generar la imagen');
    } finally {
      setGenerando(null);
    }
  };

  const descargarPDF = async () => {
    setGenerando('pdf');
    try {
      const canvas = await capturarCanvas();
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
        compress: true,
      });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`recibo-pago-${pago.id}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error al generar el PDF');
    } finally {
      setGenerando(null);
    }
  };

  const Fila = ({ etiqueta, valor }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #d1d5db', padding: '8px 0' }}>
      <span style={{ color: '#6b7280', fontWeight: 600, fontSize: 12 }}>{etiqueta}</span>
      <span style={{ color: '#111827', fontWeight: 600, fontSize: 13, textAlign: 'right', maxWidth: '60%' }}>{valor || '—'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-100 rounded-xl p-5 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Comprobante de Pago</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:bg-gray-200 rounded">
            <FiX size={20} />
          </button>
        </div>

        <div
          id="recibo-pago"
          style={{
            width: 400,
            maxWidth: '100%',
            margin: '0 auto 16px',
            background: '#ffffff',
            border: '2px solid #00A651',
            borderRadius: 10,
            overflow: 'hidden',
            fontFamily: 'Arial, Helvetica, sans-serif',
          }}
        >
          <div style={{ background: '#00A651', padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src={LOGO_URL}
              alt="Logo CEFOR"
              style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 999, background: '#ffffff', padding: 2 }}
            />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>CEFOR FÉNIX</div>
              <div style={{ color: '#e5f9ee', fontSize: 12 }}>Escuela de Fútbol</div>
            </div>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: 1 }}>
                NOTA DE VENTA / RECIBO
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                Folio No. {pago.id} &nbsp;•&nbsp; Fecha de emisión: {formatDate(new Date().toISOString())}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <Fila etiqueta="Jugador" valor={nombreJugador} />
              <Fila etiqueta="Categoría" valor={pago.categoria} />
              <Fila etiqueta="Concepto" valor={pago.concepto} />
              <Fila etiqueta="Fecha de pago" valor={formatDate(pago.fecha)} />
              <Fila etiqueta="Método de pago" valor={pago.metodo_pago || pago.metodo} />
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '12px 14px', marginTop: 10,
            }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#166534' }}>TOTAL PAGADO</span>
              <span style={{ fontWeight: 800, fontSize: 24, color: '#047857' }}>{formatCurrency(pago.monto)}</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: 16, borderTop: '1px solid #e5e7eb', paddingTop: 12 }}>
              <div style={{ fontSize: 11, color: '#6b7280' }}>
                ¡Gracias por su pago!
              </div>
              <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                CEFOR FÉNIX — Escuela de Fútbol
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={descargarPNG}
            disabled={generando !== null}
            className="flex items-center justify-center space-x-2 bg-[#00A651] text-white px-4 py-2 rounded-lg hover:bg-[#008f45] disabled:opacity-50"
          >
            <FiDownload size={16} />
            <span>{generando === 'png' ? 'Generando...' : 'Descargar Imagen (PNG)'}</span>
          </button>
          <button
            onClick={descargarPDF}
            disabled={generando !== null}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <FiDownload size={16} />
            <span>{generando === 'pdf' ? 'Generando...' : 'Descargar PDF'}</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}