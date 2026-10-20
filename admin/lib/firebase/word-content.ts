import type { ComponentType } from '@tributo-educa/contracts';

export interface WordContentBlock {
  type: ComponentType;
  title: string;
  data: Record<string, unknown>;
}

interface WordLesson {
  moduleSlug: string;
  submoduleSlug: string;
  blocks: WordContentBlock[];
}

const text = (title: string, body: string): WordContentBlock => ({ type: 'rich_text', title, data: { body } });
const list = (title: string, items: string[]): WordContentBlock => ({ type: 'checklist', title, data: { items } });
const table = (title: string, columns: string[], rows: string[][]): WordContentBlock => ({
  type: 'comparison_table', title, data: { columns, rows: rows.map((cells) => ({ cells })) },
});
const source = (url: string): WordContentBlock => ({
  type: 'legal_notice',
  title: 'Fuente y alcance',
  data: {
    body: 'Contenido educativo. Verifica requisitos y vigencia antes de tomar una decisión; consulta a un profesional cuando tu caso lo requiera.',
    source: url,
    lastReviewedAt: '2026-10-20',
  },
});

// El Word define el temario, no lecciones redactadas. Este material es una primera
// propuesta editorial revisable desde el panel, con referencias institucionales.
export const wordLessons: WordLesson[] = [
  {
    moduleSlug: 'tributario', submoduleSlug: 'regimenes-tributarios', blocks: [
      text('Elige con criterio', 'SUNAT distingue cuatro regímenes para negocios: Nuevo RUS, RER, Régimen MYPE Tributario (RMT) y Régimen General. Antes de elegir, identifica tu actividad, si vendes a empresas que necesitan factura, tus ingresos proyectados y los registros que puedes llevar.'),
      table('Comparación inicial', ['Régimen', '¿Para quién orienta?', 'Punto a revisar'], [
        ['Nuevo RUS', 'Persona natural con negocio pequeño', 'No emite facturas para sustentar crédito fiscal.'],
        ['RER', 'Negocios que cumplen sus condiciones de actividad e ingresos', 'Requiere Registro de Compras y Registro de Ventas.'],
        ['RMT', 'Micro y pequeñas empresas elegibles', 'La contabilidad depende del nivel de ingresos.'],
        ['General', 'Negocios sin límite de ingresos del régimen', 'Exige obligaciones contables según ingresos.'],
      ]),
      list('Preguntas para orientarte', ['¿Venderás a empresas que necesitan factura?', '¿Qué actividad económica realizarás?', '¿Cuánto esperas vender durante el año?', '¿Qué registros contables puedes mantener al día?']),
      source('https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios'),
    ],
  },
  {
    moduleSlug: 'tributario', submoduleSlug: 'comprobantes-de-pago-electronicos-cpe', blocks: [
      text('Cada operación necesita su comprobante', 'La boleta suele documentar ventas a consumidores finales; la factura se usa cuando el adquirente necesita sustentar costo, gasto o crédito fiscal según corresponda. El recibo por honorarios documenta servicios independientes de renta de cuarta categoría. La guía de remisión sustenta el traslado de bienes en los casos previstos por SUNAT.'),
      list('Antes de emitir', ['Verifica el tipo de operación y los datos del cliente.', 'Confirma si estás obligado a emitir electrónicamente.', 'Emite y entrega el comprobante correspondiente.', 'Conserva el respaldo y revisa notas de crédito o débito cuando haya correcciones.']),
      source('https://www.gob.pe/25177-obligados-a-emitir-comprobantes-de-pago-electronico'),
    ],
  },
  {
    moduleSlug: 'tributario', submoduleSlug: 'calendario-de-obligaciones', blocks: [
      text('Organiza tus vencimientos', 'SUNAT publica cronogramas de declaración y pago. La fecha mensual depende del periodo tributario y del último dígito del RUC; algunas categorías tienen tratamiento diferenciado. Consulta el cronograma vigente cada año y verifica también las obligaciones anuales que correspondan a tu régimen.'),
      list('Rutina mensual sugerida', ['Identifica el periodo que vas a declarar.', 'Consulta la fecha de vencimiento oficial según tu RUC.', 'Reúne ventas, compras y otros registros con anticipación.', 'Programa un recordatorio y confirma la constancia de presentación.']),
      source('https://www.sunat.gob.pe/orientacion/cronogramas/2026/cObligacionMensual2026.html'),
    ],
  },
  {
    moduleSlug: 'laboral', submoduleSlug: 'contratacion-laboral', blocks: [
      text('La relación laboral empieza con claridad', 'Antes de contratar, define las funciones, la jornada, el centro de trabajo, la remuneración y la modalidad que corresponde a la necesidad real del negocio. Los contratos temporales requieren una causa válida y una formalización adecuada; el nombre del contrato por sí solo no determina su naturaleza.'),
      table('Modalidades comunes', ['Modalidad', 'Cuándo revisarla'], [
        ['Plazo indeterminado', 'Cuando la necesidad de trabajo es permanente.'],
        ['Sujeto a modalidad', 'Cuando existe una causa temporal legalmente sustentable.'],
        ['Tiempo parcial', 'Cuando la jornada pactada cumple la regulación aplicable.'],
      ]),
      list('Antes de incorporar a alguien', ['Describe el puesto y la jornada real.', 'Revisa el contrato y la causa de temporalidad si aplica.', 'Verifica alta en planilla y cobertura de salud que corresponda.', 'Entrega información sobre riesgos del puesto.']),
      source('https://www.gob.pe/institucion/mtpe/noticias/694440-contratos-laborales-celebrados-de-manera-verbal-no-tienen-plazo-maximo-de-duracion'),
    ],
  },
  {
    moduleSlug: 'laboral', submoduleSlug: 'beneficios-sociales-regimen-general-vs-remype', blocks: [
      text('Primero verifica la condición REMYPE', 'El registro REMYPE permite a micro y pequeñas empresas acceder al régimen laboral especial cuando cumplen sus requisitos. Los beneficios pueden variar entre régimen general, microempresa y pequeña empresa; también importa la fecha de contratación. No presupongas que una empresa pequeña ya está inscrita.'),
      table('Qué comparar', ['Concepto', 'Revisión necesaria'], [
        ['Vacaciones', 'Comprueba régimen aplicable y tiempo de servicios.'],
        ['CTS y gratificaciones', 'Verifica inscripción REMYPE y categoría de empresa.'],
        ['Salud', 'Identifica la cobertura que corresponde al trabajador.'],
      ]),
      source('https://www.gob.pe/institucion/mtpe/pages/279-registro-de-la-micro-y-pequena-empresa-remype'),
    ],
  },
  {
    moduleSlug: 'laboral', submoduleSlug: 'prevencion-sunafil', blocks: [
      text('Prevención antes de una inspección', 'La seguridad y salud en el trabajo debe responder a los riesgos concretos de cada puesto. SUNAFIL orienta sobre identificación de peligros, capacitación, medidas de control y preparación ante emergencias.'),
      list('Autoevaluación inicial', ['¿Conoces los peligros de cada puesto?', '¿El personal recibió información y capacitación?', '¿Hay medidas de prevención y equipos cuando corresponden?', '¿Existe un plan de respuesta ante emergencias?', '¿Guardas evidencias y registros exigibles para tu empresa?']),
      source('https://www.gob.pe/institucion/sunafil/campa%C3%B1as/7354-la-seguridad-y-salud-en-el-trabajo'),
    ],
  },
  {
    moduleSlug: 'societario', submoduleSlug: 'tipos-societarios-y-personas-naturales', blocks: [
      text('Elige la forma de tu negocio', 'Una persona natural con negocio actúa a título personal. Una EIRL permite una persona titular y crea una persona jurídica distinta. SRL y SAC permiten asociarse bajo reglas propias de capital, administración y responsabilidad. La elección depende de socios, inversiones, gobierno y riesgos.'),
      table('Comparación orientativa', ['Forma', 'Titulares', 'Qué revisar'], [
        ['Persona natural con negocio', 'Una persona', 'Responsabilidad patrimonial personal.'],
        ['EIRL', 'Una persona titular', 'Patrimonio de persona jurídica y administración.'],
        ['SRL', 'Socios', 'Participaciones y reglas de transferencia.'],
        ['SAC', 'Accionistas', 'Acciones y órganos de administración.'],
      ]),
      source('https://www.gob.pe/institucion/produce/noticias/883902-eirl-srl-sac-sa-y-sacs-que-tipo-de-empresa-le-conviene-a-tu-negocio'),
    ],
  },
  {
    moduleSlug: 'societario', submoduleSlug: 'constitucion-de-empresa-paso-a-paso', blocks: [
      text('De la idea a la inscripción', 'Constituir una empresa implica elegir la forma jurídica, revisar o reservar el nombre, preparar el acto constitutivo, definir aportes y tramitar la inscripción. SUNARP ofrece el SID para iniciar la constitución de varias formas empresariales. Después corresponde gestionar RUC y obligaciones de inicio.'),
      list('Ruta de trabajo', ['Elige la forma empresarial y verifica el nombre.', 'Define titulares o socios, aportes y administración.', 'Prepara el acto constitutivo y la intervención notarial que aplique.', 'Presenta la inscripción por el canal habilitado.', 'Obtén o activa RUC y revisa licencias y obligaciones.']),
      source('https://www.gob.pe/10580'),
    ],
  },
  {
    moduleSlug: 'societario', submoduleSlug: 'gobierno-corporativo-basico', blocks: [
      text('Acuerdos que se pueden demostrar', 'Las decisiones importantes de una sociedad deben adoptarse por el órgano competente y quedar documentadas. Revisa el estatuto, las facultades del representante, el registro de socios o accionistas y las actas de las reuniones que correspondan.'),
      list('Orden societario básico', ['Conserva el estatuto y las inscripciones vigentes.', 'Registra acuerdos en actas cuando corresponda.', 'Verifica quién puede firmar por la empresa.', 'Mantén actualizada la información de socios o accionistas.', 'Consulta a un especialista antes de modificar poderes o capital.']),
      source('https://www.gob.pe/institucion/sunarp/informes-publicaciones/4081275-modelo-de-minutas-de-constitucion-de-empresas'),
    ],
  },
  {
    moduleSlug: 'contable', submoduleSlug: 'educacion-financiera-empresarial', blocks: [
      text('Caja y utilidad son distintas', 'Caja es el dinero disponible para pagar hoy; utilidad es el resultado de comparar ingresos con costos y gastos de un periodo. Un negocio puede vender mucho y quedarse sin efectivo si cobra tarde o paga antes de recibir sus ingresos.'),
      list('Hábitos de control', ['Separa el dinero personal del negocio.', 'Registra entradas y salidas con fecha y comprobante.', 'Planifica cobros y pagos próximos.', 'Revisa resultados y flujo de efectivo con tu contador.']),
      source('https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
    ],
  },
  {
    moduleSlug: 'contable', submoduleSlug: 'libros-y-registros-contables', blocks: [
      text('Para qué sirven los registros', 'El Registro de Ventas reúne operaciones de venta; el Registro de Compras, adquisiciones. El Libro Diario organiza hechos contables. Los libros obligatorios dependen del régimen tributario y del nivel de ingresos; algunas obligaciones se cumplen electrónicamente.'),
      list('Consulta con tu contador', ['¿Qué libros exige tu régimen e ingresos actuales?', '¿Debes usar registros electrónicos?', '¿Cómo se corrige una operación?', '¿Qué documentos respaldan cada asiento?', '¿Cuáles son tus plazos de registro y conservación?']),
      source('https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
    ],
  },
  {
    moduleSlug: 'contable', submoduleSlug: 'glosario-contable-para-abogados-y-emprendedores', blocks: [
      text('Palabras que conviene conocer', 'Activo: recurso controlado por el negocio. Pasivo: obligación pendiente. Patrimonio: participación residual después de descontar pasivos. Depreciación: distribución contable del costo de ciertos activos durante su vida útil.'),
      text('Términos tributarios frecuentes', 'Crédito fiscal: IGV de adquisiciones que puede descontarse del impuesto según requisitos legales. Detracción: depósito de parte del pago en una cuenta especial para operaciones sujetas al sistema. Retención: monto que un agente designado descuenta y entrega a la administración tributaria.'),
      source('https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
    ],
  },
  {
    moduleSlug: 'inmobiliario-comercial', submoduleSlug: 'contratos-de-arrendamiento-comercial', blocks: [
      text('Un local debe servir al negocio', 'Antes de firmar un alquiler comercial, verifica el uso permitido del inmueble, su identificación, el plazo, la renta y los gastos asociados. Deja claras las reglas sobre garantía, mantenimiento, penalidades, subarrendamiento y devolución del local.'),
      list('Cláusulas para revisar', ['Datos exactos del inmueble y de las partes.', 'Destino comercial y licencias o autorizaciones necesarias.', 'Renta, ajustes, garantía y gastos.', 'Plazo, renovación y salida anticipada.', 'Subarrendamiento, cesión y mejoras.']),
      source('https://leyes.congreso.gob.pe/Documentos/2016_2021/ADLP/Normas_Legales/30933-LEY.pdf'),
    ],
  },
  {
    moduleSlug: 'inmobiliario-comercial', submoduleSlug: 'desalojo-notarial-expreso', blocks: [
      text('La vía notarial tiene requisitos', 'La Ley 30933 regula un procedimiento especial de desalojo con intervención notarial. No basta con llamar “desalojo expreso” a una cláusula: el contrato, la identificación del inmueble y las formalidades exigidas por la ley deben evaluarse antes de usar esta vía.'),
      list('Puntos que conviene verificar', ['Individualización precisa del inmueble.', 'Forma del contrato y cláusulas requeridas.', 'Supuesto de vencimiento de plazo o falta de pago.', 'Documentación que acredita la causal.', 'Intervención profesional para el caso concreto.']),
      source('https://leyes.congreso.gob.pe/Documentos/2016_2021/ADLP/Normas_Legales/30933-LEY.pdf'),
    ],
  },
  {
    moduleSlug: 'modulos-complementarios', submoduleSlug: 'propiedad-intelectual-indecopi', blocks: [
      text('Protege la identidad de tu emprendimiento', 'La marca distingue productos o servicios; el nombre comercial identifica una actividad económica. El registro de marca se solicita ante INDECOPI por las clases de productos o servicios que corresponden. Una patente protege una invención que cumpla requisitos propios; no sustituye al registro de marca.'),
      list('Primeros pasos para una marca', ['Define qué productos o servicios distinguirá.', 'Busca antecedentes de signos similares.', 'Elige la clase correspondiente.', 'Prepara y presenta la solicitud por el canal oficial.', 'Sigue la publicación y el estado del trámite.']),
      source('https://www.gob.pe/institucion/indecopi/pages/333-registrar-la-marca-de-producto-o-servicio-de-tu-negocio-en-indecopi'),
    ],
  },
];
