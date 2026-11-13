import React, { useState } from 'react';
import { useElectoral } from '../context/ElectoralContext';
import { DEPARTAMENTOS_BOLIVIA } from '../data/initialData';
import {
  Building2,
  Users,
  Clock,
  FileText,
  MapPin,
  CheckCircle,
  Save,
  Shield,
  PhoneCall
} from 'lucide-react';

export default function MesaInfoScreen() {
  const { mesa, updateMesa, jurados } = useElectoral();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...mesa });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    Object.keys(formData).forEach(key => {
      updateMesa(key, formData[key]);
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 pb-20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Building2 className="text-oep-primary" size={22} />
            Información de la Mesa
          </h2>
          <p className="text-xs text-slate-500">
            Datos jurisdiccionales y padrón electoral acreditado
          </p>
        </div>
        <button
          onClick={() => {
            if (isEditing) handleSave();
            else setIsEditing(true);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
            isEditing
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
          }`}
        >
          {isEditing ? <Save size={14} /> : <FileText size={14} />}
          {isEditing ? 'Guardar Cambios' : 'Modificar'}
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>Datos de la mesa actualizados correctamente en el sistema local.</span>
        </div>
      )}

      {/* Tarjeta de Localización Electoral */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-oep-primary uppercase tracking-wider pb-2 border-b border-slate-100">
          <MapPin size={16} />
          <span>Jurisdicción Electoral (OEP)</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Departamento</label>
            {isEditing ? (
              <select
                value={formData.departamento}
                onChange={(e) => handleChange('departamento', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
              >
                {DEPARTAMENTOS_BOLIVIA.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : (
              <p className="font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {mesa.departamento}
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Circunscripción</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.circunscripcion}
                onChange={(e) => handleChange('circunscripcion', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
              />
            ) : (
              <p className="font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {mesa.circunscripcion}
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Provincia</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.provincia}
                onChange={(e) => handleChange('provincia', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
              />
            ) : (
              <p className="font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {mesa.provincia}
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Municipio</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.municipio}
                onChange={(e) => handleChange('municipio', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
              />
            ) : (
              <p className="font-bold text-slate-800 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {mesa.municipio}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Recinto Electoral y Ubicación</label>
          {isEditing ? (
            <textarea
              rows={2}
              value={formData.recinto}
              onChange={(e) => handleChange('recinto', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
            />
          ) : (
            <p className="font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
              {mesa.recinto}
            </p>
          )}
        </div>
      </div>

      {/* Padrón y Papeletas */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-oep-primary uppercase tracking-wider pb-2 border-b border-slate-100">
          <Shield size={16} />
          <span>Control Cuantitativo de Material</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              Padrón de Habilitados
            </span>
            {isEditing ? (
              <input
                type="number"
                value={formData.padronHabilitados}
                onChange={(e) => handleChange('padronHabilitados', Number(e.target.value))}
                className="w-full bg-white border border-emerald-300 rounded-lg p-1.5 font-bold font-mono text-lg mt-1"
              />
            ) : (
              <p className="text-xl font-black text-emerald-950 font-mono mt-0.5">
                {mesa.padronHabilitados} <span className="text-xs font-normal text-emerald-700">ciudadanos</span>
              </p>
            )}
            <span className="text-[10px] text-emerald-700">Lista Índice Oficial</span>
          </div>

          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              Papeletas Recibidas
            </span>
            {isEditing ? (
              <input
                type="number"
                value={formData.papeletasRecibidas}
                onChange={(e) => handleChange('papeletasRecibidas', Number(e.target.value))}
                className="w-full bg-white border border-amber-300 rounded-lg p-1.5 font-bold font-mono text-lg mt-1"
              />
            ) : (
              <p className="text-xl font-black text-amber-950 font-mono mt-0.5">
                {mesa.papeletasRecibidas} <span className="text-xs font-normal text-amber-700">papeletas</span>
              </p>
            )}
            <span className="text-[10px] text-amber-700">En maleta electoral</span>
          </div>
        </div>

        <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Rango de Serie de Papeletas</span>
          <p className="font-mono font-bold text-slate-700 text-xs mt-0.5">{mesa.seriePapeletas}</p>
        </div>

        {/* Horarios */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={16} className="text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Instalación y Apertura</p>
              <p className="font-bold">{mesa.horaApertura}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={16} className="text-amber-600" />
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Cierre de Votación</p>
              <p className="font-bold">{mesa.horaCierre}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Nómina de Jurados Designados */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold text-oep-primary uppercase tracking-wider">
            <Users size={16} />
            <span>Nómina de Jurados Acreditados ({jurados.length})</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Quórum Completo
          </span>
        </div>

        <div className="space-y-2">
          {jurados.map((j) => (
            <div
              key={j.id}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-slate-900">{j.nombre}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="font-semibold text-oep-secondary">{j.cargo}</span>
                  <span>•</span>
                  <span className="font-mono">CI: {j.ci}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-block">
                  Presente
                </span>
                <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-1">
                  <PhoneCall size={10} /> {j.telefono}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
