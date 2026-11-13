import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import {
  History,
  TrendingUp,
  Download,
  Upload,
  RotateCcw,
  Shield,
  FileText,
  Clock,
  Sparkles,
  BarChart3,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

export default function HistoryReportsScreen() {
  const {
    auditLog,
    totals,
    partidos,
    mesa,
    jurados,
    resetToDemo,
    addAuditLog
  } = useElectoral();

  const [filterType, setFilterType] = useState('all');
  const [backupSuccess, setBackupSuccess] = useState(false);

  const filteredLogs = auditLog.filter(log => {
    if (filterType === 'all') return true;
    return log.tipo === filterType;
  });

  const handleExportBackup = () => {
    const fullState = {
      mesa: localStorage.getItem('oep_mesa_data'),
      partidos: localStorage.getItem('oep_partidos_data'),
      especiales: localStorage.getItem('oep_especiales_data'),
      jurados: localStorage.getItem('oep_jurados_data'),
      materiales: localStorage.getItem('oep_materiales_data'),
      entrega: localStorage.getItem('oep_entrega_data'),
      auditLog: localStorage.getItem('oep_audit_log'),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Electoral_Mesa_${mesa.numeroMesa}_${new Date().toISOString().substring(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addAuditLog("Copia de seguridad del sistema exportada en formato JSON seguro.", "seguridad");
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 3000);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result);
        if (data.mesa) localStorage.setItem('oep_mesa_data', data.mesa);
        if (data.partidos) localStorage.setItem('oep_partidos_data', data.partidos);
        if (data.especiales) localStorage.setItem('oep_especiales_data', data.especiales);
        if (data.jurados) localStorage.setItem('oep_jurados_data', data.jurados);
        if (data.materiales) localStorage.setItem('oep_materiales_data', data.materiales);
        if (data.entrega) localStorage.setItem('oep_entrega_data', data.entrega);
        if (data.auditLog) localStorage.setItem('oep_audit_log', data.auditLog);
        alert('✓ Copia de seguridad restaurada con éxito. La página se recargará.');
        window.location.reload();
      } catch (err) {
        alert('Archivo de copia de seguridad no válido o dañado.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 pb-24 p-3 sm:p-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <History className="text-oep-primary" size={22} />
          Historial, Auditoría y Reportes
        </h2>
        <p className="text-xs text-slate-500">
          Trazabilidad criptográfica, bitácora de eventos y respaldo de datos
        </p>
      </div>

      {backupSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Copia de seguridad JSON descargada exitosamente en su dispositivo.</span>
        </div>
      )}

      {/* Gráfico de Distribución Visual */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <BarChart3 size={16} className="text-emerald-700" />
            Reporte Gráfico del Escrutinio
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            Total {totals.totalAnfora} votos
          </span>
        </div>

        <div className="space-y-2">
          {partidos.map((p) => {
            const pct = totals.totalAnfora > 0 ? ((p.votos / totals.totalAnfora) * 100).toFixed(1) : 0;
            return (
              <div key={p.id}>
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="font-bold text-slate-700">[{p.sigla}] {p.nombre.split(' ')[0]}</span>
                  <span className="font-mono font-black">{p.votos} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: p.color }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bitácora de Auditoría (Audit Log) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
            <Clock size={16} className="text-amber-600" />
            Bitácora de Eventos de la Mesa
          </span>
          <span className="text-[10px] text-slate-400">Total: {auditLog.length}</span>
        </div>

        {/* Filtros */}
        <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
          {['all', 'conteo', 'firma', 'materiales', 'seguridad'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 rounded-lg capitalize font-bold transition whitespace-nowrap ${
                filterType === f
                  ? 'bg-oep-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>

        {/* Lista de Registros */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {filteredLogs.map((log) => {
            let badgeBg = "bg-slate-100 text-slate-600";
            if (log.tipo === 'conteo') badgeBg = "bg-blue-100 text-blue-800";
            if (log.tipo === 'firma') badgeBg = "bg-emerald-100 text-emerald-800";
            if (log.tipo === 'materiales') badgeBg = "bg-amber-100 text-amber-800";
            if (log.tipo === 'seguridad') badgeBg = "bg-purple-100 text-purple-800";

            return (
              <div
                key={log.id}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 hover:bg-slate-100/70 transition"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${badgeBg}`}>
                    {log.tipo}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">{log.timestamp}</span>
                </div>
                <p className="font-semibold text-slate-800 text-[11px] leading-snug">{log.accion}</p>
                <p className="text-[10px] text-slate-400 font-mono">Usuario: {log.usuario}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Copia de Seguridad y Restauración */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
          <HardDrive size={16} />
          <span>Copias de Seguridad y Respaldo Local</span>
        </div>
        <p className="text-xs text-slate-300">
          Todos los datos de la mesa están almacenados de forma cifrada en la memoria local de su dispositivo. Puede exportar un archivo de respaldo o restaurar una copia previa.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
          >
            <Download size={15} />
            Exportar Backup JSON
          </button>

          <label className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-slate-700 text-center">
            <Upload size={15} />
            <span>Importar Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>
        </div>

        {/* Reiniciar a Demo */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={resetToDemo}
            className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-slate-800 transition"
          >
            <RotateCcw size={14} />
            Reiniciar a Datos de Demostración Iniciales
          </button>
        </div>
      </div>
    </div>
  );
}
