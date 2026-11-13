import React, { useState, useEffect } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  RotateCcw,
  Wifi,
  Battery,
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function MobileFrame({ children }) {
  const {
    viewMode,
    setViewMode,
    mesa,
    resetToDemo,
    offlineMode,
    currentUser
  } = useElectoral();

  const [currentTime, setCurrentTime] = useState('17:45');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (viewMode === 'fullscreen') {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center">
        <div className="w-full max-w-lg min-h-screen bg-slate-100 flex flex-col relative shadow-2xl">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-2 sm:p-6 flex flex-col items-center justify-center font-sans">
      {/* Desktop Controller Toolbar */}
      <header className="w-full max-w-md sm:max-w-2xl mb-4 flex flex-wrap items-center justify-between gap-2 bg-slate-800/80 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-xl text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-oep-primary flex items-center justify-center shadow">
            <ShieldCheck size={20} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h1 className="font-black text-sm text-white tracking-tight">
                Votar y Contar – Jurados Electorales
              </h1>
            </div>
            <p className="text-[11px] text-emerald-300">
              Aplicación Móvil Asistida • Órgano Electoral Plurinacional (Bolivia)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToDemo}
            className="px-3 py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-600/60 transition"
            title="Cargar datos de ejemplo"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Datos Demo</span>
          </button>

          <button
            onClick={() => setViewMode('fullscreen')}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition"
            title="Ver en pantalla completa"
          >
            <Maximize2 size={13} />
            <span className="hidden sm:inline">Pantalla Completa</span>
          </button>
        </div>
      </header>

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-full max-w-[410px] h-[855px] bg-slate-950 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-[4px] border-slate-700/60 ring-1 ring-white/10 flex flex-col justify-between">
        {/* Outer buttons aesthetic simulation */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-slate-600 rounded-l-md"></div>
        <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-slate-600 rounded-l-md"></div>
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-slate-600 rounded-r-md"></div>

        {/* Screen Bezel & Container */}
        <div className="w-full h-full bg-slate-100 rounded-[40px] overflow-hidden flex flex-col relative shadow-inner">
          {/* Smartphone Status Bar */}
          <div className="bg-oep-dark text-white px-6 pt-3 pb-1 flex items-center justify-between text-xs select-none z-50">
            {/* Clock */}
            <span className="font-semibold font-mono text-[11px] tracking-tight text-white/90">
              {currentTime}
            </span>

            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto flex items-center justify-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
              <span className="w-2 h-2 rounded-full bg-slate-800"></span>
            </div>

            {/* Icons: WiFi, Signal, Battery */}
            <div className="flex items-center gap-1.5 text-white/80">
              <span className="text-[10px] font-bold font-mono">5G</span>
              {offlineMode ? <span className="text-[10px] text-amber-400 font-bold">OFF</span> : <Wifi size={12} />}
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-mono">98%</span>
                <Battery size={13} className="text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Content Container with Smooth Scroll */}
          <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 relative">
            {children}
          </main>

          {/* Smartphone Bottom Home Bar */}
          <div className="h-4 bg-white flex items-center justify-center select-none pointer-events-none">
            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <footer className="mt-3 text-center text-xs text-slate-400 font-medium">
        <p>
          Simulador móvil de jurados electorales • Conforme al protocolo del Órgano Electoral Plurinacional de Bolivia
        </p>
      </footer>
    </div>
  );
}
