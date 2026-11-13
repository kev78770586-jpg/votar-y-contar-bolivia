import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, AlertTriangle } from 'lucide-react';

export default function SignatureModal({ isOpen, onClose, onSave, title, subtitle }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#083324';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Touch and Mouse Coordinate Helper
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = () => {
    if (!hasDrawn) {
      alert("Por favor estampe su firma sobre el recuadro antes de guardar.");
      return;
    }
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-emerald-900/20 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-oep-dark to-oep-primary text-white p-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <span>✍️</span> {title || "Estampar Firma Digital"}
            </h3>
            <p className="text-emerald-100 text-xs mt-0.5">
              {subtitle || "Firme con el dedo o lápiz óptico en el recuadro inferior"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="relative bg-slate-50 border-2 border-dashed border-emerald-600/40 rounded-xl overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={380}
              height={190}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-48 touch-none cursor-crosshair bg-white"
            />
            {/* Guide line */}
            <div className="absolute bottom-10 left-6 right-6 border-b border-slate-300 pointer-events-none flex justify-center">
              <span className="text-[10px] text-slate-400 bg-white px-2 -mb-2">Línea base de firma</span>
            </div>
            {!hasDrawn && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
                <span className="text-2xl">✒️</span>
                <span className="text-xs font-medium mt-1">Trace su firma manuscrita aquí</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1 text-emerald-800 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Lienzo digital activo
            </span>
            <button
              onClick={clearCanvas}
              type="button"
              className="flex items-center gap-1 text-slate-600 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-slate-100 transition"
            >
              <RotateCcw size={13} />
              Limpiar trazo
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start gap-2 text-[11px] text-amber-800">
            <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
            <p>
              Esta firma se vinculará al acta de escrutinio con sello de tiempo y Cédula de Identidad, sirviendo de respaldo administrativo.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-100 px-4 py-3 flex gap-2 justify-end border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold text-white bg-oep-primary hover:bg-oep-secondary rounded-xl shadow-md flex items-center gap-1.5 transition transform active:scale-95"
          >
            <Check size={16} />
            Confirmar y Guardar Firma
          </button>
        </div>
      </div>
    </div>
  );
}
