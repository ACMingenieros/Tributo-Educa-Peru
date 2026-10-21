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
const faq = (title: string, items: { question: string; answer: string }[]): WordContentBlock => ({
  type: 'faq', title, data: { items },
});
const card = (title: string, body: string, label?: string): WordContentBlock => ({
  type: 'info_card', title, data: { body, ...(label ? { label } : {}) },
});
const practicalCase = (
  title: string,
  context: string,
  facts: string,
  analysis: string,
  conclusion: string,
): WordContentBlock => ({
  type: 'practical_case', title, data: { context, facts, analysis, conclusion },
});
const glossary = (term: string, definition: string, url: string): WordContentBlock => ({
  type: 'glossary', title: term, data: { term, definition, source: url },
});
const source = (url: string, lastReviewedAt = '2026-10-20'): WordContentBlock => ({
  type: 'legal_notice',
  title: 'Fuente y alcance',
  data: {
    body: 'Contenido educativo. Verifica requisitos y vigencia antes de tomar una decisión; consulta a un profesional cuando tu caso lo requiera.',
    source: url,
    lastReviewedAt,
  },
});

// El Word define el temario, no lecciones redactadas. Este material es una primera
// propuesta editorial revisable desde el panel, con referencias institucionales.
export const wordLessons: WordLesson[] = [
  {
    moduleSlug: 'tributario', submoduleSlug: 'regimenes-tributarios', blocks: [
      table('Cuatro regímenes, cuatro preguntas', ['Régimen', 'Comprobantes y foco para revisar'], [
        ['Nuevo RUS', 'Orientado a pequeños negocios elegibles que emiten boletas; no permite emitir factura para crédito fiscal.'],
        ['RER', 'Puede emitir facturas si la actividad e ingresos cumplen las condiciones del régimen.'],
        ['RMT', 'Régimen para contribuyentes elegibles; revisa ingresos, actividad y obligaciones contables.'],
        ['General', 'Para quienes no se acogen a los otros regímenes; revisa obligaciones según tu actividad.'],
      ]),
      card('Antes de elegir', 'No decidas solo por el tamaño actual del negocio. Comprueba si tu actividad está permitida, cómo emitirás comprobantes y qué obligaciones tendrás según tus ingresos.', 'ORIENTACIÓN'),
      faq('Preguntas que ayudan a decidir', [
        { question: '¿Puedo elegir cualquier régimen?', answer: 'No necesariamente. Algunas actividades o condiciones impiden acogerse a determinados regímenes. Revisa los requisitos oficiales antes de inscribirte.' },
        { question: '¿Qué dato conviene revisar primero?', answer: 'Define tu actividad, estima tus ingresos y aclara si tus clientes necesitan factura. Luego contrasta esos datos con la ficha vigente de SUNAT.' },
      ]),
      source('https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios'),
    ],
  },
  {
    moduleSlug: 'tributario', submoduleSlug: 'comprobantes-de-pago-electronicos-cpe', blocks: [
      practicalCase('¿Boleta, factura o recibo?', 'Una emprendedora vende productos a personas que compran para consumo y también presta asesoría independiente a otro negocio.', 'En una operación vende mercadería; en la otra presta un servicio personal independiente. Además, un cliente le solicita factura.', 'El tipo de comprobante depende de la operación y de la condición de quien presta el servicio o realiza la venta. No se debe tratar el recibo por honorarios como comprobante de venta de mercadería.', 'Identifica primero qué actividad generó el ingreso, quién la realizó y qué documento corresponde. Confirma la obligación de emisión electrónica en SUNAT.'),
      faq('Elige el documento según la operación', [
        { question: '¿La boleta y la factura son intercambiables?', answer: 'No. Cada comprobante responde a supuestos y datos distintos. La factura puede sustentar costo, gasto o crédito fiscal cuando se cumplen los requisitos aplicables.' },
        { question: '¿Cuándo se usa el recibo por honorarios?', answer: 'Para documentar servicios independientes de personas naturales que generan rentas de cuarta categoría.' },
      ]),
      list('Antes de emitir', ['Reconoce si vendes un bien, prestas un servicio independiente o trasladas mercadería.', 'Verifica los datos del cliente y tu obligación de emitir electrónicamente.', 'Entrega el comprobante y conserva la constancia.', 'Si necesitas corregirlo, consulta el procedimiento de nota de crédito o débito aplicable.']),
      source('https://www.gob.pe/25177-obligados-a-emitir-comprobantes-de-pago-electronico'),
    ],
  },
  {
    moduleSlug: 'tributario', submoduleSlug: 'calendario-de-obligaciones', blocks: [
      card('La fecha no se debe adivinar', 'Los cronogramas se actualizan por periodo y pueden variar según la obligación y el último dígito del RUC. Usa siempre el calendario oficial del año que estás declarando.', 'CONSULTA VIGENTE'),
      practicalCase('Una fecha que cambia según el RUC', 'Una persona encargada de un pequeño negocio prepara la declaración mensual del periodo actual.', 'Tiene a mano el RUC, pero guardó una captura del cronograma del año pasado.', 'La captura anterior puede tener vencimientos distintos. Debe elegir el periodo correcto y consultar el cronograma vigente publicado por SUNAT, considerando el último dígito y la categoría que corresponda.', 'Registra la fecha verificada y conserva un recordatorio; no reutilices fechas de otro ejercicio.'),
      faq('Cómo usar el cronograma', [
        { question: '¿El último dígito del RUC basta para encontrar la fecha?', answer: 'Es uno de los datos, pero también debes seleccionar el periodo y la obligación correcta. Revisa si tu contribuyente tiene un cronograma diferenciado.' },
        { question: '¿La aplicación garantiza una fecha de vencimiento?', answer: 'No en esta guía. Consulta el cronograma oficial vigente de SUNAT antes de presentar o pagar.' },
      ]),
      source('https://www.sunat.gob.pe/orientacion/cronogramas/2026/cObligacionMensual2026.html'),
    ],
  },
  {
    moduleSlug: 'laboral', submoduleSlug: 'contratacion-laboral', blocks: [
      faq('Tres modalidades que suelen generar dudas', [
        { question: '¿Cuándo revisar un contrato a plazo indeterminado?', answer: 'Cuando la necesidad de trabajo es permanente. La relación laboral puede incluso ser verbal; el documento escrito no es lo único que determina su naturaleza.' },
        { question: '¿Basta con titularlo “temporal”?', answer: 'No. La contratación sujeta a modalidad requiere una causa objetiva admitida y debe formalizarse con los requisitos correspondientes.' },
        { question: '¿Qué debo revisar en tiempo parcial?', answer: 'La jornada realmente pactada y ejecutada, además de los requisitos legales aplicables. No uses la etiqueta para describir una jornada distinta a la real.' },
      ]),
      practicalCase('El contrato no coincide con el trabajo', 'Un negocio contrata a una persona para cubrir una necesidad que se mantiene durante todo el año.', 'El documento dice “temporal”, pero no explica una causa concreta; en la práctica, las funciones son permanentes.', 'El nombre del contrato no resuelve el análisis. La modalidad debe corresponder a la necesidad real y cumplir los requisitos legales.', 'Define primero la necesidad del puesto. Si es temporal, sustenta la causa; si no, revisa la modalidad adecuada con asesoría laboral.'),
      list('Antes de formalizar', ['Describe funciones, centro de trabajo, remuneración y jornada que realmente se cumplirán.', 'Identifica la modalidad que corresponde a la necesidad.', 'Documenta y sustenta la causa temporal cuando aplique.', 'Verifica el registro en planilla y las obligaciones de seguridad y salud.']),
      source('https://www.gob.pe/institucion/mtpe/noticias/694440-contratos-laborales-celebrados-de-manera-verbal-no-tienen-plazo-maximo-de-duracion'),
    ],
  },
  {
    moduleSlug: 'laboral', submoduleSlug: 'beneficios-sociales-regimen-general-vs-remype', blocks: [
      table('Compara con tres datos', ['Dato', 'Por qué importa'], [
        ['Inscripción en REMYPE', 'No basta con ser una empresa pequeña: verifica que la inscripción exista y desde cuándo.'],
        ['Categoría registrada', 'Microempresa y pequeña empresa tienen reglas laborales diferenciadas.'],
        ['Fecha de ingreso', 'La fecha de contratación puede afectar qué régimen corresponde al trabajador.'],
        ['Beneficio consultado', 'Vacaciones, CTS, gratificaciones y cobertura de salud pueden tener reglas distintas.'],
      ]),
      practicalCase('La empresa es pequeña, ¿ya aplica REMYPE?', 'Una empresa con pocos trabajadores supone que automáticamente tiene los beneficios del régimen MYPE.', 'El empleador no ha comprobado su inscripción ni la fecha en que fue registrada.', 'El tamaño aparente no sustituye la verificación registral. La aplicación de reglas especiales depende de requisitos y circunstancias, incluido el momento de inscripción y contratación.', 'Consulta el registro, confirma la categoría y evalúa cada beneficio por separado antes de calcularlo o pagarlo.'),
      faq('Preguntas antes de calcular beneficios', [
        { question: '¿REMYPE significa que desaparecen todos los beneficios?', answer: 'No. Existen derechos laborales y reglas diferenciadas según categoría. No asumas que un beneficio no corresponde sin verificar la norma y el caso.' },
        { question: '¿Puedo estimar CTS o gratificaciones con esta guía?', answer: 'Esta lección no es una calculadora. Usa la información oficial vigente y confirma la situación laboral concreta con un profesional.' },
      ]),
      source('https://www.gob.pe/institucion/mtpe/pages/279-registro-de-la-micro-y-pequena-empresa-remype'),
    ],
  },
  {
    moduleSlug: 'laboral', submoduleSlug: 'prevencion-sunafil', blocks: [
      list('Recorrido preventivo del centro de trabajo', ['Identifica peligros y evalúa riesgos propios de cada puesto.', 'Informa y capacita al personal antes de exponerlo a tareas o equipos.', 'Aplica controles adecuados y proporciona equipos cuando correspondan.', 'Prepara una respuesta para emergencias y comunica cómo actuar.', 'Conserva evidencias y registros exigibles según tu organización.']),
      practicalCase('Riesgo nuevo en una tarea conocida', 'Un negocio incorpora una máquina para acelerar una tarea que antes se realizaba manualmente.', 'El equipo cambia la forma de trabajar, pero no se ha revisado el riesgo ni explicado su uso al personal.', 'La prevención debe ajustarse a los peligros del puesto y a los cambios en el proceso. Una lista genérica no sustituye la evaluación concreta.', 'Revisa el riesgo antes de usar el equipo, capacita al personal y registra las medidas adoptadas. Consulta las herramientas de orientación de SUNAFIL.'),
      faq('Dudas frecuentes sobre prevención', [
        { question: '¿La SST solo se revisa cuando llega una inspección?', answer: 'No. La prevención es una obligación continua y debe adecuarse al tipo de actividad, los riesgos y las personas expuestas.' },
        { question: '¿Existe un autodiagnóstico oficial?', answer: 'SUNAFIL publica herramientas de orientación como ELSSA. Úsalas como apoyo para detectar temas que requieren revisión, no como garantía automática de cumplimiento.' },
      ]),
      source('https://www.gob.pe/institucion/sunafil/campa%C3%B1as/7354-la-seguridad-y-salud-en-el-trabajo'),
    ],
  },
  {
    moduleSlug: 'societario', submoduleSlug: 'tipos-societarios-y-personas-naturales', blocks: [
      table('No son solo nombres distintos', ['Forma', 'Estructura general', 'Decisión que conviene revisar'], [
        ['Persona natural con negocio', 'La persona desarrolla la actividad a título personal.', 'Exposición patrimonial, gestión y necesidad de sumar socios.'],
        ['EIRL', 'Persona jurídica con una persona titular.', 'Separación patrimonial y reglas de administración aplicables.'],
        ['SRL', 'Sociedad con socios y participaciones.', 'Composición de socios y transmisión de participaciones.'],
        ['SAC', 'Sociedad con accionistas y acciones.', 'Administración, acuerdos y entrada o salida de accionistas.'],
      ]),
      practicalCase('Emprender solo o con una socia', 'Dos personas quieren abrir un negocio y una aportará capital mientras la otra gestionará la operación.', 'Quieren saber si basta con registrarlo a nombre de una persona o si conviene formar una sociedad.', 'La decisión afecta titularidad, gobierno, aportes, documentación y responsabilidad. Elegir una forma sin acordar cómo se toman decisiones puede generar conflictos después.', 'Comparen las formas jurídicas con un profesional y dejen claros aportes, facultades, salida y reparto antes de iniciar trámites.'),
      faq('Antes de escoger una forma jurídica', [
        { question: '¿EIRL y SAC se forman igual?', answer: 'No. Tienen estructuras y reglas societarias distintas. La cantidad y tipo de titulares es solo uno de los criterios.' },
        { question: '¿La razón social protege una marca?', answer: 'No son equivalentes. La razón social identifica a la persona jurídica; la marca distingue productos o servicios en el mercado.' },
      ]),
      source('https://www.gob.pe/institucion/produce/noticias/883902-eirl-srl-sac-sa-y-sacs-que-tipo-de-empresa-le-conviene-a-tu-negocio'),
    ],
  },
  {
    moduleSlug: 'societario', submoduleSlug: 'constitucion-de-empresa-paso-a-paso', blocks: [
      list('Ruta orientativa de constitución', ['Compara la forma jurídica y define titulares, aportes y administración.', 'Evalúa la búsqueda y reserva de nombre; SUNARP indica cuándo es recomendable y qué trámite corresponde.', 'Prepara el acto constitutivo con la intervención notarial que aplique.', 'Presenta la solicitud por el canal registral habilitado y sigue su calificación.', 'Tras la inscripción, revisa la activación del RUC, Clave SOL, licencias y obligaciones de inicio.']),
      practicalCase('Antes de llenar la solicitud', 'Una persona quiere constituir una empresa con una socia usando SID-SUNARP.', 'Aún no acordaron el objeto social, los aportes ni quién tendrá facultades para representar a la sociedad.', 'El trámite requiere decisiones previas sobre la organización de la empresa. Enviar un formulario sin esos acuerdos puede producir errores o demoras.', 'Acuerden estructura, aportes y administración; revisen los requisitos de la plataforma y coordinen la etapa notarial correspondiente.'),
      card('El orden puede variar', 'Los requisitos dependen de la forma elegida y del procedimiento disponible. Esta ruta es una orientación general; verifica los pasos actualizados de SUNARP antes de iniciar.', 'GUÍA, NO TRÁMITE'),
      source('https://www.gob.pe/10580'),
    ],
  },
  {
    moduleSlug: 'societario', submoduleSlug: 'gobierno-corporativo-basico', blocks: [
      faq('Acuerdos, actas y poderes', [
        { question: '¿Cualquier persona socia puede firmar por la empresa?', answer: 'No lo presupongas. Revisa el estatuto y los poderes inscritos para conocer quién tiene facultades y cuáles son sus límites.' },
        { question: '¿Qué decisiones deben quedar documentadas?', answer: 'Las que correspondan al órgano competente y a las reglas de la sociedad. La forma de convocatoria, quórum y acta depende de la ley y del estatuto.' },
        { question: '¿Cada sociedad lleva los mismos libros?', answer: 'No necesariamente. Verifica qué libros societarios corresponden a tu forma jurídica y cómo deben mantenerse.' },
      ]),
      list('Lista de control documental', ['Ubica el estatuto vigente y sus modificaciones.', 'Confirma nombramientos y poderes inscritos.', 'Identifica qué órgano debe aprobar la decisión.', 'Convoca y documenta los acuerdos conforme a las reglas aplicables.', 'Actualiza registros y presenta el trámite registral si corresponde.']),
      practicalCase('Una decisión tomada por chat', 'Los accionistas acuerdan cambiar a la persona representante en un grupo de mensajería.', 'No revisaron el estatuto ni convocaron al órgano societario competente.', 'El acuerdo informal podría no cumplir los requisitos de adopción, documentación o inscripción. Las facultades de representación no se modifican solo por comunicarlo internamente.', 'Verifiquen el estatuto, adopten el acuerdo por el mecanismo aplicable y formalicen e inscriban el cambio cuando corresponda.'),
      source('https://www.gob.pe/institucion/sunarp/informes-publicaciones/4081275-modelo-de-minutas-de-constitucion-de-empresas'),
    ],
  },
  {
    moduleSlug: 'contable', submoduleSlug: 'educacion-financiera-empresarial', blocks: [
      practicalCase('Hay ventas, pero falta efectivo', 'Una tienda vende a crédito a varios clientes y debe pagar alquiler y proveedores antes de cobrarles.', 'El registro de ventas muestra actividad, pero la cuenta bancaria tiene poco saldo disponible esta semana.', 'La venta puede formar parte del resultado del periodo aunque el dinero aún no se haya cobrado. La caja refleja liquidez disponible; no son la misma medida.', 'Controla por separado cuentas por cobrar, pagos próximos y resultados. No uses el saldo bancario como única medida de rentabilidad.'),
      table('Caja y utilidad responden preguntas distintas', ['Concepto', 'Pregunta que responde', 'Qué revisar'], [
        ['Caja o efectivo', '¿Con cuánto dinero disponible cuento ahora?', 'Saldos, cobros recibidos y pagos por vencer.'],
        ['Utilidad', '¿Qué resultado tuvo el negocio en un periodo?', 'Ingresos, costos y gastos reconocidos según el criterio contable aplicable.'],
      ]),
      list('Rutina para ordenar tus finanzas', ['Mantén separados los movimientos personales y los del negocio.', 'Registra ventas, cobros, compras y pagos con sustento.', 'Actualiza lo que te deben y lo que debes pagar.', 'Revisa caja y resultados por separado con tu contador.']),
      source('https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
    ],
  },
  {
    moduleSlug: 'contable', submoduleSlug: 'libros-y-registros-contables', blocks: [
      table('Qué información organiza cada registro', ['Registro o libro', 'Qué ayuda a controlar'], [
        ['Registro de Ventas', 'Comprobantes y operaciones de venta del periodo.'],
        ['Registro de Compras', 'Adquisiciones y comprobantes recibidos.'],
        ['Libro Diario', 'Hechos económicos organizados en asientos contables.'],
      ]),
      practicalCase('Una compra sin sustento a la mano', 'Al cierre del mes, el negocio encuentra un pago bancario a un proveedor, pero no ubica el comprobante.', 'El movimiento de dinero existe, pero falta verificar el documento y la naturaleza de la operación.', 'El extracto bancario ayuda a rastrear el pago, pero no sustituye por sí mismo el análisis del comprobante ni su registro contable.', 'Solicita el sustento, concilia la operación y consulta cómo registrarla y qué corrección corresponde.'),
      faq('Libros electrónicos y obligaciones', [
        { question: '¿Todos llevan los mismos libros?', answer: 'No. La obligación depende del régimen, los ingresos y otras condiciones. Confirma tu situación con las reglas vigentes.' },
        { question: '¿Un pago bancario reemplaza el comprobante?', answer: 'No necesariamente. Conserva los documentos que sustentan la operación y consulta qué evidencia exige el tratamiento contable y tributario.' },
      ]),
      source('https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
    ],
  },
  {
    moduleSlug: 'contable', submoduleSlug: 'glosario-contable-para-abogados-y-emprendedores', blocks: [
      glossary('Activo', 'Recurso económico que la entidad controla y del que espera obtener beneficios. Ejemplos pueden incluir efectivo, inventarios o equipos.', 'https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
      glossary('Pasivo', 'Obligación presente del negocio, como una deuda con un proveedor o un préstamo pendiente.', 'https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
      glossary('Patrimonio', 'Parte residual de los activos después de considerar los pasivos. No equivale al efectivo disponible en caja.', 'https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
      glossary('Depreciación', 'Reconocimiento contable de la distribución del importe depreciable de un activo durante su vida útil. El tratamiento concreto depende de las reglas contables y tributarias aplicables.', 'https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
      glossary('Crédito fiscal', 'IGV de adquisiciones que puede aplicarse contra el impuesto según las condiciones y requisitos legales; no toda compra genera automáticamente crédito fiscal.', 'https://orientacion.sunat.gob.pe/04-comprobantes-de-pago'),
      glossary('Detracción (SPOT)', 'Depósito de una parte del importe de ciertas operaciones en una cuenta del Banco de la Nación para el pago de obligaciones tributarias, cuando la operación está sujeta al sistema.', 'https://orientacion.sunat.gob.pe/como-funcionan-las-detracciones'),
      glossary('Retención del IGV', 'Monto que un agente designado por SUNAT retiene a su proveedor y entrega al fisco conforme a las reglas del régimen.', 'https://orientacion.sunat.gob.pe/71-regimen-de-retenciones-del-igv'),
      faq('Cómo leer este glosario', [
        { question: '¿Detracción y retención significan lo mismo?', answer: 'No. Son mecanismos diferentes, con supuestos y obligaciones propios. Comprueba cuál aplica a la operación concreta.' },
        { question: '¿Un término contable siempre tiene el mismo efecto tributario?', answer: 'No necesariamente. La definición contable y el tratamiento tributario deben analizarse según la norma vigente y el caso.' },
      ]),
      source('https://www.gob.pe/1211-llevar-libros-contables-para-mi-negocio'),
    ],
  },
  {
    moduleSlug: 'inmobiliario-comercial', submoduleSlug: 'contratos-de-arrendamiento-comercial', blocks: [
      practicalCase('El local parece ideal, pero el uso no está claro', 'Una emprendedora encuentra un local que le conviene para abrir un taller y quiere firmar cuanto antes.', 'El borrador identifica el inmueble y la renta, pero no describe con precisión el uso permitido, las mejoras ni quién asume ciertos gastos.', 'El contrato debe reflejar el acuerdo real y permitir verificar obligaciones de las partes. Además, el arrendamiento no reemplaza licencias o autorizaciones municipales que pudieran requerirse.', 'Aclara destino, gastos, plazo, garantía, reparaciones y condiciones de salida; revisa permisos antes de invertir en adecuaciones.'),
      list('Revisión antes de firmar', ['Confirma identidad de las partes y datos registrales o de identificación del inmueble.', 'Describe el destino comercial permitido y las responsabilidades sobre licencias.', 'Define renta, ajustes, garantía, servicios y mantenimiento.', 'Acordar por escrito plazo, renovación, penalidades y devolución.', 'Revisa si cesión, subarrendamiento y mejoras requieren autorización expresa.']),
      faq('Cláusulas que conviene conversar', [
        { question: '¿Puedo subarrendar una parte del local?', answer: 'Depende del contrato y de las reglas aplicables. No lo asumas: acuerda expresamente si se permite y en qué condiciones.' },
        { question: '¿Quién paga las reparaciones?', answer: 'Deja definida la distribución de mantenimiento y reparaciones, y distingue desgaste ordinario de daños o mejoras.' },
      ]),
      source('https://leyes.congreso.gob.pe/Documentos/2016_2021/ADLP/Normas_Legales/30933-LEY.pdf'),
    ],
  },
  {
    moduleSlug: 'inmobiliario-comercial', submoduleSlug: 'desalojo-notarial-expreso', blocks: [
      faq('Ley 30933: preguntas de orientación', [
        { question: '¿Cualquier contrato permite usar la vía notarial?', answer: 'No. La Ley 30933 establece requisitos para el contrato, el inmueble y las cláusulas. Debe revisarse el texto legal antes de determinar si un caso califica.' },
        { question: '¿Qué papel puede cumplir el FUA?', answer: 'La ley contempla el Formulario Único de Arrendamiento (FUA) o escritura pública, sujeto a requisitos específicos. Verifica el supuesto aplicable y las formalidades.' },
        { question: '¿La notaría decide por sí sola el lanzamiento?', answer: 'El procedimiento distingue la constatación notarial y la ejecución judicial en los términos de la ley. Revisa la norma y asesórate para un caso concreto.' },
      ]),
      practicalCase('Una cláusula llamada “desalojo exprés”', 'Propietario e inquilino firmaron un contrato privado con una cláusula que usa ese nombre.', 'El contrato no fue revisado para comprobar si cumple las formalidades de la Ley 30933 y no se confirmó cómo se identificó el inmueble.', 'El nombre de la cláusula no demuestra que se cumplan los presupuestos legales. El procedimiento especial requiere revisar el instrumento, las cláusulas y el supuesto invocado.', 'No prometas un resultado por el título del contrato. Solicita revisión legal del documento y consulta el texto vigente de la ley.'),
      list('Verificaciones previas, no una garantía de procedencia', ['Revisa si se utilizó FUA o escritura pública según corresponda.', 'Comprueba la identificación del inmueble y las cláusulas previstas por la ley.', 'Distingue vencimiento del plazo de resolución por falta de pago.', 'Reúne las comunicaciones y documentos exigidos para el supuesto.', 'Busca asesoría legal antes de iniciar o responder un procedimiento.']),
      source('https://leyes.congreso.gob.pe/Documentos/2016_2021/ADLP/Normas_Legales/30933-LEY.pdf'),
    ],
  },
  {
    moduleSlug: 'modulos-complementarios', submoduleSlug: 'propiedad-intelectual-indecopi', blocks: [
      table('Tres activos, protecciones diferentes', ['Activo', 'Qué identifica o protege', 'Dónde orientar la consulta'], [
        ['Marca', 'Distingue productos o servicios en el mercado.', 'Registro de signos distintivos de INDECOPI.'],
        ['Nombre comercial', 'Identifica una actividad económica o establecimiento comercial.', 'INDECOPI; revisa requisitos y prueba de uso.'],
        ['Patente', 'Protege una invención que cumple requisitos legales.', 'Dirección de invenciones y nuevas tecnologías de INDECOPI.'],
      ]),
      practicalCase('Una marca para una línea de productos', 'Una emprendedora diseñó un nombre y un símbolo para vender cosméticos y ofrecer talleres.', 'Quiere protegerlo, pero no sabe si debe registrar una marca, un nombre comercial o una patente.', 'La marca puede distinguir productos o servicios; el nombre comercial identifica una actividad; una patente se refiere a invenciones, no a nombres o logotipos.', 'Define qué signo quieres proteger y para qué productos o servicios. Busca antecedentes y revisa la clase y el trámite oficial antes de solicitarlo.'),
      list('Ruta de revisión de marca', ['Define los productos o servicios que identificará.', 'Busca signos iguales o similares en los canales de INDECOPI.', 'Determina la clase o clases pertinentes con el clasificador oficial.', 'Revisa requisitos, tasas y documentos vigentes.', 'Presenta y monitorea la solicitud; no uses el registro de razón social como sustituto.']),
      source('https://www.gob.pe/institucion/indecopi/pages/333-registrar-la-marca-de-producto-o-servicio-de-tu-negocio-en-indecopi'),
    ],
  },
];

// Exact titles from the initial import. The refresh operation uses these to
// refuse overwriting blocks that were renamed or added manually in the panel.
export const wordContentLegacyTitles: Record<string, string[]> = {
  'regimenes-tributarios': ['Elige con criterio', 'Comparación inicial', 'Preguntas para orientarte', 'Fuente y alcance'],
  'comprobantes-de-pago-electronicos-cpe': ['Cada operación necesita su comprobante', 'Antes de emitir', 'Fuente y alcance'],
  'calendario-de-obligaciones': ['Organiza tus vencimientos', 'Rutina mensual sugerida', 'Fuente y alcance'],
  'contratacion-laboral': ['La relación laboral empieza con claridad', 'Modalidades comunes', 'Antes de incorporar a alguien', 'Fuente y alcance'],
  'beneficios-sociales-regimen-general-vs-remype': ['Primero verifica la condición REMYPE', 'Qué comparar', 'Fuente y alcance'],
  'prevencion-sunafil': ['Prevención antes de una inspección', 'Autoevaluación inicial', 'Fuente y alcance'],
  'tipos-societarios-y-personas-naturales': ['Elige la forma de tu negocio', 'Comparación orientativa', 'Fuente y alcance'],
  'constitucion-de-empresa-paso-a-paso': ['De la idea a la inscripción', 'Ruta de trabajo', 'Fuente y alcance'],
  'gobierno-corporativo-basico': ['Acuerdos que se pueden demostrar', 'Orden societario básico', 'Fuente y alcance'],
  'educacion-financiera-empresarial': ['Caja y utilidad son distintas', 'Hábitos de control', 'Fuente y alcance'],
  'libros-y-registros-contables': ['Para qué sirven los registros', 'Consulta con tu contador', 'Fuente y alcance'],
  'glosario-contable-para-abogados-y-emprendedores': ['Palabras que conviene conocer', 'Términos tributarios frecuentes', 'Fuente y alcance'],
  'contratos-de-arrendamiento-comercial': ['Un local debe servir al negocio', 'Cláusulas para revisar', 'Fuente y alcance'],
  'desalojo-notarial-expreso': ['La vía notarial tiene requisitos', 'Puntos que conviene verificar', 'Fuente y alcance'],
  'propiedad-intelectual-indecopi': ['Protege la identidad de tu emprendimiento', 'Primeros pasos para una marca', 'Fuente y alcance'],
};
