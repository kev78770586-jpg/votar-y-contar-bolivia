import React from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  Vote,
  Calculator,
  FileCheck2,
  PenTool,
  PackageCheck,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function DashboardScreen() {
  const {
    currentUser,
    mesa,
    totals,
    jurados,
    materiales,
    setActiveScreen
  } = useElectoral();

  const firmasCompletadas = jurados.filter(j => j.firmado).length;
  const materialesCompletados = materiales.filter(m => m.completado).length;
  const participacionPorcentaje = mesa.padronHabilitados > 0
    ? Math.round((totals.totalAnfora / mesa.padronHabilitados) * 100)
    : 0;

  const etapas = [
    { id: 'mesainfo', title: '1. Mesa y Padrón', status: 'done', screen: 'mesainfo' },
    { id: 'counting', title: '2. Escrutinio', status: totals.totalAnfora > 0 ? 'done' : 'active', screen: 'counting' },
    { id: 'results', title: '3. Cuadre', status: totals.statusCuadre.status === 'CORRECTO' ? 'done' : 'warning', screen: 'results' },
    { id: 'signatures', title: '4. Firmas', status: firmasCompletadas >= 3 ? 'done' : 'pending', screen: 'signatures' },
    { id: 'delivery', title: '5. Entrega TED', status: materialesCompletados === materiales.length ? 'done' : 'pending', screen: 'delivery' }
  ];

  return (
    <div className="space-y-4 pb-20 p-4">
      {/* Header Institucional de Mesa */}
      <div className="bg-gradient-to-br from-oep-dark via-oep-primary to-emerald-800 text-white rounded-2xl p-4 shadow-xl border border-emerald-600/30">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {mesa.departamento} • {mesa.circunscripcion}
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              Mesa Nº {mesa.numeroMesa}
            </h1>
            <p className="text-xs text-emerald-100 flex items-center gap-1 mt-0.5">
              <Building2 size={13} className="text-emerald-300 shrink-0" />
              <span className="truncate max-w-[240px]">{mesa.recinto}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider inline-block shadow">
              {mesa.estadoProceso}
            </span>
            <p className="text-[10px] text-emerald-200 mt-1 font-mono">
              Cód: {mesa.codigoMesa}
            </p>
          </div>
        </div>

        {/* User identification bar */}
        <div className="mt-3 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-700/80 flex items-center justify-center font-bold text-amber-300 text-xs border border-emerald-400/30">
              {currentUser?.nombre?.charAt(5) || 'J'}
            </div>
            <div>
              <p className="font-semibold text-white leading-tight">{currentUser?.nombre}</p>
              <p className="text-[10px] text-emerald-200">{currentUser?.cargo}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveScreen('mesainfo')}
            className="text-[11px] text-amber-300 hover:text-white font-medium flex items-center gap-0.5"
          >
            Ver datos <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Flujo de Etapas Electorales (Stepper) */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200">
        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Flujo de Trabajo del Jurado</span>
          <span className="text-emerald-700 font-semibold lowercase">fase actual: escrutinio y cierre</span>
        </h2>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {etapas.map((etapa) => {
            let badgeBg = "bg-slate-100 text-slate-500 border-slate-200";
            if (etapa.status === 'done') badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold";
            if (etapa.status === 'warning') badgeBg = "bg-amber-50 text-amber-800 border-amber-300 font-bold";
            if (etapa.status === 'active') badgeBg = "bg-blue-50 text-blue-700 border-blue-400 font-bold ring-2 ring-blue-400/20";

            return (
              <button
                key={etapa.id}
                onClick={() => setActiveScreen(etapa.screen)}
                className={`p-1.5 rounded-xl border flex flex-col items-center justify-center text-center transition ${badgeBg}`}
              >
                <span className="text-[10px] leading-tight line-clamp-2">
                  {etapa.title}
                </span>
                <span className="mt-1">
                  {etapa.status === 'done' ? (
                    <CheckCircle2 size={13} className="text-emerald-600" />
                  ) : etapa.status === 'warning' ? (
                    <AlertTriangle size={13} className="text-amber-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Métricas Principales en Vivo */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Escrutado */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Votos en Ánfora</span>
            <Vote size={18} className="text-emerald-600" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {totals.totalAnfora}
              <span className="text-xs font-semibold text-slate-500 ml-1">/ {mesa.padronHabilitados}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, participacionPorcentaje)}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-0.5 text-emerald-700 font-semibold">
              <TrendingUp size={12} /> {participacionPorcentaje}% participación
            </span>
            <span>{totals.sobrantes} sobrantes</span>
          </div>
        </div>

        {/* Estado del Cuadre */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estado de Cuadre</span>
            <Calculator size={18} className="text-emerald-600" />
          </div>
          <div className="my-1.5">
            {totals.statusCuadre.status === 'CORRECTO' ? (
              <div className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                <span className="text-sm font-black uppercase leading-tight">Cuadrado 100%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-600">
                <AlertTriangle size={24} className="shrink-0" />
                <span className="text-sm font-black uppercase leading-tight">Revisar Diferencia</span>
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              Recibidas {mesa.papeletasRecibidas} = Ánfora {totals.totalAnfora} + Sobr. {totals.sobrantes}
            </p>
          </div>
          <button
            onClick={() => setActiveScreen('results')}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-end gap-1"
          >
            Ver balance <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* Indicadores de Avance de Firmas y Materiales */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => setActiveScreen('signatures')}
          className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-emerald-100/60 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <PenTool size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-800">Firmas de Jurados</p>
            <p className="text-base font-extrabold text-slate-900">
              {firmasCompletadas} <span className="text-xs font-semibold text-slate-500">de {jurados.length}</span>
            </p>
            <p className="text-[10px] text-emerald-700">
              {firmasCompletadas === jurados.length ? '✓ Todas registradas' : 'Pendiente firmas'}
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveScreen('delivery')}
          className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-amber-100/60 transition"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <PackageCheck size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-800">Custodia / Sobres</p>
            <p className="text-base font-extrabold text-slate-900">
              {materialesCompletados} <span className="text-xs font-semibold text-slate-500">de {materiales.length}</span>
            </p>
            <p className="text-[10px] text-amber-700">
              {materialesCompletados === materiales.length ? '✓ Listo para entrega' : 'Empaque en proceso'}
            </p>
          </div>
        </div>
      </div>

      {/* Accesos Directos a las Acciones Principales */}
      <div>
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          Acciones Principales del Jurado
        </h3>
        <div className="grid grid-cols-1 gap-2.5">
          {/* Botón 1: Conteo Digital de Votos */}
          <button
            onClick={() => setActiveScreen('counting')}
            className="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between transition transform active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <Vote size={24} className="text-amber-300" />
              </div>
              <div className="text-left">
                <p className="font-black text-sm tracking-tight">Registro y Conteo Asistido</p>
                <p className="text-[11px] text-emerald-200">
                  Escrutinio por partido, palotes, candidatos y votos especiales
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/80" />
          </button>

          {/* Botón 2: Acta Electoral y PDF */}
          <button
            onClick={() => setActiveScreen('acta')}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3.5 rounded-2xl shadow-sm flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <FileCheck2 size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-slate-800">Generación y Vista del Acta</p>
                <p className="text-[11px] text-slate-500">
                  Cifras, literales automáticos en mayúsculas y exportación a PDF
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          {/* Botón 3: Doble Verificación y Validación */}
          <button
            onClick={() => setActiveScreen('validation')}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3.5 rounded-2xl shadow-sm flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
                <FileSpreadsheet size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-slate-800">Revisión y Doble Confirmación</p>
                <p className="text-[11px] text-slate-500">
                  Control anti-errores, historial de cambios y bloqueo de acta
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>

          {/* Botón 4: Bitácora e Historial */}
          <button
            onClick={() => setActiveScreen('history')}
            className="w-full bg-white hover:bg-slate-50 border border-slate-200 p-3.5 rounded-2xl shadow-sm flex items-center justify-between transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                <History size={22} />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-slate-800">Bitácora de Eventos y Gráficos</p>
                <p className="text-[11px] text-slate-500">
                  Trazabilidad de cada operación y copia de seguridad de la mesa
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
