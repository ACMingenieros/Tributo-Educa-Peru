export interface DemoSubmodule {
  title: string;
  lessons: number;
  status: 'Publicado' | 'Borrador';
}

export interface DemoModule {
  title: string;
  description: string;
  status: 'Activo' | 'En preparación';
  submodules: DemoSubmodule[];
}

export const demoModules: DemoModule[] = [
  {
    title: 'Tributario',
    description: 'Obligaciones tributarias y relación con SUNAT.',
    status: 'Activo',
    submodules: [
      { title: 'Regímenes Tributarios', lessons: 8, status: 'Publicado' },
      { title: 'Comprobantes de Pago Electrónicos (CPE)', lessons: 5, status: 'Publicado' },
      { title: 'Calendario de Obligaciones', lessons: 3, status: 'Borrador' },
    ],
  },
  {
    title: 'Laboral',
    description: 'Relaciones laborales y formalización de la MYPE.',
    status: 'Activo',
    submodules: [
      { title: 'Contratación Laboral', lessons: 6, status: 'Publicado' },
      { title: 'Beneficios Sociales: General vs. REMYPE', lessons: 4, status: 'Borrador' },
      { title: 'Prevención SUNAFIL', lessons: 2, status: 'Borrador' },
    ],
  },
  {
    title: 'Societario',
    description: 'Estructura legal y formalización del negocio.',
    status: 'Activo',
    submodules: [
      { title: 'Tipos Societarios y Personas Naturales', lessons: 5, status: 'Publicado' },
      { title: 'Constitución de Empresa', lessons: 7, status: 'Publicado' },
      { title: 'Gobierno Corporativo Básico', lessons: 2, status: 'Borrador' },
    ],
  },
  {
    title: 'Contable',
    description: 'Gestión financiera y registros contables básicos.',
    status: 'Activo',
    submodules: [
      { title: 'Educación Financiera Empresarial', lessons: 4, status: 'Publicado' },
      { title: 'Libros y Registros Contables', lessons: 5, status: 'Publicado' },
      { title: 'Glosario Contable', lessons: 2, status: 'Borrador' },
    ],
  },
  {
    title: 'Inmobiliario Comercial',
    description: 'Locales, arrendamiento y seguridad jurídica.',
    status: 'En preparación',
    submodules: [
      { title: 'Contratos de Arrendamiento Comercial', lessons: 3, status: 'Borrador' },
      { title: 'Desalojo Notarial / Expreso', lessons: 2, status: 'Borrador' },
    ],
  },
  {
    title: 'Módulos Complementarios',
    description: 'Temas avanzados para el crecimiento del negocio.',
    status: 'En preparación',
    submodules: [
      { title: 'Propiedad Intelectual (INDECOPI)', lessons: 1, status: 'Borrador' },
    ],
  },
];

export const demoContentBlocks = [
  { kind: 'TEXTO ENRIQUECIDO', title: '¿Qué son los regímenes tributarios?', detail: 'Conoce las opciones tributarias disponibles para una persona natural con negocio o una empresa.' },
  { kind: 'TABLA COMPARATIVA', title: 'Compara antes de elegir', detail: 'Nuevo RUS · RER · Régimen MYPE Tributario · Régimen General' },
  { kind: 'CASO PRÁCTICO', title: 'Una MYPE que empieza a vender a empresas', detail: 'Analiza el tipo de comprobante, el nivel de ingresos y los gastos deducibles.' },
  { kind: 'AVISO PEDAGÓGICO', title: 'Contenido educativo', detail: 'Este material es orientativo y no reemplaza la asesoría de un profesional colegiado.' },
];

export const demoUsers = [
  { name: 'María Fernanda Rojas', email: 'maria.rojas@tributoeduca.pe', role: 'Administradora', status: 'Activo' },
  { name: 'Luis Alberto Paredes', email: 'luis.paredes@tributoeduca.pe', role: 'Editor', status: 'Activo' },
  { name: 'Ana Lucía Torres', email: 'ana.torres@tributoeduca.pe', role: 'Editora', status: 'Invitada' },
];
