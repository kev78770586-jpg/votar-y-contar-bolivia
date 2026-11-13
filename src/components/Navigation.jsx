import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  Menu,
  X,
  Vote,
  Calculator,
  FileCheck2,
  PenTool,
  PackageCheck,
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  History,
  LogOut,
  ShieldCheck,
  Smartphone,
  Maximize2,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function Navigation() {
  const {
    activeScreen,
    setActiveScreen,
    currentUser,
    logout,
    mesa,
    totals,
    viewMode,
    setViewMode,
    soundEnabled,
    setSoundEnabled,
    offlineMode,
    setOfflineMode
  } = useElectoral();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const screens = [
    { id: 'dashboard', label: '1. Panel Principal', icon: LayoutDashboard },
    { id: 'mesainfo', label: '2. Información de Mesa', icon: Building2 },
    { id: 'counting', label: '3. Conteo Asistido', icon: Vote, badge: totals.totalAnfora },
    { id: 'results', label: '4. Suma y Cuadre', icon: Calculator },
    { id: 'acta', label: '5. Generación de Actas', icon: FileCheck2 },
    { id: 'validation', label: '6. Revisión y Validación', icon: FileSpreadsheet },
    { id: 'signatures', label: '7. Gestión de Firmas', icon: PenTool },
    { id: 'delivery', label: '8. Entrega de Materiales', icon: PackageCheck },
    { id: 'history', label: '9. Historial y Reportes', icon: History }
  ];

  const handleSelectScreen = (id) => {
    setActiveScreen(id);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-oep-dark text-white px-3 py-2.5 shadow-md flex items-center justify-between border-b border-emerald-800/60">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition text-emerald-200 hover:text-white"
            aria-label="Menú principal"
          >
            <Menu size={22} />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-black text-xs tracking-tight text-white uppercase">
                Votar y Contar
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.2 rounded font-mono">
                Mesa {mesa.numeroMesa}
              </span>
            </div>
            <p className="text-[10px] text-emerald-300/80 truncate max-w-[170px] sm:max-w-xs">
              {mesa.recinto.split('(')[0]}
            </p>
          </div>
        </div>

        {/* Action icons on header */}
        <div className="flex items-center gap-1">
          {/* Offline indicator */}
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            title={offlineMode ? "Modo Offline Activo" : "Conexión Activa"}
            className={`p-1.5 rounded-lg text-xs transition ${
              offlineMode ? 'text-amber-400 bg-amber-950/60' : 'text-emerald-400 bg-emerald-950/40'
            }`}
          >
            {offlineMode ? <WifiOff size={16} /> : <Wifi size={16} />}
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 text-xs transition"
            title={soundEnabled ? "Silenciar" : "Activar sonido"}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* View Mode Toggle (Frame vs Full) */}
          <button
            onClick={() => setViewMode(viewMode === 'mobile' ? 'fullscreen' : 'mobile')}
            className="hidden sm:flex p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 text-xs transition items-center gap-1"
            title={viewMode === 'mobile' ? "Pantalla completa" : "Marco smartphone"}
          >
            {viewMode === 'mobile' ? <Maximize2 size={16} /> : <Smartphone size={16} />}
          </button>
        </div>
      </header>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-gradient-to-br from-oep-dark to-slate-900 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-amber-300 font-bold">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-extrabold text-sm text-white">Votar y Contar</p>
                <p className="text-[10px] text-emerald-300">Jurados Electorales Bolivia</p>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current User Card */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
            <p className="font-bold text-white leading-tight">{currentUser?.nombre}</p>
            <p className="text-[11px] text-amber-400 font-semibold">{currentUser?.cargo}</p>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              CI: {currentUser?.ci} • Mesa {mesa.numeroMesa}
            </p>
          </div>
        </div>

        {/* Navigation Screen Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1">
            Pantallas de la Aplicación
          </p>
          {screens.map((s) => {
            const Icon = s.icon;
            const isActive = activeScreen === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleSelectScreen(s.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-700 to-oep-primary text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-amber-300' : 'text-slate-400'} />
                  <span>{s.label}</span>
                </div>
                {s.badge !== undefined && (
                  <span className="font-mono text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-emerald-400">
                    {s.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer with Logout */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <button
            onClick={() => {
              setDrawerOpen(false);
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-red-950/50 hover:bg-red-900/60 border border-red-800/40 text-red-200 rounded-xl text-xs font-bold transition"
          >
            <LogOut size={15} />
            <span>Cerrar Sesión del Jurado</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center font-mono">
            Versión 1.0.0 • OEP Bolivia 2026
          </p>
        </div>
      </div>

      {/* Bottom Dock / Fast Access Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-2 flex justify-around items-center max-w-md mx-auto shadow-lg">
        {/* Dashboard */}
        <button
          onClick={() => setActiveScreen('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeScreen === 'dashboard' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard size={20} className={activeScreen === 'dashboard' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Panel</span>
        </button>

        {/* Conteo */}
        <button
          onClick={() => setActiveScreen('counting')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition relative ${
            activeScreen === 'counting' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Vote size={20} className={activeScreen === 'counting' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Conteo</span>
          {totals.totalAnfora > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        {/* Cuadre */}
        <button
          onClick={() => setActiveScreen('results')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeScreen === 'results' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calculator size={20} className={activeScreen === 'results' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Cuadre</span>
        </button>

        {/* Acta */}
        <button
          onClick={() => setActiveScreen('acta')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeScreen === 'acta' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 size={20} className={activeScreen === 'acta' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Acta</span>
        </button>

        {/* Firmas */}
        <button
          onClick={() => setActiveScreen('signatures')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeScreen === 'signatures' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PenTool size={20} className={activeScreen === 'signatures' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Firmas</span>
        </button>

        {/* Entrega */}
        <button
          onClick={() => setActiveScreen('delivery')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition ${
            activeScreen === 'delivery' ? 'text-emerald-700 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PackageCheck size={20} className={activeScreen === 'delivery' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] mt-0.5">Entrega</span>
        </button>
      </nav>
    </>
  );
}
