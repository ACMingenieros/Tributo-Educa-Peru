'use client';

import Image from 'next/image';

import type { ComponentType, ContentComponent, Module, Submodule } from '@tributo-educa/contracts';
import { useEffect, useRef } from 'react';
import { contentFields } from '../lib/content-fields';

export type PreviewComponent = Pick<ContentComponent, 'id' | 'type' | 'title' | 'data' | 'order' | 'isVisible'>;

export function previewDataFromValues(type: ComponentType, values: Record<string, string>) {
  return Object.fromEntries(contentFields[type].map((field) => {
    const value = values[field.key]?.trim() ?? '';
    if (field.format === 'lines') return [field.key, value.split('\n').map((line) => line.trim()).filter(Boolean)];
    if (field.format === 'table-rows') return [field.key, value.split('\n').filter(Boolean).map((line) => ({ cells: line.split('|').map((cell) => cell.trim()) }))];
    if (field.format === 'faq-rows') return [field.key, value.split('\n').filter(Boolean).map((line) => { const [question, ...answer] = line.split('|'); return { question: question.trim(), answer: answer.join('|').trim() }; })];
    if (field.format === 'json') {
      try { return [field.key, value ? JSON.parse(value) as unknown : null]; } catch { return [field.key, null]; }
    }
    return [field.key, value];
  }));
}

export function MobileLessonPreview({
  module, submodule, components, focusId,
}: {
  module: Module | null;
  submodule: Submodule;
  components: PreviewComponent[];
  focusId?: string;
}) {
  const screenRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!focusId) return;
    screenRef.current?.querySelector(`[data-preview-id="${focusId}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [components, focusId]);

  return (
    <div className="mobile-preview-shell">
      <div className="mobile-preview-label"><span className="preview-live-dot" /> VISTA PREVIA EN VIVO</div>
      <div className="preview-phone">
        <div className="preview-statusbar"><span>9:41</span><span>● ● ● ▰</span></div>
        <div className="preview-topline"><Image className="preview-brand" src="/tributo-educa-logo.png" alt="" width={30} height={30} /><span>Tributo Educa Perú</span><span className="preview-avatar">C</span></div>
        <div className="preview-screen" ref={screenRef}>
          <div className="preview-notice"><span aria-hidden="true">ⓘ</span><span>Contenido educativo. No reemplaza asesoría tributaria, legal o contable profesional.</span></div>
          <p className="preview-eyebrow">{module?.title || 'MÓDULO EDUCATIVO'}</p>
          <h2>{submodule.title || 'Título de la lección'}</h2>
          {submodule.description && <p className="preview-description">{submodule.description}</p>}
          <div className="preview-blocks">
            {components.filter((item) => item.isVisible).sort((a, b) => a.order - b.order).map((item) => (
              <article className={`preview-component preview-component--${item.type}`} data-preview-id={item.id} key={item.id}>
                {item.title && <h3>{item.title}</h3>}
                <PreviewContent type={item.type} data={item.data} />
              </article>
            ))}
            {components.every((item) => !item.isVisible) && <div className="preview-empty">El bloque que agregues aparecerá aquí.</div>}
          </div>
          <div className="preview-home-indicator" />
        </div>
      </div>
      <p className="preview-caption">Apariencia aproximada de la app móvil · ancho de pantalla 360 px</p>
    </div>
  );
}

function PreviewContent({ type, data }: { type: ComponentType; data: Record<string, unknown> }) {
  const text = (key: string, fallback = '') => typeof data[key] === 'string' ? data[key] as string : fallback;
  const list = (key: string) => Array.isArray(data[key]) ? data[key] as unknown[] : [];
  const strings = (key: string) => list(key).filter((item): item is string => typeof item === 'string');
  const jsonList = (key: string) => list(key).filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object' && !Array.isArray(item)));
  const rows = list('rows').map((row) => row && typeof row === 'object' && 'cells' in row ? (row as { cells: unknown }).cells : row).filter(Array.isArray) as unknown[][];
  const notice = <span className="preview-disclaimer">Vista visual · la interacción se habilitará en una próxima versión.</span>;

  switch (type) {
    case 'rich_text': return <p className="preview-body">{text('body', 'Tu texto aparecerá aquí con el formato de lectura de la app.')}</p>;
    case 'image': return <div className="preview-media"><div className="preview-image-frame">{text('url') ? <img src={text('url')} alt={text('altText', 'Imagen del contenido')} /> : <span aria-hidden="true">▧</span>}</div>{text('altText') && <small>{text('altText')}</small>}{text('caption') && <p>{text('caption')}</p>}</div>;
    case 'document': return <div className="preview-document"><span className="preview-file-icon">PDF</span><span><strong>{text('fileName', 'Nombre del documento')}</strong><small>{text('description', 'Documento de apoyo')}</small></span><b aria-hidden="true">↓</b></div>;
    case 'info_card': return <div className="preview-info-card"><span>{text('label', 'PARA RECORDAR')}</span><p>{text('body', 'La información clave aparecerá en esta tarjeta.')}</p></div>;
    case 'comparison_table': return <div className="preview-table-wrap"><table className="preview-table"><thead><tr>{strings('columns').map((cell, i) => <th key={i}>{cell}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{stringsFrom(row).map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table>{text('source') && <small>{text('source')}</small>}</div>;
    case 'faq': return <div className="preview-faq">{jsonList('items').map((item, i) => <details key={i} open={i === 0}><summary>{String(item.question || 'Escribe una pregunta')}</summary><p>{String(item.answer || 'La respuesta aparecerá aquí.')}</p></details>)}{jsonList('items').length === 0 && <details open><summary>La pregunta aparecerá aquí</summary><p>La respuesta se actualizará mientras editas.</p></details>}</div>;
    case 'video': return <div className="preview-video"><div className="preview-video-screen"><span>▶</span><small>VIDEO EDUCATIVO</small></div>{text('caption') && <p>{text('caption')}</p>}</div>;
    case 'practical_case': return <div className="preview-case">{(['context', 'facts', 'analysis', 'conclusion'] as const).map((key) => text(key) && <section key={key}><span>{({ context: 'EL CASO', facts: 'DATOS CLAVE', analysis: 'ANÁLISIS', conclusion: 'CONCLUSIÓN' })[key]}</span><p>{text(key)}</p></section>)}</div>;
    case 'exam': return <div className="preview-interactive"><p>{text('instructions', 'Lee cada pregunta y selecciona una respuesta.')}</p>{jsonList('questions').slice(0, 2).map((item, i) => <div className="preview-question" key={i}><strong>{i + 1}. {String(item.question || item.prompt || 'Pregunta de evaluación')}</strong>{arrayValues(item.options || item.alternatives).slice(0, 4).map((option, j) => <span key={j}>◯ {String(option)}</span>)}</div>)}{jsonList('questions').length === 0 && <div className="preview-question"><strong>1. Tu pregunta aparecerá aquí</strong><span>◯ Alternativa de respuesta</span></div>}{notice}</div>;
    case 'checklist': return <ul className="preview-checklist">{strings('items').map((item, i) => <li key={i}><span>✓</span>{item}</li>)}{strings('items').length === 0 && <li><span>✓</span>Los elementos aparecerán aquí</li>}</ul>;
    case 'glossary': return <div className="preview-glossary"><strong>{text('term', 'Término')}</strong><p>{text('definition', 'La definición aparecerá aquí.')}</p>{text('source') && <small>Fuente: {text('source')}</small>}</div>;
    case 'simulator': return <div className="preview-interactive"><p>{text('introduction', 'Responde estas preguntas para explorar un resultado orientativo.')}</p>{jsonList('questions').slice(0, 1).map((item, i) => <div className="preview-question" key={i}><strong>{String(item.question || item.prompt || 'Pregunta del simulador')}</strong>{arrayValues(item.options || item.answers).slice(0, 3).map((option, j) => <span className="preview-option" key={j}>{String(option)}</span>)}</div>)}{jsonList('questions').length === 0 && <div className="preview-question"><strong>Pregunta del simulador</strong><span className="preview-option">Opción de respuesta</span></div>}{notice}</div>;
    case 'calculator': return <div className="preview-interactive"><p>{text('introduction', 'Ingresa los datos para obtener un cálculo orientativo.')}</p>{jsonList('inputs').slice(0, 3).map((input, i) => <label className="preview-input" key={i}>{String(input.label || input.name || `Dato ${i + 1}`)}<span>{String(input.placeholder || 'Escribe un valor')} <b>{String(input.unit || '')}</b></span></label>)}{jsonList('inputs').length === 0 && <label className="preview-input">Dato de entrada<span>Escribe un valor</span></label>}{text('formulaDescription') && <small>{text('formulaDescription')}</small>}{notice}</div>;
    case 'alert_calendar': return <div className="preview-calendar"><p>{text('description', 'Fechas importantes y recomendaciones.')}</p>{jsonList('schedule').slice(0, 4).map((item, i) => <div className="preview-calendar-row" key={i}><span>{String(item.date || item.dueDate || item.day || 'FECHA')}</span><strong>{String(item.title || item.description || item.name || 'Obligación')}</strong></div>)}{jsonList('schedule').length === 0 && <div className="preview-calendar-row"><span>FECHA</span><strong>La obligación aparecerá aquí</strong></div>}{text('source') && <small>Fuente: {text('source')}</small>}</div>;
    case 'legal_notice': return <div className="preview-legal"><span>ⓘ</span><div><p>{text('body', 'El aviso educativo aparecerá aquí.')}</p>{text('source') && <small>Fuente: {text('source')}</small>}</div></div>;
  }
}

function stringsFrom(values: unknown[]) { return values.map((value) => typeof value === 'string' ? value : ''); }
function arrayValues(value: unknown) { return Array.isArray(value) ? value : []; }
