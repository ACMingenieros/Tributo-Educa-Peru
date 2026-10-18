import type { ComponentType } from '@tributo-educa/contracts';

export const initialCurriculum: {
  title: string;
  description: string;
  submodules: string[];
}[] = [
  {
    title: 'Tributario',
    description: 'Obligaciones tributarias y relación con SUNAT.',
    submodules: [
      'Regímenes Tributarios',
      'Comprobantes de Pago Electrónicos (CPE)',
      'Calendario de Obligaciones',
    ],
  },
  {
    title: 'Laboral',
    description: 'Relaciones laborales y formalización de la MYPE.',
    submodules: [
      'Contratación Laboral',
      'Beneficios Sociales (Régimen General vs. REMYPE)',
      'Prevención SUNAFIL',
    ],
  },
  {
    title: 'Societario',
    description: 'Estructura legal y formalización del negocio.',
    submodules: [
      'Tipos Societarios y Personas Naturales',
      'Constitución de Empresa (Paso a Paso)',
      'Gobierno Corporativo Básico',
    ],
  },
  {
    title: 'Contable',
    description: 'Gestión financiera y registros contables básicos.',
    submodules: [
      'Educación Financiera Empresarial',
      'Libros y Registros Contables',
      'Glosario Contable para Abogados y Emprendedores',
    ],
  },
  {
    title: 'Inmobiliario Comercial',
    description: 'Locales, arrendamiento y seguridad jurídica.',
    submodules: [
      'Contratos de Arrendamiento Comercial',
      'Desalojo Notarial / Expreso',
    ],
  },
  {
    title: 'Módulos Complementarios',
    description: 'Temas avanzados para la evolución del aplicativo.',
    submodules: ['Propiedad Intelectual (INDECOPI)'],
  },
];

export const componentLabels: Record<ComponentType, string> = {
  rich_text: 'Texto enriquecido',
  image: 'Imagen',
  document: 'Documento descargable',
  info_card: 'Tarjeta informativa',
  comparison_table: 'Tabla comparativa',
  faq: 'Preguntas frecuentes',
  video: 'Video',
  practical_case: 'Caso práctico',
  exam: 'Examen',
  checklist: 'Checklist',
  glossary: 'Glosario',
  simulator: 'Simulador',
  calculator: 'Calculadora',
  alert_calendar: 'Calendario de obligaciones',
  legal_notice: 'Aviso legal o pedagógico',
};

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
