import type { ComponentType, ContentComponent } from '@tributo-educa/contracts';

export interface ContentField {
  key: string;
  label: string;
  hint?: string;
  multiline?: boolean;
  required?: boolean;
  format?: 'url' | 'json' | 'lines' | 'table-rows' | 'faq-rows';
}

export const contentFields: Record<ComponentType, ContentField[]> = {
  rich_text: [
    { key: 'body', label: 'Contenido', multiline: true, required: true, hint: 'Escribe texto simple y usa saltos de línea para separar ideas.' },
  ],
  image: [
    { key: 'url', label: 'URL del recurso', required: true, format: 'url', hint: 'La carga directa a Firebase Storage se conectará cuando se definan formatos y límites.' },
    { key: 'altText', label: 'Texto alternativo', required: true },
    { key: 'caption', label: 'Pie de imagen', multiline: true },
  ],
  document: [
    { key: 'url', label: 'URL del documento', required: true, format: 'url' },
    { key: 'fileName', label: 'Nombre del documento', required: true },
    { key: 'description', label: 'Descripción', multiline: true },
  ],
  info_card: [
    { key: 'body', label: 'Texto de la tarjeta', required: true, multiline: true },
    { key: 'label', label: 'Etiqueta opcional' },
  ],
  comparison_table: [
    { key: 'columns', label: 'Columnas', required: true, multiline: true, format: 'lines', hint: 'Una columna por línea.' },
    { key: 'rows', label: 'Filas', required: true, multiline: true, format: 'table-rows', hint: 'Una fila por línea; separa las celdas con |.' },
    { key: 'source', label: 'Fuente o nota', multiline: true },
  ],
  faq: [
    { key: 'items', label: 'Preguntas y respuestas', required: true, multiline: true, format: 'faq-rows', hint: 'Una por línea con formato: pregunta | respuesta.' },
  ],
  video: [
    { key: 'url', label: 'URL del video', required: true, format: 'url' },
    { key: 'caption', label: 'Descripción', multiline: true },
  ],
  practical_case: [
    { key: 'context', label: 'Contexto', required: true, multiline: true },
    { key: 'facts', label: 'Datos del caso', multiline: true },
    { key: 'analysis', label: 'Análisis', required: true, multiline: true },
    { key: 'conclusion', label: 'Conclusión', required: true, multiline: true },
  ],
  exam: [
    { key: 'instructions', label: 'Instrucciones', multiline: true },
    { key: 'questions', label: 'Preguntas (JSON)', required: true, multiline: true, format: 'json', hint: 'Se requiere JSON válido. Define preguntas, alternativas, respuesta correcta y retroalimentación.' },
  ],
  checklist: [
    { key: 'items', label: 'Elementos de la lista', required: true, multiline: true, format: 'lines', hint: 'Un elemento por línea.' },
  ],
  glossary: [
    { key: 'term', label: 'Término', required: true },
    { key: 'definition', label: 'Definición', required: true, multiline: true },
    { key: 'source', label: 'Fuente', multiline: true },
  ],
  simulator: [
    { key: 'introduction', label: 'Introducción', multiline: true },
    { key: 'questions', label: 'Flujo de preguntas (JSON)', required: true, multiline: true, format: 'json', hint: 'No se ejecuta lógica hasta que el formato se implemente y valide en la app móvil.' },
    { key: 'outcomes', label: 'Resultados (JSON)', required: true, multiline: true, format: 'json' },
  ],
  calculator: [
    { key: 'introduction', label: 'Introducción', multiline: true },
    { key: 'inputs', label: 'Datos de entrada (JSON)', required: true, multiline: true, format: 'json' },
    { key: 'formulaDescription', label: 'Descripción de la fórmula', required: true, multiline: true, hint: 'Indica la fuente normativa o técnica que respalda el cálculo.' },
  ],
  alert_calendar: [
    { key: 'description', label: 'Descripción', multiline: true },
    { key: 'schedule', label: 'Fechas y reglas (JSON)', required: true, multiline: true, format: 'json', hint: 'Incluye el año y la fuente oficial del cronograma.' },
    { key: 'source', label: 'Fuente oficial', required: true },
  ],
  legal_notice: [
    { key: 'body', label: 'Aviso', required: true, multiline: true },
    { key: 'source', label: 'Fuente normativa o institucional', multiline: true },
    { key: 'lastReviewedAt', label: 'Fecha de última revisión' },
  ],
};

export function emptyFieldValues(type: ComponentType): Record<string, string> {
  return Object.fromEntries(contentFields[type].map((field) => [field.key, '']));
}

export function fieldValuesFromComponent(component: ContentComponent): Record<string, string> {
  const values = emptyFieldValues(component.type);
  for (const field of contentFields[component.type]) {
    const value = component.data[field.key];
    if (field.format === 'lines' && Array.isArray(value)) {
      values[field.key] = value.join('\n');
    } else if (field.format === 'table-rows' && Array.isArray(value)) {
      values[field.key] = value
        .map((row) => (Array.isArray(row) ? row.join(' | ') : ''))
        .join('\n');
    } else if (field.format === 'faq-rows' && Array.isArray(value)) {
      values[field.key] = value
        .map((item) => {
          const entry = item as { question?: string; answer?: string };
          return `${entry.question ?? ''} | ${entry.answer ?? ''}`;
        })
        .join('\n');
    } else if (value !== undefined && value !== null) {
      values[field.key] = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
    }
  }
  return values;
}

export function parseFieldValues(
  type: ComponentType,
  values: Record<string, string>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of contentFields[type]) {
    const value = values[field.key]?.trim() ?? '';
    if (field.required && !value) throw new Error(`Completa el campo «${field.label}».`);

    switch (field.format) {
      case 'url': {
        if (!value) break;
        let url: URL;
        try {
          url = new URL(value);
        } catch {
          throw new Error(`«${field.label}» debe ser una URL válida.`);
        }
        if (url.protocol !== 'https:' && url.protocol !== 'http:') {
          throw new Error(`«${field.label}» debe comenzar con https:// o http://.`);
        }
        result[field.key] = value;
        break;
      }
      case 'json': {
        if (!value) break;
        try {
          result[field.key] = JSON.parse(value) as unknown;
        } catch {
          throw new Error(`«${field.label}» debe contener JSON válido.`);
        }
        break;
      }
      case 'lines': {
        result[field.key] = value.split('\n').map((item) => item.trim()).filter(Boolean);
        break;
      }
      case 'table-rows': {
        const rows = value.split('\n').map((line) => line.split('|').map((cell) => cell.trim()));
        if (rows.some((row) => row.length < 2 || row.some((cell) => !cell))) {
          throw new Error('Cada fila debe incluir al menos dos celdas separadas por |.');
        }
        result[field.key] = rows;
        break;
      }
      case 'faq-rows': {
        const items = value.split('\n').filter((line) => line.trim()).map((line) => {
          const [question, ...answerParts] = line.split('|');
          const answer = answerParts.join('|').trim();
          if (!question?.trim() || !answer) throw new Error('Cada línea debe tener pregunta | respuesta.');
          return { question: question.trim(), answer };
        });
        result[field.key] = items;
        break;
      }
      default:
        if (value) result[field.key] = value;
    }
  }
  return result;
}
