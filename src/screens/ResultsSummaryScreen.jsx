import React from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  Calculator,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Percent,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ResultsSummaryScreen() {
  const {
    partidos,
    totals,
    mesa,
    setActiveScreen
  } = useElectoral();

  const isCuadreExacto = totals.statusCuadre.status === 'CORRECTO';

  return (
    <div className="space-y-4 pb-24 p-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <Calculator className="text-oep-primary" size={22} />
          Suma Automática y Cuadre
        </h2>
        <p className="text-xs text-slate-500">
          Conciliación matemática y balance de papeletas de la mesa
        </p>
      </div>

      {/* Tarjeta de Diagnóstico Matemático */}
      <div
        className={`rounded-2xl p-4 border shadow-sm ${
          isCuadreExacto
            ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/90 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl text-white shrink-0 ${
              isCuadreExacto ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          >
            {isCuadreExacto ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  isCuadreExacto ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'
                }`}
              >
                {isCuadreExacto ? 'Cuadre 100% Conforme' : 'Advertencia de Descuadre'}
              </span>
            </div>
            <h3 className="font-extrabold text-sm mt-1">
              {isCuadreExacto
                ? 'La mesa electoral se encuentra matemáticamente cuadrada.'
                : totals.statusCuadre.mensaje}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {isCuadreExacto
                ? 'Las papeletas en ánfora más las papeletas sobrantes equivalen exactamente a las recibidas en la maleta electoral.'
                : 'Verifique el recuento de papeletas sobrantes o el conteo de firmas en la lista índice antes de proceder a la firma.'}
            </p>
          </div>
        </div>
      </div>

      {/* Matriz de Conciliación de Papeletas */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Conciliación Matemática de Papeletas</span>
          <span className="font-mono text-emerald-700">Mesa {mesa.numeroMesa}</span>
        </h3>

        <div className="space-y-2 text-xs">
          {/* 1. Recibidas */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-700">1. Papeletas Recibidas en Maleta (A)</span>
            <span className="font-mono font-black text-sm text-slate-900">{mesa.papeletasRecibidas}</span>
          </div>

          {/* 2. Votos en Ánfora */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="font-semibold text-emerald-900">2. Papeletas en el Ánfora - Votos Emitidos (B)</span>
            <span className="font-mono font-black text-sm text-emerald-700">{totals.totalAnfora}</span>
          </div>

          {/* 3. Sobrantes */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="font-semibold text-amber-900">3. Papeletas Sobrantes e Inutilizadas (C)</span>
            <span className="font-mono font-black text-sm text-amber-700">{totals.sobrantes}</span>
          </div>

          {/* 4. Votantes en Lista Índice */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-700">4. Ciudadanos que Votaron en Lista Índice (D)</span>
            <span className="font-mono font-black text-sm text-slate-900">{totals.votantesListaIndice}</span>
          </div>

          {/* Ecuación de Control */}
          <div className="p-3 bg-slate-900 text-white rounded-xl font-mono text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Ecuación OEP: A = B + C</span>
              <span className="text-emerald-400">
                {mesa.papeletasRecibidas} = {totals.totalAnfora} + {totals.sobrantes}
              </span>
            </div>
            <div className="flex items-center justify-between font-bold">
              <span>Diferencia matemática:</span>
              <span className={totals.descuadrePapeletas === 0 ? "text-emerald-400" : "text-amber-400"}>
                {totals.descuadrePapeletas === 0 ? "0 (CUADRE PERFECTO)" : `${totals.descuadrePapeletas} papeletas`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de Votos Emitidos */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center justify-between">
          <span>Distribución y Porcentajes de Votación</span>
          <Percent size={15} className="text-slate-400" />
        </h3>

        {/* Tabla compacta de resultados */}
        <div className="space-y-2">
          {partidos.map((p) => {
            const pct = totals.totalAnfora > 0 ? ((p.votos / totals.totalAnfora) * 100).toFixed(1) : 0;
            return (
              <div key={p.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    ></span>
                    <span className="font-bold text-slate-800">[{p.sigla}] {p.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-slate-900">{p.votos}</span>
                    <span className="text-[10px] text-slate-500 font-semibold w-10 text-right">{pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%`, backgroundColor: p.color }}
                  ></div>
                </div>
              </div>
            );
          })}

          {/* Blancos y Nulos */}
          <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-semibold">Votos Blancos:</span>
              <span className="font-mono font-bold text-slate-800">
                {totals.totalBlancos} ({totals.totalAnfora > 0 ? ((totals.totalBlancos / totals.totalAnfora) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-semibold">Votos Nulos:</span>
              <span className="font-mono font-bold text-red-700">
                {totals.totalNulos} ({totals.totalAnfora > 0 ? ((totals.totalNulos / totals.totalAnfora) * 100).toFixed(1) : 0}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="pt-2 flex gap-2">
        <button
          onClick={() => setActiveScreen('counting')}
          className="flex-1 py-3 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition"
        >
          ← Corregir Conteo
        </button>
        <button
          onClick={() => setActiveScreen('acta')}
          className="flex-1 py-3 px-3 bg-oep-primary hover:bg-oep-secondary text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition"
        >
          <span>Generar Acta Digital</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
