import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import { generateConstanciaEntregaPDF } from '../utils/pdfGenerator';
import SignatureModal from '../components/SignatureModal';
import {
  PackageCheck,
  ShieldCheck,
  Archive,
  FileText,
  Box,
  Briefcase,
  CheckCircle2,
  Clock,
  UserCheck,
  Download,
  AlertCircle,
  PenTool,
  Sparkles
} from 'lucide-react';

export default function DeliveryMaterialsScreen() {
  const {
    materiales,
    toggleMaterial,
    entrega,
    saveEntrega,
    mesa,
    jurados,
    setActiveScreen
  } = useElectoral();

  const [formData, setFormData] = useState({
    notarioNombre: entrega.notarioNombre,
    notarioCI: entrega.notarioCI,
    notarioCredencial: entrega.notarioCredencial,
    observacionesCustodia: entrega.observacionesCustodia
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [constanciaGenerada, setConstanciaGenerada] = useState(false);

  const totalCompletados = materiales.filter(m => m.completado).length;
  const todosCompletos = totalCompletados === materiales.length;

  const handleSignatureSave = (signatureData) => {
    saveEntrega({
      ...formData,
      firmaNotario: signatureData
    });
  };

  const handleGenerateConstancia = () => {
    try {
      generateConstanciaEntregaPDF({
        mesa,
        entrega: {
          ...entrega,
          ...formData,
          fechaHoraEntrega: new Date().toLocaleString('es-BO')
        },
        materiales,
        jurados
      });
      setConstanciaGenerada(true);
      setTimeout(() => setConstanciaGenerada(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Error al generar la constancia de entrega.');
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'Critico':
        return <ShieldCheck className="text-amber-500" size={20} />;
      case 'Mobiliario':
        return <Box className="text-blue-500" size={20} />;
      default:
        return <Briefcase className="text-emerald-500" size={20} />;
    }
  };

  return (
    <div className="space-y-4 pb-24 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <PackageCheck className="text-oep-primary" size={22} />
            Entrega de Materiales
          </h2>
          <p className="text-xs text-slate-500">
            Control de custodia y entrega formal al Notario Electoral del TED
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-black border ${
            todosCompletos
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-amber-50 text-amber-700 border-amber-300'
          }`}
        >
          {totalCompletados} de {materiales.length} paquetes
        </span>
      </div>

      {constanciaGenerada && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Constancia oficial de custodia y entrega generada y descargada en PDF.</span>
        </div>
      )}

      {/* Lista de Verificación de Sobres y Materiales (Checklist) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Lista de Verificación de Sobres y Custodia</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Toque para marcar</span>
        </h3>

        <div className="space-y-2.5">
          {materiales.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleMaterial(item.id)}
              className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition select-none ${
                item.completado
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={item.completado}
                  readOnly
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                    {item.codigo}
                  </span>
                  <p className="font-bold text-slate-900">{item.nombre}</p>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {item.descripcion}
                </p>
              </div>

              <div className="shrink-0 pt-0.5">
                {getIcon(item.tipo)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Datos del Notario Electoral Receptor */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-oep-primary uppercase tracking-wider pb-2 border-b border-slate-100">
          <UserCheck size={16} />
          <span>Responsable de Custodia - Notario Electoral OEP</span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">Nombre Completo del Notario</label>
            <input
              type="text"
              value={formData.notarioNombre}
              onChange={(e) => setFormData({ ...formData, notarioNombre: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Cédula de Identidad</label>
              <input
                type="text"
                value={formData.notarioCI}
                onChange={(e) => setFormData({ ...formData, notarioCI: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Nº Credencial OEP</label>
              <input
                type="text"
                value={formData.notarioCredencial}
                onChange={(e) => setFormData({ ...formData, notarioCredencial: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">Observaciones de Entrega</label>
            <textarea
              rows={2}
              value={formData.observacionesCustodia}
              onChange={(e) => setFormData({ ...formData, observacionesCustodia: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs"
            />
          </div>

          {/* Firma del Notario */}
          <div className="pt-2">
            <span className="block text-slate-500 font-semibold mb-1">Firma Digital del Notario Receptor:</span>
            {entrega.firmaNotario ? (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-9 bg-white rounded border border-slate-200 flex items-center justify-center overflow-hidden p-1">
                    <img src={entrega.firmaNotario} alt="Firma Notario" className="max-h-full object-contain" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-800 font-bold">✓ Firma del Notario Registrada</p>
                    <p className="text-[9px] text-slate-500">Recepción autorizada</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-[11px] text-slate-600 underline font-semibold"
                >
                  Cambiar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs shadow flex items-center justify-center gap-2 transition"
              >
                <PenTool size={15} className="text-amber-400" />
                Registrar Firma del Notario Electoral
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Botón de Generación de Constancia Oficial en PDF */}
      <div className="pt-2 space-y-2">
        <button
          onClick={handleGenerateConstancia}
          className="w-full py-3.5 px-4 bg-oep-primary hover:bg-oep-secondary text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform active:scale-98"
        >
          <Download size={18} className="text-amber-300" />
          <span>Generar Constancia de Entrega y Custodia (PDF)</span>
        </button>

        <button
          onClick={() => setActiveScreen('history')}
          className="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
        >
          <span>Ver Bitácora de Eventos y Reportes Finales</span>
        </button>
      </div>

      {/* Signature Modal para Notario */}
      <SignatureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSignatureSave}
        title="Firma del Notario Electoral"
        subtitle={`${formData.notarioNombre} (Credencial: ${formData.notarioCredencial})`}
      />
    </div>
  );
}
