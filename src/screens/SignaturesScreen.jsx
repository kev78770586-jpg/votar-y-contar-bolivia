import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import SignatureModal from '../components/SignatureModal';
import confetti from 'canvas-confetti';
import {
  PenTool,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  UserCheck,
  Sparkles,
  ArrowRight,
  Download
} from 'lucide-react';
import { generateActaPDF } from '../utils/pdfGenerator';

export default function SignaturesScreen() {
  const {
    jurados,
    signJurado,
    mesa,
    partidos,
    especiales,
    totals,
    setActiveScreen
  } = useElectoral();

  const [activeJuradoToSign, setActiveJuradoToSign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firmadosCount = jurados.filter(j => j.firmado).length;
  const quorumMinimo = 3; // Mínimo legal para dar validez en Bolivia
  const tieneQuorum = firmadosCount >= quorumMinimo;
  const todosFirmaron = firmadosCount === jurados.length;

  const handleOpenSignature = (jurado) => {
    setActiveJuradoToSign(jurado);
    setIsModalOpen(true);
  };

  const handleSaveSignature = (dataUrl) => {
    if (activeJuradoToSign) {
      signJurado(activeJuradoToSign.id, dataUrl);
      // Trigger confetti if this completes all signatures
      if (firmadosCount + 1 === jurados.length) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }
    }
  };

  return (
    <div className="space-y-4 pb-24 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <PenTool className="text-oep-primary" size={22} />
            Gestión de Firmas de Jurados
          </h2>
          <p className="text-xs text-slate-500">
            Registro y estampación de firmas manuscritas digitales
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-black border ${
            tieneQuorum
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}
        >
          {firmadosCount} de {jurados.length} firmas
        </span>
      </div>

      {/* Tarjeta de Estado de Quórum Legal */}
      <div
        className={`p-4 rounded-2xl border shadow-sm ${
          tieneQuorum
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/80 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                tieneQuorum ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            >
              {tieneQuorum ? <CheckCircle2 size={20} /> : <Clock size={20} />}
            </div>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wider">
                {tieneQuorum ? 'Quórum Legal Alcanzado' : 'Faltan Firmas Requeridas'}
              </p>
              <p className="text-[11px] opacity-90 mt-0.5">
                {tieneQuorum
                  ? `Se cuenta con ${firmadosCount} firmas registradas (mínimo legal: 3 jurados conforme a Ley 026).`
                  : `Se requiere la firma de al menos 3 jurados de mesa para la validez del acta electoral.`}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de progreso de firmas */}
        <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-3">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(firmadosCount / jurados.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Lista de Jurados con Estado y Botón de Firma */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Jurados Electorales Acreditados en Mesa
        </h3>

        {jurados.map((jurado) => (
          <div
            key={jurado.id}
            className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 space-y-2.5 transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-100 text-oep-secondary border border-slate-200">
                  {jurado.cargo}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900 mt-1">{jurado.nombre}</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">CI: {jurado.ci}</p>
              </div>

              {jurado.firmado ? (
                <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  Firmado
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  Pendiente
                </span>
              )}
            </div>

            {/* Recuadro de Firma */}
            {jurado.firmado ? (
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-10 bg-white rounded border border-slate-300 flex items-center justify-center overflow-hidden p-1 shadow-inner">
                    {jurado.firmaData ? (
                      <img src={jurado.firmaData} alt="Firma" className="max-h-full object-contain" />
                    ) : (
                      <span className="font-serif italic text-xs text-slate-700">Firma Registrada</span>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Estampada con éxito</p>
                    <p className="text-[10px] font-mono font-bold text-slate-700">
                      {jurado.fechaFirma || 'Fecha registrada'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenSignature(jurado)}
                  className="text-[11px] text-slate-500 hover:text-emerald-700 font-semibold underline px-2 py-1"
                >
                  Volver a firmar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleOpenSignature(jurado)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-700 to-oep-primary hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 active:scale-98 transition"
              >
                <PenTool size={15} className="text-amber-300" />
                Estampar Firma Digital ({jurado.cargo.split(' ')[0]})
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Botones de Acción */}
      <div className="pt-2 space-y-2">
        <button
          onClick={() => {
            generateActaPDF({ mesa, partidos, especiales, jurados, totals });
          }}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
        >
          <Download size={16} className="text-emerald-700" />
          Descargar Acta Oficial con Firmas Registradas (PDF)
        </button>

        <button
          onClick={() => setActiveScreen('delivery')}
          className="w-full py-3.5 px-4 bg-oep-primary hover:bg-oep-secondary text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform active:scale-98"
        >
          <span>Continuar a Entrega de Materiales y Sobres</span>
          <ArrowRight size={18} className="text-amber-300" />
        </button>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSignature}
        title={`Firma de ${activeJuradoToSign?.cargo}`}
        subtitle={`${activeJuradoToSign?.nombre} (CI: ${activeJuradoToSign?.ci})`}
      />
    </div>
  );
}
