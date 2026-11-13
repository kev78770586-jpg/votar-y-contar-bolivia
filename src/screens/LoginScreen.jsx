import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  QrCode,
  CheckCircle,
  AlertCircle,
  FileText,
  WifiOff,
  Sparkles
} from 'lucide-react';

export default function LoginScreen() {
  const { login, offlineMode, setOfflineMode } = useElectoral();

  const [ci, setCi] = useState('4839201');
  const [expedicion, setExpedicion] = useState('LP');
  const [mesaNum, setMesaNum] = useState('14');
  const [cargo, setCargo] = useState('Presidente(a) de Mesa');
  const [pin, setPin] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanningQR, setIsScanningQR] = useState(false);

  const roles = [
    { id: 'pres', label: 'Presidente(a) de Mesa', desc: 'Máxima autoridad de la mesa' },
    { id: 'sec', label: 'Secretario(a) de Mesa', desc: 'Custodia de actas y cómputo' },
    { id: 'voc1', label: 'Vocal 1 (Control de Padrón)', desc: 'Revisión de lista índice' },
    { id: 'voc2', label: 'Vocal 2 (Entrega Papeletas)', desc: 'Revisión y firma de papeletas' },
    { id: 'voc3', label: 'Vocal 3 (Tinta Indeleble)', desc: 'Entintado y entrega de certificado' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!ci.trim()) {
      setErrorMsg('Debe ingresar su número de Cédula de Identidad.');
      return;
    }
    if (!mesaNum.trim()) {
      setErrorMsg('Debe especificar el número de mesa asignada.');
      return;
    }
    if (!pin || pin.length < 4) {
      setErrorMsg('Ingrese el PIN de seguridad de 4 dígitos proporcionado en su notificación.');
      return;
    }

    // Determine default name according to role
    let nombre = 'Andrea Ximena Choque Vargas';
    if (cargo.includes('Secretario')) nombre = 'Marco Antonio Flores Torrico';
    if (cargo.includes('Vocal 1')) nombre = 'Carmen Rosa Gutiérrez Nina';
    if (cargo.includes('Vocal 2')) nombre = 'José Luis Quispe Mamani';
    if (cargo.includes('Vocal 3')) nombre = 'Sandra Beatriz Morales Paz';

    login({
      ci: `${ci.trim()} ${expedicion}`,
      nombre: `Lic. ${nombre}`,
      cargo,
      mesaNumero: mesaNum.trim(),
      rol: cargo.toLowerCase().includes('presidente') ? 'presidente' : 'jurado'
    });
  };

  const handleSimulateQRScan = () => {
    setIsScanningQR(true);
    setTimeout(() => {
      setCi('4839201');
      setExpedicion('LP');
      setMesaNum('14');
      setCargo('Presidente(a) de Mesa');
      setPin('1234');
      setIsScanningQR(false);
      alert('✓ Credencial OEP escaneada exitosamente: Mesa 14 - Recinto San Calixto.');
    }, 1200);
  };

  return (
    <div className="min-h-full bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Brand Banner */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-oep-primary shadow-lg shadow-emerald-950/60 border border-emerald-400/30 mb-3">
          <ShieldCheck size={36} className="text-amber-400" />
        </div>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
          <span className="text-[10px] tracking-widest uppercase font-black text-amber-400/90 ml-1">
            ESTADO PLURINACIONAL DE BOLIVIA
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Votar y Contar
        </h1>
        <p className="text-xs text-emerald-300/80 font-medium">
          Sistema Asistido para Jurados Electorales de Mesa
        </p>
      </div>

      {/* Main Login Card */}
      <div className="my-4 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-emerald-600/30 p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/80 mb-4">
          <div className="flex items-center gap-2">
            <UserCheck className="text-emerald-400" size={18} />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Acceso de Jurado Electoral
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOfflineMode(!offlineMode)}
            className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold border ${
              offlineMode
                ? 'bg-amber-950/60 text-amber-300 border-amber-600/40'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/40'
            }`}
          >
            {offlineMode ? <WifiOff size={11} /> : <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
            {offlineMode ? 'Modo Offline' : 'En Línea / Resiliente'}
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-500/50 rounded-xl flex items-center gap-2 text-xs text-red-200">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Cédula y Expedición */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
              Cédula de Identidad (CI)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                placeholder="Ej. 4839201"
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <select
                value={expedicion}
                onChange={(e) => setExpedicion(e.target.value)}
                className="w-20 bg-slate-900 border border-slate-700 text-white text-xs font-bold rounded-xl px-2 py-2 focus:outline-none focus:border-emerald-500"
              >
                <option value="LP">LP</option>
                <option value="SC">SC</option>
                <option value="CB">CB</option>
                <option value="CH">CH</option>
                <option value="OR">OR</option>
                <option value="PT">PT</option>
                <option value="TJ">TJ</option>
                <option value="BN">BN</option>
                <option value="PA">PA</option>
              </select>
            </div>
          </div>

          {/* Número de Mesa y PIN */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                Nº de Mesa
              </label>
              <input
                type="number"
                value={mesaNum}
                onChange={(e) => setMesaNum(e.target.value)}
                placeholder="14"
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold font-mono text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                PIN Notificación (4d)
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono tracking-widest text-center"
                />
                <Lock size={13} className="absolute right-3 top-3 text-slate-500" />
              </div>
            </div>
          </div>

          {/* Cargo del jurado */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
              Cargo Designado en Mesa
            </label>
            <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {roles.map(r => (
                <option key={r.id} value={r.label}>
                  {r.label} — {r.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de Acceso Principal */}
          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-oep-primary hover:from-emerald-500 hover:to-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition transform active:scale-98"
          >
            <CheckCircle size={18} className="text-amber-300" />
            Ingresar al Panel Electoral
          </button>
        </form>

        {/* Separador */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-700 w-full"></div>
          <span className="bg-slate-800 px-3 text-[10px] text-slate-400 uppercase tracking-widest font-semibold absolute">
            o autenticación rápida
          </span>
        </div>

        {/* Lector QR OEP */}
        <button
          type="button"
          onClick={handleSimulateQRScan}
          disabled={isScanningQR}
          className="w-full py-2.5 px-3 bg-slate-900/90 hover:bg-slate-900 border border-slate-700 hover:border-amber-500/60 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition"
        >
          <QrCode size={16} className={isScanningQR ? "animate-spin text-amber-400" : "text-amber-400"} />
          {isScanningQR ? 'Escaneando credencial OEP...' : 'Escanear Credencial OEP con QR'}
        </button>
      </div>

      {/* Advertencia Legal Institucional */}
      <div className="text-[11px] text-slate-400/90 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-tight space-y-1">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[10px]">
          <FileText size={12} />
          <span>Consideración Legal y Normativa</span>
        </div>
        <p>
          Esta aplicación funciona exclusivamente como <strong>herramienta de apoyo administrativo</strong> para jurados de mesa. No sustituye las papeletas físicas ni las actas oficiales del Tribunal Supremo Electoral (TSE - Ley Nº 026).
        </p>
      </div>
    </div>
  );
}
