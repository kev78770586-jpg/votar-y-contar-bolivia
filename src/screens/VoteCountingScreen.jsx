import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  Vote,
  Plus,
  Minus,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Radio,
  AlertCircle,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function VoteCountingScreen() {
  const {
    partidos,
    updateVote,
    setVoteDirect,
    especiales,
    updateEspeciales,
    totals,
    mesa,
    soundEnabled,
    setSoundEnabled,
    actaBloqueada,
    setActiveScreen
  } = useElectoral();

  const [mode, setMode] = useState('grid'); // 'grid' | 'live'
  const [lastVoted, setLastVoted] = useState(null);

  const handleVoteWithFeedback = (partidoId, delta) => {
    if (actaBloqueada) return;
    updateVote(partidoId, delta);
    const p = partidos.find(item => item.id === partidoId);
    if (p && delta > 0) {
      setLastVoted(`+1 VOTO: ${p.sigla}`);
      setTimeout(() => setLastVoted(null), 1500);
    }
  };

  const handleEspecialWithFeedback = (type, delta) => {
    if (actaBloqueada) return;
    updateEspeciales(type, delta);
    if (delta > 0) {
      setLastVoted(`+1 VOTO ${type.toUpperCase()}`);
      setTimeout(() => setLastVoted(null), 1500);
    }
  };

  return (
    <div className="space-y-4 pb-24 p-3 sm:p-4">
      {/* Header con switch de modo y feedback */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Vote className="text-oep-primary" size={22} />
            Escrutinio y Conteo
          </h2>
          <p className="text-xs text-slate-500">
            Registro asistido papeleta a papeleta frente a delegados
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Silenciar clics sonoros" : "Activar clics sonoros"}
            className={`p-2 rounded-xl text-xs font-bold transition border ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                : 'bg-slate-100 text-slate-400 border-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Toggle modo */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setMode('grid')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                mode === 'grid'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setMode('live')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                mode === 'live'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🎤 Cantado
            </button>
          </div>
        </div>
      </div>

      {/* Alerta flotante de último voto cantado */}
      {lastVoted && (
        <div className="bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl text-center shadow-md animate-in fade-in zoom-in-95 duration-150 flex items-center justify-center gap-1.5">
          <Sparkles size={14} className="text-amber-300" />
          <span>{lastVoted}</span>
        </div>
      )}

      {/* Barra de progreso y totales en tiempo real */}
      <div className="bg-slate-900 text-white p-3.5 rounded-2xl shadow-lg border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Total Votos Escrutados
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {totals.totalAnfora} de {mesa.padronHabilitados} habilitados
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-black font-mono text-white tracking-tight">
            {totals.totalAnfora}
            <span className="text-xs font-semibold text-slate-400 ml-2">papeletas en ánfora</span>
          </div>
          <button
            onClick={() => setActiveScreen('results')}
            className="text-xs text-amber-300 hover:text-amber-200 underline font-semibold"
          >
            Ver Cuadre →
          </button>
        </div>

        {/* Barra segmentada */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800 text-center text-xs">
          <div className="bg-slate-800/80 p-1.5 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Válidos</span>
            <span className="font-black text-emerald-400 font-mono text-sm">{totals.totalValidos}</span>
          </div>
          <div className="bg-slate-800/80 p-1.5 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Blancos</span>
            <span className="font-black text-slate-300 font-mono text-sm">{totals.totalBlancos}</span>
          </div>
          <div className="bg-slate-800/80 p-1.5 rounded-lg">
            <span className="text-[10px] text-slate-400 block">Nulos</span>
            <span className="font-black text-red-400 font-mono text-sm">{totals.totalNulos}</span>
          </div>
        </div>
      </div>

      {/* Modo 1: Lista Clásica Ágil con Botones Grandes */}
      {mode === 'grid' && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Votos Válidos por Organización Política
          </h3>

          {partidos.map((partido) => (
            <div
              key={partido.id}
              className={`bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200 transition ${partido.franjaColor}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-white text-xs font-black"
                      style={{ backgroundColor: partido.color }}
                    >
                      {partido.sigla}
                    </span>
                    <h4 className="font-black text-slate-800 text-sm">{partido.nombre}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{partido.candidato}</p>
                </div>

                {/* Porcentaje sobre válidos */}
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {totals.totalValidos > 0
                    ? `${Math.round((partido.votos / totals.totalValidos) * 100)}%`
                    : '0%'}
                </span>
              </div>

              {/* Botonera de Conteo Táctil */}
              <div className="flex items-center justify-between pt-1">
                {/* Botón Restar */}
                <button
                  type="button"
                  onClick={() => handleVoteWithFeedback(partido.id, -1)}
                  disabled={partido.votos <= 0 || actaBloqueada}
                  className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-30 disabled:hover:bg-slate-100 text-slate-700 flex items-center justify-center transition border border-slate-200"
                >
                  <Minus size={20} />
                </button>

                {/* Input y Visualizador de Cifra */}
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min={0}
                    value={partido.votos}
                    onChange={(e) => setVoteDirect(partido.id, e.target.value)}
                    disabled={actaBloqueada}
                    className="w-24 text-center font-mono font-black text-2xl text-slate-900 bg-slate-50 border border-slate-300 focus:border-emerald-600 rounded-xl py-1 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                    {partido.votos === 1 ? '1 voto' : `${partido.votos} votos`}
                  </span>
                </div>

                {/* Botones de Suma Rápida (+1 y +5) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleVoteWithFeedback(partido.id, 5)}
                    disabled={actaBloqueada}
                    className="h-12 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-extrabold text-xs transition border border-slate-200"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVoteWithFeedback(partido.id, 1)}
                    disabled={actaBloqueada}
                    className="w-14 h-12 rounded-xl text-white font-black text-base flex items-center justify-center shadow-md active:scale-95 transition"
                    style={{ backgroundColor: partido.color }}
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Sección de Votos Especiales (Blancos y Nulos) */}
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider pt-2">
            Votos Especiales (Blancos y Nulos)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Votos Blancos */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-700 uppercase">Votos Blancos</span>
                <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></span>
              </div>
              <div className="text-center my-1">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {especiales.blancos}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-2">
                <button
                  onClick={() => handleEspecialWithFeedback('blancos', -1)}
                  disabled={especiales.blancos <= 0 || actaBloqueada}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => handleEspecialWithFeedback('blancos', 1)}
                  disabled={actaBloqueada}
                  className="flex-1 h-10 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
                >
                  <Plus size={16} /> Blanco
                </button>
              </div>
            </div>

            {/* Votos Nulos */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-red-700 uppercase">Votos Nulos</span>
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
              </div>
              <div className="text-center my-1">
                <span className="text-2xl font-black font-mono text-red-700">
                  {especiales.nulos}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 mt-2">
                <button
                  onClick={() => handleEspecialWithFeedback('nulos', -1)}
                  disabled={especiales.nulos <= 0 || actaBloqueada}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => handleEspecialWithFeedback('nulos', 1)}
                  disabled={actaBloqueada}
                  className="flex-1 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-95 transition"
                >
                  <Plus size={16} /> Nulo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modo 2: Cantado Papeleta a Papeleta (Full Screen Touch Deck) */}
      {mode === 'live' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <Radio size={16} className="text-amber-600 animate-pulse shrink-0" />
            <p>
              <strong>Modo Cantado Activo:</strong> Toque directamente la tarjeta del candidato que extraiga del ánfora para sumar inmediatamente 1 voto.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {partidos.map((partido) => (
              <button
                key={partido.id}
                type="button"
                onClick={() => handleVoteWithFeedback(partido.id, 1)}
                disabled={actaBloqueada}
                className="w-full text-left p-3.5 rounded-2xl text-white shadow-lg flex items-center justify-between transition transform active:scale-98"
                style={{ backgroundColor: partido.color }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black font-mono bg-black/25 px-3 py-1.5 rounded-xl border border-white/20">
                    {partido.sigla}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-base leading-tight">{partido.nombre}</h4>
                    <p className="text-xs text-white/80">{partido.candidato}</p>
                  </div>
                </div>

                <div className="text-right bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                  <span className="text-2xl font-black font-mono">{partido.votos}</span>
                  <span className="text-[10px] block text-white/90 font-bold uppercase">+1 Tocar</span>
                </div>
              </button>
            ))}

            {/* Fila para Blancos y Nulos en modo cantado */}
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleEspecialWithFeedback('blancos', 1)}
                disabled={actaBloqueada}
                className="bg-slate-700 hover:bg-slate-800 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between active:scale-98 transition"
              >
                <div>
                  <p className="font-bold text-xs uppercase">Voto Blanco</p>
                  <p className="text-[10px] text-slate-300">Sin marcar</p>
                </div>
                <span className="text-2xl font-mono font-black">{especiales.blancos}</span>
              </button>

              <button
                type="button"
                onClick={() => handleEspecialWithFeedback('nulos', 1)}
                disabled={actaBloqueada}
                className="bg-red-700 hover:bg-red-800 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between active:scale-98 transition"
              >
                <div>
                  <p className="font-bold text-xs uppercase">Voto Nulo</p>
                  <p className="text-[10px] text-red-200">Marcas inválidas</p>
                </div>
                <span className="text-2xl font-mono font-black">{especiales.nulos}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botón flotante para avanzar al Cuadre */}
      <div className="pt-2">
        <button
          onClick={() => setActiveScreen('results')}
          className="w-full py-3.5 px-4 bg-oep-primary hover:bg-oep-secondary text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform active:scale-98"
        >
          <CheckCircle2 size={18} className="text-amber-300" />
          Finalizar Escrutinio y Pasar al Cuadre
        </button>
      </div>
    </div>
  );
}
