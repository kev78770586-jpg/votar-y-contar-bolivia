// Datos predeterminados y estructura inicial para el sistema electoral boliviano

export const DEPARTAMENTOS_BOLIVIA = [
  "La Paz",
  "Santa Cruz",
  "Cochabamba",
  "Chuquisaca",
  "Oruro",
  "Potosí",
  "Tarija",
  "Beni",
  "Pando"
];

export const INITIAL_MESA = {
  codigoMesa: "LP-01-014",
  numeroMesa: "14",
  departamento: "La Paz",
  provincia: "Murillo",
  municipio: "Nuestra Señora de La Paz",
  asientoElectoral: "La Paz Centro",
  recinto: "U.E. San Calixto (Calle Pichincha esq. Indaburo)",
  circunscripcion: "C-7",
  padronHabilitados: 238,
  papeletasRecibidas: 240,
  seriePapeletas: "LP-2026-004801 al LP-2026-005040",
  horaApertura: "08:00 AM",
  horaCierre: "16:15 PM",
  estadoProceso: "ESCRUTINIO" // INSTALACION, VOTACION, ESCRUTINIO, FIRMAS, ENTREGADO
};

export const INITIAL_PARTIDOS = [
  {
    id: "p1",
    sigla: "ADB",
    nombre: "Alianza Democrática Boliviana",
    candidato: "Carlos R. Morales & Elena Quispe",
    color: "#2563eb", // Azul democrático
    colorBg: "bg-blue-600",
    colorLight: "bg-blue-50 text-blue-700 border-blue-200",
    franjaColor: "border-l-4 border-l-blue-600",
    votos: 68
  },
  {
    id: "p2",
    sigla: "FUB",
    nombre: "Frente de Unidad Boliviana",
    candidato: "Valeria Mendoza & Roberto Mamani",
    color: "#16a34a", // Verde esmeralda
    colorBg: "bg-emerald-600",
    colorLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
    franjaColor: "border-l-4 border-l-emerald-600",
    votos: 54
  },
  {
    id: "p3",
    sigla: "RN",
    nombre: "Renovación Nacional 2026",
    candidato: "Fernando Justiniano & Sonia Torrico",
    color: "#ea580c", // Naranja
    colorBg: "bg-orange-600",
    colorLight: "bg-orange-50 text-orange-700 border-orange-200",
    franjaColor: "border-l-4 border-l-orange-600",
    votos: 42
  },
  {
    id: "p4",
    sigla: "MPC",
    nombre: "Movimiento Popular Ciudadano",
    candidato: "Javier Condori & Marcela Banzer",
    color: "#9333ea", // Morado
    colorBg: "bg-purple-600",
    colorLight: "bg-purple-50 text-purple-700 border-purple-200",
    franjaColor: "border-l-4 border-l-purple-600",
    votos: 28
  },
  {
    id: "p5",
    sigla: "APB",
    nombre: "Acción Por Bolivia",
    candidato: "David Albarracín & Patricia Flores",
    color: "#dc2626", // Rojo
    colorBg: "bg-red-600",
    colorLight: "bg-red-50 text-red-700 border-red-200",
    franjaColor: "border-l-4 border-l-red-600",
    votos: 12
  }
];

export const INITIAL_ESPECIALES = {
  blancos: 6,
  nulos: 4
};

export const INITIAL_JURADOS = [
  {
    id: "j1",
    cargo: "Presidente(a) de Mesa",
    nombre: "Lic. Andrea Ximena Choque Vargas",
    ci: "4839201 LP",
    telefono: "71542890",
    presente: true,
    firmado: true,
    fechaFirma: "2026-11-13 17:35",
    firmaData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60'><path d='M20,40 Q60,10 90,35 T160,20' fill='none' stroke='%23083324' stroke-width='2'/></svg>"
  },
  {
    id: "j2",
    cargo: "Secretario(a) de Mesa",
    nombre: "Ing. Marco Antonio Flores Torrico",
    ci: "3920184 LP",
    telefono: "68021943",
    presente: true,
    firmado: true,
    fechaFirma: "2026-11-13 17:37",
    firmaData: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='60'><path d='M25,35 Q70,5 110,45 T175,25' fill='none' stroke='%23083324' stroke-width='2'/></svg>"
  },
  {
    id: "j3",
    cargo: "Vocal 1 (Control de Padrón)",
    nombre: "Dra. Carmen Rosa Gutiérrez Nina",
    ci: "5910294 LP",
    telefono: "76204812",
    presente: true,
    firmado: false,
    fechaFirma: null,
    firmaData: null
  },
  {
    id: "j4",
    cargo: "Vocal 2 (Entrega de Papeletas)",
    nombre: "Sr. José Luis Quispe Mamani",
    ci: "6029381 LP",
    telefono: "79153028",
    presente: true,
    firmado: false,
    fechaFirma: null,
    firmaData: null
  },
  {
    id: "j5",
    cargo: "Vocal 3 (Tinta Indeleble)",
    nombre: "Sra. Sandra Beatriz Morales Paz",
    ci: "7102948 LP",
    telefono: "67019284",
    presente: true,
    firmado: false,
    fechaFirma: null,
    firmaData: null
  }
];

export const INITIAL_MATERIALES = [
  {
    id: "m1",
    codigo: "SOBRE-A",
    nombre: "Sobre de Seguridad 'A' (Acta de Escrutinio Original)",
    descripcion: "Contiene el Acta de Escrutinio y Cómputo original destinada al Tribunal Electoral Departamental (TED). Debe estar debidamente precintado y firmado.",
    icono: "ShieldCheck",
    tipo: "Critico",
    completado: true
  },
  {
    id: "m2",
    codigo: "SOBRE-B",
    nombre: "Sobre de Seguridad 'B' (Papeletas Votadas)",
    descripcion: "Contiene todas las papeletas de sufragio con votos válidos, blancos y nulos escrutados en el ánfora.",
    icono: "Archive",
    tipo: "Critico",
    completado: true
  },
  {
    id: "m3",
    codigo: "SOBRE-C",
    nombre: "Sobre de Seguridad 'C' (Papeletas No Utilizadas y Lista Índice)",
    descripcion: "Contiene las papeletas sobrantes inutilizadas con corte diagonal y la Lista Índice de votantes habilitados con firmas y huellas.",
    icono: "FileText",
    tipo: "Critico",
    completado: false
  },
  {
    id: "m4",
    codigo: "ANFORA-01",
    nombre: "Ánfora Electoral Desarmada",
    descripcion: "Ánfora de cartón plegada y vacía, revisada y libre de cualquier material residual.",
    icono: "Box",
    tipo: "Mobiliario",
    completado: false
  },
  {
    id: "m5",
    codigo: "MALETA-01",
    nombre: "Maleta Electoral y Material de Escritorio",
    descripcion: "Tampones dactilares, bolígrafos, reglas, sellos de mesa 'VOTÓ', cinta de seguridad restante y bolsas protectoras.",
    icono: "Briefcase",
    tipo: "Utiles",
    completado: false
  }
];

export const INITIAL_ENTREGA = {
  notarioNombre: "Lic. Gonzalo Ramiro Valdez Espinoza",
  notarioCI: "3184920 LP",
  notarioCredencial: "NOT-TED-LP-042",
  recintoEntrega: "Recinto U.E. San Calixto - Centro de Acopio Notarial #2",
  fechaHoraEntrega: null,
  firmaNotario: null,
  observacionesCustodia: "Maleta y sobres entregados en perfecto estado con precintos intactos y firmas correspondientes.",
  codigoConstancia: "CONST-LP014-20261113"
};

export const INITIAL_AUDIT_LOG = [
  {
    id: "log-1",
    timestamp: "16:15:22",
    usuario: "Lic. Andrea Choque (Presidente)",
    accion: "Cierre oficial de la mesa electoral e inicio de la fase de escrutinio.",
    tipo: "info"
  },
  {
    id: "log-2",
    timestamp: "16:20:05",
    usuario: "Lic. Andrea Choque (Presidente)",
    accion: "Apertura del ánfora electoral y conteo inicial de papeletas (214 papeletas en ánfora).",
    tipo: "info"
  },
  {
    id: "log-3",
    timestamp: "16:45:10",
    usuario: "Marco Flores (Secretario)",
    accion: "Registro de conteo de votos por partido: ADB (68), FUB (54), RN (42), MPC (28), APB (12).",
    tipo: "conteo"
  },
  {
    id: "log-4",
    timestamp: "17:05:40",
    usuario: "Marco Flores (Secretario)",
    accion: "Registro de votos especiales: 6 Blancos, 4 Nulos.",
    tipo: "conteo"
  },
  {
    id: "log-5",
    timestamp: "17:35:12",
    usuario: "Lic. Andrea Choque (Presidente)",
    accion: "Firma digital del Acta de Escrutinio por Presidente de Mesa.",
    tipo: "firma"
  },
  {
    id: "log-6",
    timestamp: "17:37:44",
    usuario: "Ing. Marco Flores (Secretario)",
    accion: "Firma digital del Acta de Escrutinio por Secretario de Mesa.",
    tipo: "firma"
  }
];
