import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_MESA,
  INITIAL_PARTIDOS,
  INITIAL_ESPECIALES,
  INITIAL_JURADOS,
  INITIAL_MATERIALES,
  INITIAL_ENTREGA,
  INITIAL_AUDIT_LOG
} from '../data/initialData';

const ElectoralContext = createContext(null);

export function ElectoralProvider({ children }) {
  // Persistence via localStorage: default to null so first-time visitors see LoginScreen
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('oep_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [mesa, setMesa] = useState(() => {
    const saved = localStorage.getItem('oep_mesa_data');
    return saved ? JSON.parse(saved) : INITIAL_MESA;
  });

  const [partidos, setPartidos] = useState(() => {
    const saved = localStorage.getItem('oep_partidos_data');
    return saved ? JSON.parse(saved) : INITIAL_PARTIDOS;
  });

  const [especiales, setEspeciales] = useState(() => {
    const saved = localStorage.getItem('oep_especiales_data');
    return saved ? JSON.parse(saved) : INITIAL_ESPECIALES;
  });

  const [jurados, setJurados] = useState(() => {
    const saved = localStorage.getItem('oep_jurados_data');
    return saved ? JSON.parse(saved) : INITIAL_JURADOS;
  });

  const [materiales, setMateriales] = useState(() => {
    const saved = localStorage.getItem('oep_materiales_data');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALES;
  });

  const [entrega, setEntrega] = useState(() => {
    const saved = localStorage.getItem('oep_entrega_data');
    return saved ? JSON.parse(saved) : INITIAL_ENTREGA;
  });

  const [auditLog, setAuditLog] = useState(() => {
    const saved = localStorage.getItem('oep_audit_log');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOG;
  });

  // Current active screen: default to dashboard if logged in, else login
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'fullscreen'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [actaBloqueada, setActaBloqueada] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('oep_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('oep_mesa_data', JSON.stringify(mesa));
  }, [mesa]);

  useEffect(() => {
    localStorage.setItem('oep_partidos_data', JSON.stringify(partidos));
  }, [partidos]);

  useEffect(() => {
    localStorage.setItem('oep_especiales_data', JSON.stringify(especiales));
  }, [especiales]);

  useEffect(() => {
    localStorage.setItem('oep_jurados_data', JSON.stringify(jurados));
  }, [jurados]);

  useEffect(() => {
    localStorage.setItem('oep_materiales_data', JSON.stringify(materiales));
  }, [materiales]);

  useEffect(() => {
    localStorage.setItem('oep_entrega_data', JSON.stringify(entrega));
  }, [entrega]);

  useEffect(() => {
    localStorage.setItem('oep_audit_log', JSON.stringify(auditLog));
  }, [auditLog]);

  // Audio feedback helper
  const playBeep = (freq = 600, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // AudioContext could be restricted or not yet allowed
    }
  };

  // Calculations for Totals and Mathematical Balancing
  const totalValidos = partidos.reduce((acc, p) => acc + (Number(p.votos) || 0), 0);
  const totalBlancos = Number(especiales.blancos) || 0;
  const totalNulos = Number(especiales.nulos) || 0;
  const totalAnfora = totalValidos + totalBlancos + totalNulos;
  
  // Papeletas recibidas vs Papeletas sobrantes
  // Balance: Papeletas Recibidas = Total Anfora + Papeletas Sobrantes
  const papeletasRecibidas = Number(mesa.papeletasRecibidas) || 240;
  const sobrantes = Math.max(0, papeletasRecibidas - totalAnfora);
  const votantesListaIndice = totalAnfora; // En una mesa perfecta coincide con los votantes que acudieron

  // Discrepancy analysis
  const descuadrePapeletas = (totalAnfora + sobrantes) - papeletasRecibidas;
  const excedePadron = totalAnfora > (Number(mesa.padronHabilitados) || 0);

  const statusCuadre = (() => {
    if (excedePadron) return { status: 'ERROR', mensaje: 'Peligro: Total de votos en ánfora excede el padrón de inscritos.' };
    if (descuadrePapeletas !== 0) return { status: 'ADVERTENCIA', mensaje: `Diferencia de ${Math.abs(descuadrePapeletas)} papeleta(s) con respecto a las recibidas.` };
    return { status: 'CORRECTO', mensaje: 'Mesa completamente cuadrada. No hay discrepancias.' };
  })();

  const totals = {
    totalValidos,
    totalBlancos,
    totalNulos,
    totalAnfora,
    sobrantes,
    votantesListaIndice,
    papeletasRecibidas,
    descuadrePapeletas,
    excedePadron,
    statusCuadre
  };

  // Add audit log helper
  const addAuditLog = (accion, tipo = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: timeStr,
      usuario: currentUser ? `${currentUser.nombre} (${currentUser.cargo})` : 'Sistema',
      accion,
      tipo
    };
    setAuditLog(prev => [newLog, ...prev]);
  };

  // Update vote for a party
  const updateVote = (partidoId, delta) => {
    if (actaBloqueada) {
      alert("El acta se encuentra bloqueada por haber finalizado las firmas de jurados.");
      return;
    }
    setPartidos(prev => prev.map(p => {
      if (p.id === partidoId) {
        const nuevo = Math.max(0, (Number(p.votos) || 0) + delta);
        if (delta > 0) playBeep(750, 0.08);
        else playBeep(400, 0.08);
        return { ...p, votos: nuevo };
      }
      return p;
    }));
    const target = partidos.find(p => p.id === partidoId);
    if (target) {
      addAuditLog(`Ajuste de votos para [${target.sigla}]: ${delta > 0 ? '+' + delta : delta}`, 'conteo');
    }
  };

  // Set direct vote
  const setVoteDirect = (partidoId, value) => {
    if (actaBloqueada) return;
    const cleanVal = Math.max(0, parseInt(value, 10) || 0);
    setPartidos(prev => prev.map(p => p.id === partidoId ? { ...p, votos: cleanVal } : p));
    const target = partidos.find(p => p.id === partidoId);
    if (target) {
      addAuditLog(`Registro manual para [${target.sigla}]: ${cleanVal} votos`, 'conteo');
    }
  };

  // Update especial votes (blancos, nulos)
  const updateEspeciales = (type, delta) => {
    if (actaBloqueada) return;
    setEspeciales(prev => {
      const current = Number(prev[type]) || 0;
      const nuevo = Math.max(0, current + delta);
      if (delta > 0) playBeep(650, 0.08);
      else playBeep(350, 0.08);
      return { ...prev, [type]: nuevo };
    });
    addAuditLog(`Ajuste votos ${type.toUpperCase()}: ${delta > 0 ? '+' + delta : delta}`, 'conteo');
  };

  // Update mesa fields
  const updateMesa = (field, value) => {
    setMesa(prev => ({ ...prev, [field]: value }));
    addAuditLog(`Actualización de datos de mesa: ${field} = ${value}`, 'info');
  };

  // Juror signing
  const signJurado = (juradoId, signatureData) => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    setJurados(prev => prev.map(j => {
      if (j.id === juradoId) {
        return {
          ...j,
          firmado: true,
          fechaFirma: dateStr,
          firmaData: signatureData
        };
      }
      return j;
    }));
    const target = jurados.find(j => j.id === juradoId);
    addAuditLog(`Firma digital estampada por ${target ? target.nombre : 'Jurado'} (${target ? target.cargo : ''})`, 'firma');
  };

  // Toggle delivery materials checklist
  const toggleMaterial = (materialId) => {
    setMateriales(prev => prev.map(m => {
      if (m.id === materialId) {
        const nextVal = !m.completado;
        addAuditLog(`Material [${m.codigo}] marcado como ${nextVal ? 'RECIBIDO/EMPACADO' : 'PENDIENTE'}`, 'materiales');
        return { ...m, completado: nextVal };
      }
      return m;
    }));
  };

  // Save entrega details
  const saveEntrega = (entregaData) => {
    setEntrega(prev => ({
      ...prev,
      ...entregaData,
      fechaHoraEntrega: new Date().toLocaleString('es-BO')
    }));
    addAuditLog(`Custodia y entrega registrada ante el Notario Electoral: ${entregaData.notarioNombre}`, 'materiales');
  };

  // Reset demo
  const resetToDemo = () => {
    setCurrentUser({
      ci: "4839201 LP",
      nombre: "Lic. Andrea Ximena Choque Vargas",
      cargo: "Presidente(a) de Mesa",
      mesaNumero: "14",
      rol: "presidente"
    });
    setMesa(INITIAL_MESA);
    setPartidos(INITIAL_PARTIDOS);
    setEspeciales(INITIAL_ESPECIALES);
    setJurados(INITIAL_JURADOS);
    setMateriales(INITIAL_MATERIALES);
    setEntrega(INITIAL_ENTREGA);
    setAuditLog(INITIAL_AUDIT_LOG);
    setActaBloqueada(false);
    setActiveScreen('dashboard');
    alert("Datos de demostración cargados exitosamente.");
  };

  const login = (userData) => {
    setCurrentUser(userData);
    addAuditLog(`Inicio de sesión de ${userData.nombre} como ${userData.cargo}`, 'seguridad');
    setActiveScreen('dashboard');
  };

  const logout = () => {
    addAuditLog(`Cierre de sesión de ${currentUser?.nombre}`, 'seguridad');
    setCurrentUser(null);
    setActiveScreen('login');
  };

  return (
    <ElectoralContext.Provider
      value={{
        currentUser,
        login,
        logout,
        mesa,
        updateMesa,
        partidos,
        updateVote,
        setVoteDirect,
        especiales,
        updateEspeciales,
        totals,
        jurados,
        signJurado,
        materiales,
        toggleMaterial,
        entrega,
        saveEntrega,
        auditLog,
        addAuditLog,
        activeScreen,
        setActiveScreen,
        viewMode,
        setViewMode,
        soundEnabled,
        setSoundEnabled,
        offlineMode,
        setOfflineMode,
        actaBloqueada,
        setActaBloqueada,
        resetToDemo,
        playBeep
      }}
    >
      {children}
    </ElectoralContext.Provider>
  );
}

export function useElectoral() {
  const context = useContext(ElectoralContext);
  if (!context) {
    throw new Error('useElectoral must be used within an ElectoralProvider');
  }
  return context;
}
