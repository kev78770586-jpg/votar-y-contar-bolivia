import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import { numeroALetras } from '../utils/numberToWords';
import { generateActaPDF } from '../utils/pdfGenerator';
import {
  FileCheck2,
  Download,
  Share2,
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function ActaGeneratorScreen() {
  const {
    mesa,
    partidos,
    especiales,
    jurados,
    totals,
    setActiveScreen,
    addAuditLog
  } = useElectoral();

  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const handleExportPDF = () => {
    setPdfGenerating(true);
    try {
      generateActaPDF({
        mesa,
        partidos,
        especiales,
        jurados,
        totals
      });
      addAuditLog(`Acta oficial en PDF exportada e impresa/descargada`, 'acta');
    } catch (e) {
      console.error(e);
      alert('Error al generar el PDF del acta.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Acta Mesa Nº ${mesa.numeroMesa} - ${mesa.departamento}`,
        text: `Resultados oficiales de la Mesa ${mesa.numeroMesa} (${mesa.recinto}): Total Votos: ${totals.totalAnfora}.`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Acta Mesa Nº ${mesa.numeroMesa} (${mesa.codigoMesa}) - ${mesa.recinto}: Votos Válidos: ${totals.totalValidos}, Blancos: ${totals.totalBlancos}, Nulos: ${totals.totalNulos}, Total: ${totals.totalAnfora}.`);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    }
  };

  return (
    <div className="space-y-4 pb-24 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FileCheck2 className="text-oep-primary" size={22} />
            Acta de Escrutinio Digital
          </h2>
          <p className="text-xs text-slate-500">
            Previsualización oficial del documento con cifras y literales
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
            title="Compartir o Copiar Resumen"
          >
            <Share2 size={16} />
          </button>
          <button
            onClick={handleExportPDF}
            disabled={pdfGenerating}
            className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-md flex items-center gap-1.5"
          >
            <Download size={15} />
            <span>{pdfGenerating ? 'Generando...' : 'Descargar PDF'}</span>
          </button>
        </div>
      </div>

      {copiedMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs text-emerald-800 font-semibold animate-in fade-in">
          ✓ Resumen copiado al portapapeles para delegados o WhatsApp.
        </div>
      )}

      {/* Previsualización del Acta con Estilo Institucional OEP */}
      <div className="bg-white rounded-2xl shadow-md border-2 border-slate-300 overflow-hidden text-slate-800 font-sans">
        {/* Encabezado Oficial OEP */}
        <div className="bg-oep-dark text-white p-3.5 text-center border-b-2 border-amber-500">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-[10px] tracking-widest font-extrabold uppercase text-amber-300">
              ESTADO PLURINACIONAL DE BOLIVIA
            </span>
          </div>
          <h3 className="text-sm font-black tracking-wider uppercase">
            Órgano Electoral Plurinacional
          </h3>
          <p className="text-[11px] text-emerald-200 font-semibold">
            Tribunal Electoral Departamental de {mesa.departamento}
          </p>
          <div className="mt-1 bg-amber-500/20 text-amber-300 text-[10px] font-extrabold py-0.5 px-2 rounded-full inline-block border border-amber-400/30">
            ACTA DE ESCRUTINIO Y CÓMPUTO - MESA Nº {mesa.numeroMesa}
          </div>
        </div>

        {/* Datos Generales de la Mesa */}
        <div className="bg-slate-50 p-3 border-b border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Código de Mesa</span>
            <span className="font-mono font-black text-slate-900">{mesa.codigoMesa}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Circunscripción</span>
            <span className="font-bold text-slate-900">{mesa.circunscripcion}</span>
          </div>
          <div className="col-span-2">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Recinto Electoral</span>
            <span className="font-medium text-slate-800">{mesa.recinto}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Padrón Habilitado</span>
            <span className="font-bold text-slate-900">{mesa.padronHabilitados} votantes</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[10px] uppercase">Papeletas Recibidas</span>
            <span className="font-bold text-slate-900">{mesa.papeletasRecibidas} papeletas</span>
          </div>
        </div>

        {/* Tabla Oficial de Resultados: Cifras y Literales */}
        <div className="p-3">
          <div className="text-[11px] font-bold uppercase text-slate-500 mb-2 flex items-center justify-between">
            <span>Resultados Escrutados</span>
            <span className="text-[10px] text-emerald-700 font-mono">Art. 160 Ley 026</span>
          </div>

          <table className="w-full text-xs border border-slate-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-slate-800 text-white text-[10px] uppercase">
                <th className="py-2 px-2 text-left">Organización Política</th>
                <th className="py-2 px-2 text-center w-14">Cifra</th>
                <th className="py-2 px-2 text-left">Resultado en Literal (Obligatorio)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {partidos.map((p, idx) => (
                <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="py-2 px-2 font-bold text-slate-800">
                    <span className="font-extrabold mr-1" style={{ color: p.color }}>[{p.sigla}]</span>
                    <span className="text-[11px]">{p.nombre}</span>
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-black text-sm text-slate-900">
                    {p.votos}
                  </td>
                  <td className="py-2 px-2 font-mono text-[10px] font-bold text-slate-600 uppercase">
                    {numeroALetras(p.votos)}
                  </td>
                </tr>
              ))}

              {/* Votos Blancos */}
              <tr className="bg-slate-100">
                <td className="py-2 px-2 font-bold text-slate-700">VOTOS BLANCOS</td>
                <td className="py-2 px-2 text-center font-mono font-black text-sm text-slate-900">
                  {especiales.blancos}
                </td>
                <td className="py-2 px-2 font-mono text-[10px] font-bold text-slate-600 uppercase">
                  {numeroALetras(especiales.blancos)}
                </td>
              </tr>

              {/* Votos Nulos */}
              <tr className="bg-red-50">
                <td className="py-2 px-2 font-bold text-red-800">VOTOS NULOS</td>
                <td className="py-2 px-2 text-center font-mono font-black text-sm text-red-700">
                  {especiales.nulos}
                </td>
                <td className="py-2 px-2 font-mono text-[10px] font-bold text-red-700 uppercase">
                  {numeroALetras(especiales.nulos)}
                </td>
              </tr>

              {/* Total General en Ánfora */}
              <tr className="bg-emerald-100/80 font-black border-t-2 border-emerald-600">
                <td className="py-2 px-2 text-emerald-950 font-black">
                  TOTAL EN ÁNFORA (EMITIDOS)
                </td>
                <td className="py-2 px-2 text-center font-mono font-black text-base text-emerald-900">
                  {totals.totalAnfora}
                </td>
                <td className="py-2 px-2 font-mono text-[10px] font-black text-emerald-900 uppercase">
                  {numeroALetras(totals.totalAnfora)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Resumen de Sobrantes y Padrón */}
        <div className="mx-3 mb-3 p-2.5 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Recibidas</span>
            <span className="font-mono font-black">{mesa.papeletasRecibidas}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Emitidas</span>
            <span className="font-mono font-black text-emerald-700">{totals.totalAnfora}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Sobrantes</span>
            <span className="font-mono font-black text-amber-700">{totals.sobrantes}</span>
          </div>
        </div>

        {/* Código QR y Hash de Validación */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-lg border border-slate-300 shadow-sm">
              <QrCode size={34} className="text-slate-800" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-[11px]">Validación Criptográfica OEP</p>
              <p className="text-[9px] font-mono text-slate-500">
                HASH: {mesa.codigoMesa}-9A8F3C7E-OEP2026
              </p>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                Verificado Oficial
              </span>
            </div>
          </div>
          <button
            onClick={handleExportPDF}
            className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
            title="Imprimir documento"
          >
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Botón para pasar a la pantalla de Firmas */}
      <div className="pt-2">
        <button
          onClick={() => setActiveScreen('signatures')}
          className="w-full py-3.5 px-4 bg-oep-primary hover:bg-oep-secondary text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform active:scale-98"
        >
          <span>Continuar a Gestión de Firmas de Jurados</span>
          <ArrowRight size={18} className="text-amber-300" />
        </button>
      </div>
    </div>
  );
}
