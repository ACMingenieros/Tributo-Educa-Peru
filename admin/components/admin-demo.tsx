'use client';

import { useMemo, useState } from 'react';
import { DemoLogin } from './demo-login';
import { demoContentBlocks, demoModules, demoUsers } from './demo-data';

type View = 'overview' | 'modules' | 'content' | 'users';
const nav: { id: View; label: string; icon: string }[] = [
  { id: 'overview', label: 'Resumen', icon: '⌂' },
  { id: 'modules', label: 'Módulos y submódulos', icon: '▤' },
  { id: 'content', label: 'Contenido educativo', icon: '▧' },
  { id: 'users', label: 'Usuarios y roles', icon: '♙' },
];

export function AdminDemo() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<View>('overview');
  const [notice, setNotice] = useState('');
  if (!entered) return <DemoLogin onExplore={() => setEntered(true)} />;

  return (
    <div className="demo-shell">
      <aside className="demo-sidebar">
        <div className="demo-brand demo-brand-light"><span className="demo-brand-mark">TE</span><span>Tributo Educa<small>PERÚ · ADMINISTRACIÓN</small></span></div>
        <div className="demo-side-caption">ESPACIO DE TRABAJO</div>
        <nav className="demo-nav" aria-label="Navegación administrativa">
          {nav.map((item) => <button key={item.id} className={view === item.id ? 'demo-nav-item active' : 'demo-nav-item'} onClick={() => { setView(item.id); setNotice(''); }}><span aria-hidden="true">{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="demo-sidebar-bottom"><span className="demo-online-dot" /> Modo demostración <small>No conectado a Firebase</small></div>
      </aside>

      <main className="demo-main">
        <header className="demo-topbar">
          <div className="demo-breadcrumb">Administración <span>/</span> {nav.find((item) => item.id === view)?.label}</div>
          <div className="demo-top-actions"><span className="demo-status-chip">DEMO · DATOS FICTICIOS</span><span className="demo-avatar" aria-label="Administrador de demostración">CM</span><button className="demo-exit" onClick={() => { setEntered(false); setView('overview'); }}>Salir</button></div>
        </header>
        <div className="demo-workspace">
          {notice && <p className="demo-toast" role="status">{notice}</p>}
          {view === 'overview' && <Overview onNavigate={setView} />}
          {view === 'modules' && <Modules onNotice={setNotice} />}
          {view === 'content' && <Content onNotice={setNotice} />}
          {view === 'users' && <Users />}
        </div>
      </main>
    </div>
  );
}

function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="demo-page-title"><p className="demo-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div>;
}

function Overview({ onNavigate }: { onNavigate: (view: View) => void }) {
  const metrics = [
    { label: 'Módulos', value: '06', note: 'en el catálogo', icon: '▤', tone: 'green' },
    { label: 'Submódulos', value: '16', note: 'organizados', icon: '▧', tone: 'blue' },
    { label: 'Lecciones publicadas', value: '12', note: 'visibles en la app', icon: '✓', tone: 'violet' },
    { label: 'Borradores', value: '04', note: 'pendientes de revisión', icon: '◷', tone: 'amber' },
  ];
  return <>
    <PageTitle eyebrow="PANEL DE CONTROL" title="Hola, Carlos 👋" description="Este es el estado general del contenido educativo de Tributo Educa Perú." />
    <div className="demo-metrics">{metrics.map((metric) => <article className="demo-metric" key={metric.label}><span className={`demo-metric-icon ${metric.tone}`}>{metric.icon}</span><span className="demo-metric-label">{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></article>)}</div>
    <div className="demo-overview-grid">
      <section className="demo-card demo-recent"><div className="demo-section-heading"><div><h2>Contenido reciente</h2><p>Actividad de ejemplo en el panel</p></div><button className="demo-text-button" onClick={() => onNavigate('content')}>Ver contenido →</button></div>
        {demoContentBlocks.slice(0, 3).map((block, index) => <div className="demo-recent-row" key={block.title}><span className="demo-row-number">0{index + 1}</span><div><strong>{block.title}</strong><small>{block.kind} · Módulo Tributario</small></div><Status value={index < 2 ? 'Publicado' : 'Borrador'} /></div>)}
      </section>
      <section className="demo-card demo-quick"><div className="demo-section-heading"><div><h2>Administrar</h2><p>Explora las secciones del panel</p></div></div>
        <button className="demo-quick-link" onClick={() => onNavigate('modules')}><span className="quick-icon green">▤</span><span><strong>Estructura académica</strong><small>Módulos y submódulos</small></span><b>→</b></button>
        <button className="demo-quick-link" onClick={() => onNavigate('content')}><span className="quick-icon blue">▧</span><span><strong>Editor de contenidos</strong><small>Lecciones y recursos</small></span><b>→</b></button>
        <button className="demo-quick-link" onClick={() => onNavigate('users')}><span className="quick-icon violet">♙</span><span><strong>Equipo</strong><small>Usuarios y permisos</small></span><b>→</b></button>
      </section>
    </div>
    <div className="demo-info-banner"><span aria-hidden="true">ⓘ</span><p><strong>Entorno de demostración.</strong> La información mostrada es ficticia. Las acciones de creación, edición y publicación no están conectadas ni se guardan.</p></div>
  </>;
}

function Status({ value }: { value: string }) {
  return <span className={`demo-status ${value === 'Publicado' || value === 'Activo' ? 'published' : value === 'Invitada' ? 'invited' : 'draft'}`}><i />{value}</span>;
}

function Modules({ onNotice }: { onNotice: (message: string) => void }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(demoModules[0].title);
  const filtered = useMemo(() => demoModules.filter((module) => module.title.toLowerCase().includes(query.toLowerCase())), [query]);
  const current = demoModules.find((module) => module.title === selected) ?? demoModules[0];
  return <>
    <PageTitle eyebrow="ESTRUCTURA ACADÉMICA" title="Módulos y submódulos" description="Organiza las rutas de aprendizaje que verá el usuario en la aplicación móvil." />
    <div className="demo-action-row"><span className="demo-counter">{demoModules.length} módulos · {demoModules.reduce((total, module) => total + module.submodules.length, 0)} submódulos</span><button className="demo-action-button" onClick={() => onNotice('Acción de demostración: la creación de módulos aún no está conectada.')}>＋ Nuevo módulo</button></div>
    <div className="demo-module-layout"><section className="demo-card demo-module-picker"><label className="demo-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar módulo" aria-label="Buscar módulo" /></label>
      <div className="demo-module-options">{filtered.map((module, index) => <button key={module.title} className={`demo-module-option ${module.title === current.title ? 'selected' : ''}`} onClick={() => setSelected(module.title)}><span className="demo-option-icon">{String(index + 1).padStart(2, '0')}</span><span><strong>{module.title}</strong><small>{module.submodules.length} submódulos</small></span><span className="demo-option-arrow">›</span></button>)}{filtered.length === 0 && <p className="demo-empty">No encontramos módulos con ese nombre.</p>}</div>
    </section>
    <section className="demo-card demo-module-detail"><div className="demo-detail-head"><span className="demo-large-icon">▤</span><div><div className="demo-detail-title"><h2>{current.title}</h2><Status value={current.status} /></div><p>{current.description}</p></div><button className="demo-icon-action" aria-label="Editar módulo (demo)" onClick={() => onNotice('La edición es solo visual y no se guarda.')}>···</button></div>
      <div className="demo-section-heading demo-subheading"><div><h3>Submódulos</h3><p>Contenido organizado dentro del módulo</p></div><button className="demo-outline-button" onClick={() => onNotice('Acción de demostración: no se pueden crear submódulos todavía.')}>＋ Agregar</button></div>
      <div className="demo-submodule-list">{current.submodules.map((submodule, index) => <article className="demo-submodule" key={submodule.title}><span className="demo-submodule-order">{String(index + 1).padStart(2, '0')}</span><div className="demo-submodule-copy"><strong>{submodule.title}</strong><small>{submodule.lessons} lecciones · Actualizado recientemente</small></div><Status value={submodule.status} /><button className="demo-icon-action" aria-label={`Opciones de ${submodule.title}`} onClick={() => onNotice('Las opciones de contenido no están conectadas en esta demo.')}>···</button></article>)}</div>
    </section></div>
  </>;
}

function Content({ onNotice }: { onNotice: (message: string) => void }) {
  const [active, setActive] = useState(0);
  return <>
    <PageTitle eyebrow="BIBLIOTECA EDUCATIVA" title="Contenido del módulo" description="Vista de ejemplo de los bloques que pueden componer una lección en la app." />
    <div className="demo-content-toolbar"><div><span className="demo-crumb-label">MÓDULO</span><strong>Tributario <span>›</span> Regímenes Tributarios</strong></div><button className="demo-action-button" onClick={() => onNotice('El editor de contenido todavía no está conectado.')}>＋ Agregar bloque</button></div>
    <div className="demo-content-layout"><section className="demo-card demo-block-list"><div className="demo-section-heading"><div><h2>Bloques de la lección</h2><p>Arrastra para cambiar el orden (demo)</p></div></div>
      {demoContentBlocks.map((block, index) => <button key={block.title} className={`demo-block-row ${active === index ? 'active' : ''}`} onClick={() => setActive(index)}><span className="demo-drag">⠿</span><span className="demo-block-index">{String(index + 1).padStart(2, '0')}</span><span className="demo-block-info"><small>{block.kind}</small><strong>{block.title}</strong></span><span className="demo-block-chevron">›</span></button>)}
      <button className="demo-add-block" onClick={() => onNotice('La incorporación de bloques no se guarda en esta demostración.')}>＋ Añadir un bloque de contenido</button>
    </section><section className="demo-card demo-block-preview"><div className="demo-preview-label"><span>VISTA PREVIA DEL BLOQUE</span><span className="demo-mini-tag">Solo lectura</span></div><div className="demo-preview-paper"><span className="demo-preview-kind">{demoContentBlocks[active].kind}</span><h2>{demoContentBlocks[active].title}</h2><p>{demoContentBlocks[active].detail}</p><div className="demo-preview-foot"><span>◇ Tributo Educa Perú</span><span>Lección 1.1</span></div></div><p className="demo-preview-note">Esta previsualización es referencial; no representa contenido publicado.</p></section></div>
  </>;
}

function Users() {
  return <>
    <PageTitle eyebrow="ACCESO AL PANEL" title="Usuarios y roles" description="Consulta de ejemplo del equipo que podría administrar los contenidos." />
    <div className="demo-user-summary"><div><span className="demo-user-count">03</span><span><strong>Usuarios del panel</strong><small>Datos ficticios para la demostración</small></span></div><button className="demo-action-button" disabled title="No disponible en la demo">＋ Invitar usuario</button></div>
    <section className="demo-card demo-users-card"><div className="demo-section-heading"><div><h2>Equipo administrativo</h2><p>Usuarios de ejemplo · sin acceso real</p></div><span className="demo-mini-tag">Solo lectura</span></div>
      <div className="demo-users-table-wrap"><table className="demo-users-table"><thead><tr><th>USUARIO</th><th>ROL</th><th>ESTADO</th><th>ÚLTIMO ACCESO</th></tr></thead><tbody>{demoUsers.map((user, index) => <tr key={user.email}><td><div className="demo-user-cell"><span className={`demo-user-avatar avatar-${index}`}>{user.name.split(' ').slice(0, 2).map((part) => part[0]).join('')}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td><td>{user.role}</td><td><Status value={user.status} /></td><td className="demo-last-seen">{index === 2 ? 'Pendiente' : 'Hoy, 09:4' + (index + 2) + ' a. m.'}</td></tr>)}</tbody></table></div>
    </section><div className="demo-info-banner"><span aria-hidden="true">ⓘ</span><p>La administración de usuarios, roles y permisos no tiene funcionalidad en esta versión de demostración.</p></div>
  </>;
}
