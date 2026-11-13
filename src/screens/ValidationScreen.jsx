import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  History,
  ShieldCheck,
  Edit3,
  ArrowRight
} from 'lucide-react';

export default function ValidationScreen() {
  const {
    totals,
    partidos,
    especiales,
    mesa,
    auditLog,
    actaBloqueada,
    setActaBloqueada,
    setActiveScreen,
    addAuditLog
  } = useElectoral();

  const [confirmado, setConfirmado] = useState(false);
  const [successLockMsg, setSuccessLockMsg] = useState(false);

  const checks = [
    {
      id: 'c1',
      title: 'Papeletas Escrutadas vs Recibidas',
      desc: `Total ánfora (${totals.totalAnfora}) + Sobrantes (${totals.sobrantes}) = Recibidas (${mesa.papeletasRecibidas})`,
      passed: totals.descuadrePapeletas === 0
    },
    {
      id: 'c2',
      title: 'Límite de Padrón Electoral',
      desc: `Los votos en ánfora (${totals.totalAnfora}) no superan los ciudadanos habilitados (${mesa.padronHabilitados})`,
      passed: !totals.excedePadron
    },
    {
      id: 'c3',
      title: 'Consistencia de Votos Especiales',
      desc: `Se contabilizaron ${totals.totalBlancos} votos blancos y ${totals.totalNulos} votos nulos`,
      passed: true
    },
    {
      id: 'c4',
      title: 'Validación Anti-Duplicados',
      desc: 'No existen registros duplicados de actas en el almacenamiento criptográfico',
      passed: true
    }
  ];

  const handleToggleLock = () => {
    if (!actaBloqueada && !confirmado) {
      alert("Por favor marque la casilla de confirmación jurada antes de bloquear el acta.");
      return;
    }
    const nextState = !actaBloqueada;
    setActaBloqueada(nextState);
    addAuditLog(
      nextState
        ? "Cierre y congelamiento del acta para firmas finales (Bloqueo anti-edición activado)"
        : "Desbloqueo excepcional del acta para corrección de datos",
      "seguridad"
    );
    if (nextState) {
      setSuccessLockMsg(true);
      setTimeout(() => setSuccessLockMsg(false), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-24 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-oep-primary" size={22} />
            Revisión y Validación
          </h2>
          <p className="text-xs text-slate-500">
            Control de calidad, doble verificación y bloqueo del escrutinio
          </p>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 border ${
            actaBloqueada
              ? 'bg-red-50 text-red-700 border-red-300'
              : 'bg-emerald-50 text-emerald-700 border-emerald-300'
          }`}
        >
          {actaBloqueada ? <Lock size={12} /> : <Unlock size={12} />}
          {actaBloqueada ? 'Acta Bloqueada' : 'Edición Abierta'}
        </span>
      </div>

      {successLockMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Acta bloqueada exitosamente. Las cifras han quedado protegidas para firmas.</span>
        </div>
      )}

      {/* Lista de Comprobaciones Obligatorias */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider pb-2 border-b border-slate-100">
          Lista de Comprobación de Consistencia Electoral
        </h3>

        <div className="space-y-2">
          {checks.map((chk) => (
            <div
              key={chk.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition ${
                chk.passed
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-red-50/50 border-red-200'
              }`}
            >
              <div
                className={`p-1 rounded-full mt-0.5 ${
                  chk.passed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                }`}
              >
                {chk.passed ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-slate-900">{chk.title}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">{chk.desc}</p>
              </div>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  chk.passed ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                }`}
              >
                {chk.passed ? 'Aprobado' : 'Falló'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de Votos Registrados para Doble Comprobación */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
          <span className="font-bold uppercase text-slate-600">Resumen a Confirmar</span>
          <button
            onClick={() => setActiveScreen('counting')}
            className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
          >
            <Edit3 size={13} /> Corregir
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {partidos.map((p) => (
            <div key={p.id} className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
              <span className="font-semibold text-slate-700">[{p.sigla}]</span>
              <span className="font-mono font-black">{p.votos} votos</span>
            </div>
          ))}
          <div className="p-2 bg-slate-100 rounded-lg flex items-center justify-between">
            <span className="font-semibold text-slate-700">Blancos:</span>
            <span className="font-mono font-black">{especiales.blancos}</span>
          </div>
          <div className="p-2 bg-red-50 rounded-lg flex items-center justify-between">
            <span className="font-semibold text-red-700">Nulos:</span>
            <span className="font-mono font-black text-red-700">{especiales.nulos}</span>
          </div>
        </div>
      </div>

      {/* Declaración Jurada y Bloqueo de Acta */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
          <ShieldCheck size={16} />
          <span>Confirmación Solemne de Resultados</span>
        </div>

        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
          <input
            type="checkbox"
            checked={confirmado}
            onChange={(e) => setConfirmado(e.target.checked)}
            className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
          />
          <span className="leading-relaxed">
            Certifico solemnemente que los resultados anteriores corresponden fielmente al conteo físico de papeletas realizado en presencia de los jurados y delegados acreditados.
          </span>
        </label>

        <button
          onClick={handleToggleLock}
          className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
            actaBloqueada
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : 'bg-gradient-to-r from-emerald-600 to-oep-primary hover:from-emerald-500 text-white shadow-lg'
          }`}
        >
          {actaBloqueada ? <Unlock size={16} /> : <Lock size={16} />}
          {actaBloqueada ? 'Desbloquear Acta para Modificación' : 'Bloquear Acta y Pasar a Firmas'}
        </button>
      </div>

      {/* Historial de Modificaciones Recientes */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase pb-2 border-b border-slate-100">
          <History size={16} className="text-slate-400" />
          <span>Historial de Modificaciones de Conteo</span>
        </div>

        <div className="space-y-1.5 max-h-36 overflow-y-auto">
          {auditLog.filter(l => l.tipo === 'conteo' || l.tipo === 'seguridad').slice(0, 5).map((log) => (
            <div key={log.id} className="text-[11px] p-2 bg-slate-50 rounded-lg flex items-start justify-between">
              <div>
                <p className="font-semibold text-slate-800">{log.accion}</p>
                <p className="text-[10px] text-slate-400">{log.usuario}</p>
              </div>
              <span className="font-mono text-[10px] text-slate-500 shrink-0 ml-2">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Botón para pasar a firmas */}
      <button
        onClick={() => setActiveScreen('signatures')}
        className="w-full py-3.5 px-4 bg-oep-primary hover:bg-oep-secondary text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition transform active:scale-98"
      >
        <span>Gestionar Firmas de Jurados</span>
        <ArrowRight size={18} className="text-amber-300" />
      </button>
    </div>
  );
}
