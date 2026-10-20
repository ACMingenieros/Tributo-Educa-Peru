'use client';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getIdTokenResult,
  type User,
} from 'firebase/auth';
import type {
  ComponentType,
  ContentComponent,
  ContentStatus,
  Module,
  Submodule,
  UserRole,
} from '@tributo-educa/contracts';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';

import { componentLabels } from '../lib/firebase/curriculum';
import {
  archiveModule,
  archiveSubmodule,
  createComponent,
  createModule,
  createSubmodule,
  deleteComponent,
  listComponents,
  listModules,
  listSubmodules,
  publishModule,
  publishSubmodule,
  reorderComponents,
  reorderSubmodules,
  saveInitialCurriculum,
  updateComponent,
  updateModule,
  updateSubmodule,
} from '../lib/firebase/content-repository';
import { getFirebaseClient } from '../lib/firebase/client';
import { resolvePanelRole } from '../lib/auth/access.mjs';
import {
  contentFields,
  emptyFieldValues,
  fieldValuesFromComponent,
  parseFieldValues,
} from '../lib/content-fields';

type GateState = 'checking' | 'unconfigured' | 'signed-out' | 'checking-role' | 'forbidden' | 'ready';

export function AdminConsole() {
  const services = useMemo(() => getFirebaseClient(), []);
  const [gate, setGate] = useState<GateState>('checking');
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  useEffect(() => {
    if (!services) {
      setGate('unconfigured');
      return;
    }

    return onAuthStateChanged(services.auth, async (nextUser) => {
      setUser(nextUser);
      setAuthError('');
      if (!nextUser) {
        setRole(null);
        setGate('signed-out');
        return;
      }

      setGate('checking-role');
      try {
        const token = await getIdTokenResult(nextUser, true);
        const resolvedRole = resolvePanelRole(
          nextUser.uid,
          nextUser.email,
          token.claims.role,
        );
        if (resolvedRole) {
          setRole(resolvedRole);
          setGate('ready');
        } else {
          setRole(null);
          setGate('forbidden');
        }
      } catch {
        setRole(null);
        setAuthError('No se pudo verificar tu permiso. Vuelve a iniciar sesión.');
        setGate('forbidden');
      }
    });
  }, [services]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!services) return;
    setAuthBusy(true);
    setAuthError('');
    const form = new FormData(event.currentTarget);
    try {
      await signInWithEmailAndPassword(
        services.auth,
        String(form.get('email') ?? '').trim(),
        String(form.get('password') ?? ''),
      );
    } catch {
      setAuthError('No pudimos iniciar sesión. Revisa tus datos e inténtalo nuevamente.');
    } finally {
      setAuthBusy(false);
    }
  }

  if (gate === 'checking' || gate === 'checking-role') {
    return <main className="gate-screen"><div className="loader" /><p>Verificando acceso...</p></main>;
  }

  if (gate === 'unconfigured' || !services) {
    return (
      <main className="gate-screen">
        <section className="gate-card">
          <BrandMark />
          <p className="eyebrow">CONFIGURACIÓN INICIAL</p>
          <h1>Conecta el proyecto Firebase</h1>
          <p className="muted-copy">
            El panel necesita un proyecto Firebase para iniciar sesión y guardar contenido.
            Crea una app web en Firebase y copia sus valores en <code>admin/.env.local</code>
            usando <code>admin/.env.example</code> como guía.
          </p>
          <div className="notice notice-info">
            La configuración web identifica el proyecto; los permisos reales los aplican
            Authentication y las reglas de Firestore.
          </div>
        </section>
      </main>
    );
  }

  if (gate === 'signed-out') {
    return (
      <main className="gate-screen login-screen">
        <div className="login-layout">
          <section className="login-intro" aria-label="Tributo Educa Perú">
            <BrandMark inverse />
            <div className="login-intro-copy">
              <p className="login-kicker">APRENDIZAJE QUE IMPULSA</p>
              <h1>Conocimiento claro para tomar mejores decisiones.</h1>
              <p>Administra los contenidos que ayudan a cada persona a entender y formalizar su negocio.</p>
            </div>
            <div className="login-intro-foot"><span aria-hidden="true" /> Plataforma educativa para el Perú</div>
          </section>

          <section className="login-panel" aria-labelledby="login-title">
            <div className="login-form-wrap">
              <p className="eyebrow">ACCESO ADMINISTRATIVO</p>
              <h2 id="login-title">Te damos la bienvenida</h2>
              <p className="muted-copy">Ingresa con tu cuenta autorizada para continuar.</p>
              <form className="stack-form login-form" onSubmit={handleLogin}>
                <label className="field-label" htmlFor="email">Correo electrónico</label>
                <input id="email" name="email" type="email" autoComplete="username" placeholder="nombre@correo.com" required />
                <label className="field-label" htmlFor="password">Contraseña</label>
                <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Ingresa tu contraseña" required />
                {authError && <p className="form-error" role="alert">{authError}</p>}
                <button className="button button-primary button-wide login-submit" type="submit" disabled={authBusy}>
                  {authBusy ? 'Ingresando...' : 'Iniciar sesión'}
                  {!authBusy && <span aria-hidden="true">→</span>}
                </button>
              </form>
              <p className="login-security">
                <svg aria-hidden="true" viewBox="0 0 16 16" focusable="false"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3.5 7h9v7h-9z" /></svg>
                Acceso seguro protegido por Firebase
              </p>
            </div>
            <footer className="login-footer">© 2026 Tributo Educa Perú</footer>
          </section>
        </div>
      </main>
    );
  }

  if (gate === 'forbidden') {
    return (
      <main className="gate-screen">
        <section className="gate-card">
          <BrandMark />
          <p className="eyebrow">ACCESO RESTRINGIDO</p>
          <h1>Tu cuenta no tiene un rol administrativo</h1>
          <p className="muted-copy">
            Ingresa con la cuenta administradora configurada o con una cuenta editora autorizada.
          </p>
          {authError && <p className="form-error" role="alert">{authError}</p>}
          <button className="button button-secondary button-wide" onClick={() => services && signOut(services.auth)}>
            Cerrar sesión
          </button>
        </section>
      </main>
    );
  }

  if (!user || !role) return null;
  return (
    <ContentWorkspace
      db={services.db}
      user={user}
      role={role}
      onSignOut={() => signOut(services.auth)}
    />
  );
}

function ContentWorkspace({
  db,
  user,
  role,
  onSignOut,
}: {
  db: NonNullable<ReturnType<typeof getFirebaseClient>>['db'];
  user: User;
  role: UserRole;
  onSignOut: () => void;
}) {
  const [modules, setModules] = useState<Module[]>([]);
  const [submodules, setSubmodules] = useState<Submodule[]>([]);
  const [components, setComponents] = useState<ContentComponent[]>([]);
  const [moduleId, setModuleId] = useState('');
  const [submoduleId, setSubmoduleId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submodulesLoading, setSubmodulesLoading] = useState(false);
  const [componentsLoading, setComponentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [moduleDialog, setModuleDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [submoduleDialog, setSubmoduleDialog] = useState(false);
  const [componentDialog, setComponentDialog] = useState(false);
  const [editingComponent, setEditingComponent] = useState<ContentComponent | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedModule = modules.find((item) => item.id === moduleId) ?? null;
  const selectedSubmodule = submodules.find((item) => item.id === submoduleId) ?? null;
  const filteredModules = modules.filter((item) =>
    `${item.title} ${item.description}`.toLowerCase().includes(search.toLowerCase()),
  );

  const refreshModules = useCallback(async () => {
    const result = await listModules(db, role);
    setModules(result);
    setModuleId((current) => result.some((item) => item.id === current) ? current : result[0]?.id ?? '');
  }, [db, role]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listModules(db, role)
      .then((result) => {
        if (!alive) return;
        setModules(result);
        setModuleId((current) => result.some((item) => item.id === current) ? current : result[0]?.id ?? '');
        setError('');
      })
      .catch(() => alive && setError('No se pudieron cargar los módulos. Revisa la conexión y las reglas de Firestore.'))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [db, role]);

  useEffect(() => {
    if (!moduleId) {
      setSubmodules([]);
      setSubmoduleId('');
      return;
    }
    let alive = true;
    setSubmodulesLoading(true);
    setSubmoduleId('');
    setComponents([]);
    listSubmodules(db, moduleId, role)
      .then((result) => {
        if (!alive) return;
        setSubmodules(result);
        setError('');
      })
      .catch(() => alive && setError('No se pudieron cargar los submódulos.'))
      .finally(() => alive && setSubmodulesLoading(false));
    return () => { alive = false; };
  }, [db, moduleId, role]);

  useEffect(() => {
    if (!moduleId || !submoduleId) {
      setComponents([]);
      return;
    }
    let alive = true;
    setComponentsLoading(true);
    listComponents(db, moduleId, submoduleId, role)
      .then((result) => alive && setComponents(result))
      .catch(() => alive && setError('No se pudieron cargar los componentes.'))
      .finally(() => alive && setComponentsLoading(false));
    return () => { alive = false; };
  }, [db, moduleId, role, submoduleId]);

  async function runAction(action: () => Promise<void>, successMessage: string) {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await action();
      setNotice(successMessage);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo completar la operación.');
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedCurriculum() {
    if (!window.confirm('Se crearán como borradores los seis módulos y sus submódulos del documento Word.')) return;
    await runAction(async () => {
      await saveInitialCurriculum(db, user.uid);
      await refreshModules();
    }, 'Estructura inicial creada como borrador.');
  }

  async function handleSaveModule(input: {
    title: string;
    slug: string;
    description: string;
    order: number;
  }) {
    if (editingModule?.status === 'published' && !window.confirm('Al guardar, el módulo pasará a borrador y dejará de mostrarse en la app hasta que vuelvas a publicarlo. ¿Continuar?')) return;
    const action = async () => {
      if (editingModule) {
        await updateModule(db, editingModule.id, { ...input, isVisible: editingModule.isVisible }, user.uid);
      } else {
        const created = await createModule(db, { ...input, isVisible: true }, user.uid);
        setModuleId(created.id);
      }
      await refreshModules();
      setModuleDialog(false);
      setEditingModule(null);
    };
    await runAction(action, 'Módulo guardado como borrador.');
  }

  async function handleSaveSubmodule(input: {
    title: string;
    slug: string;
    description: string;
    order: number;
  }) {
    if (!moduleId) return;
    if (!submoduleDialog && selectedSubmodule?.status === 'published' && !window.confirm('Al guardar, el submódulo pasará a borrador y dejará de mostrarse en la app hasta que vuelvas a publicarlo. ¿Continuar?')) return;
    await runAction(async () => {
      if (selectedSubmodule && submoduleDialog === false) {
        await updateSubmodule(db, moduleId, selectedSubmodule.id, { ...input, isVisible: selectedSubmodule.isVisible }, user.uid);
      } else {
        const created = await createSubmodule(db, moduleId, { ...input, isVisible: true }, user.uid);
        setSubmoduleId(created.id);
      }
      const result = await listSubmodules(db, moduleId, role);
      setSubmodules(result);
      setSubmoduleDialog(false);
    }, 'Submódulo guardado como borrador.');
  }

  async function handleSaveComponent(type: ComponentType, title: string, data: Record<string, unknown>) {
    if (!moduleId || !submoduleId) return;
    await runAction(async () => {
      if (editingComponent) {
        const updated = { ...editingComponent, type, title, data, status: 'draft' as const, publishedAt: null };
        await updateComponent(db, moduleId, submoduleId, updated, user.uid);
        setComponents((current) => current.map((item) => item.id === updated.id ? updated : item));
        setSubmodules(await listSubmodules(db, moduleId, role));
      } else {
        const created = await createComponent(
          db,
          moduleId,
          submoduleId,
          { type, title, data, order: components.length },
          user.uid,
        );
        setComponents((current) => [...current, created].sort((a, b) => a.order - b.order));
      }
      setComponentDialog(false);
      setEditingComponent(null);
    }, 'Componente guardado como borrador.');
  }

  async function handlePublishModule() {
    if (!selectedModule || role !== 'admin') return;
    if (!window.confirm(`¿Publicar “${selectedModule.title}”? Sus submódulos seguirán teniendo que publicarse individualmente.`)) return;
    await runAction(async () => {
      await publishModule(db, selectedModule.id, user.uid);
      await refreshModules();
    }, 'Módulo publicado.');
  }

  async function handlePublishSubmodule() {
    if (!selectedModule || !selectedSubmodule || role !== 'admin') return;
    const visibleComponents = components.filter((item) => item.isVisible);
    if (visibleComponents.length === 0) {
      setError('Agrega al menos un componente visible antes de publicar el submódulo.');
      return;
    }
    try {
      for (const component of visibleComponents) {
        parseFieldValues(component.type, componentFieldValues(component));
      }
    } catch (caught) {
      setError(caught instanceof Error ? `Revisa los componentes: ${caught.message}` : 'Hay componentes incompletos.');
      return;
    }
    if (!window.confirm(`¿Publicar “${selectedSubmodule.title}” en la aplicación móvil?`)) return;
    await runAction(async () => {
      await publishSubmodule(db, selectedModule.id, selectedSubmodule.id, user.uid);
      const [nextSubmodules, nextComponents] = await Promise.all([
        listSubmodules(db, selectedModule.id, role),
        listComponents(db, selectedModule.id, selectedSubmodule.id, role),
      ]);
      setSubmodules(nextSubmodules);
      setComponents(nextComponents);
    }, 'Submódulo publicado.');
  }

  async function handleArchiveModule(module: Module) {
    if (role !== 'admin' || !window.confirm(`¿Archivar “${module.title}”? Dejará de aparecer en la app móvil.`)) return;
    await runAction(async () => {
      await archiveModule(db, module.id, user.uid);
      await refreshModules();
    }, 'Módulo archivado.');
  }

  async function handleArchiveSubmodule(submodule: Submodule) {
    if (role !== 'admin' || !moduleId || !window.confirm(`¿Archivar “${submodule.title}”?`)) return;
    await runAction(async () => {
      await archiveSubmodule(db, moduleId, submodule.id, user.uid);
      setSubmodules(await listSubmodules(db, moduleId, role));
      if (submoduleId === submodule.id) setSubmoduleId('');
    }, 'Submódulo archivado.');
  }

  async function handleDeleteComponent(component: ContentComponent) {
    if (role !== 'admin' || !moduleId || !submoduleId || !window.confirm(`¿Eliminar el componente “${component.title || componentLabels[component.type]}”? Esta acción no se puede deshacer.`)) return;
    await runAction(async () => {
      await deleteComponent(db, moduleId, submoduleId, component.id);
      setComponents((current) => current.filter((item) => item.id !== component.id));
    }, 'Componente eliminado.');
  }

  async function moveComponent(index: number, direction: -1 | 1) {
    const next = [...components];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= next.length || !moduleId || !submoduleId) return;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setComponents(next.map((item, order) => ({ ...item, order })));
    await runAction(() => reorderComponents(db, moduleId, submoduleId, next, user.uid), 'Orden de componentes actualizado.');
  }

  async function moveSubmodule(index: number, direction: -1 | 1) {
    const next = [...submodules];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= next.length || !moduleId) return;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setSubmodules(next.map((item, order) => ({ ...item, order })));
    await runAction(() => reorderSubmodules(db, moduleId, next, user.uid), 'Orden de submódulos actualizado.');
  }

  if (loading) {
    return <main className="gate-screen"><div className="loader" /><p>Cargando contenidos...</p></main>;
  }

  return (
    <div className="admin-frame">
      <aside className="admin-sidebar">
        <BrandMark inverse />
        <div className="sidebar-section-label">CONTENIDO</div>
        <button className="sidebar-link active" type="button">
          <span aria-hidden="true">▤</span> Módulos y submódulos
        </button>
        <div className="sidebar-footer">
          <span className="status-dot" /> Firebase configurado
          <small>Contenido en Firestore</small>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="mobile-brand"><BrandMark /></div>
          <div className="topbar-spacer" />
          <div className="user-menu">
            <span className="role-pill">{role === 'admin' ? 'Administrador' : 'Editor'}</span>
            <span className="user-email">{user.email}</span>
            <button className="button button-quiet button-small" onClick={onSignOut}>Salir</button>
          </div>
        </header>

        <main className="workspace">
          <div className="page-heading">
            <div>
              <p className="eyebrow">ADMINISTRACIÓN DE CONTENIDOS</p>
              <h1>Módulos educativos</h1>
              <p className="muted-copy">Organiza el contenido y publícalo para que llegue a la aplicación móvil.</p>
            </div>
            <div className="heading-actions">
              <button className="button button-secondary" onClick={() => setPreviewOpen(true)} disabled={!selectedSubmodule}>
                Vista previa
              </button>
              <button className="button button-primary" onClick={() => { setEditingModule(null); setModuleDialog(true); }}>+ Nuevo módulo</button>
            </div>
          </div>

          {error && <div className="notice notice-error" role="alert">{error}</div>}
          {notice && <div className="notice notice-success" role="status">{notice}</div>}

          <div className="content-layout">
            <section className="module-panel" aria-label="Lista de módulos">
              <div className="panel-heading">
                <div>
                  <h2>Módulos</h2>
                  <span className="muted-copy">{modules.length} en total</span>
                </div>
                <span className="count-badge">{modules.filter((item) => item.status === 'published').length} publicados</span>
              </div>
              <label className="search-field">
                <span className="sr-only">Buscar módulos</span>
                <span aria-hidden="true">⌕</span>
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar módulo" />
              </label>

              {filteredModules.length ? (
                <div className="module-list">
                  {filteredModules.map((item) => (
                    <button
                      type="button"
                      className={`module-list-item ${item.id === moduleId ? 'selected' : ''}`}
                      key={item.id}
                      onClick={() => { setModuleId(item.id); setSubmoduleId(''); }}
                    >
                      <span className="module-icon" aria-hidden="true">{moduleIcon(item.title)}</span>
                      <span className="module-copy">
                        <strong>{item.title}</strong>
                        <small>{item.description || 'Sin descripción'}</small>
                      </span>
                      <StatusBadge status={item.status} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="empty-state compact-empty">
                  <span className="empty-icon">▤</span>
                  <h3>{modules.length ? 'Sin resultados' : 'Aún no hay módulos'}</h3>
                  <p>{modules.length ? 'Prueba con otro término.' : 'Crea un módulo o carga la estructura del Word.'}</p>
                  {!modules.length && role === 'admin' && (
                    <button className="button button-secondary button-small" onClick={handleSeedCurriculum} disabled={saving}>
                      Cargar estructura del Word
                    </button>
                  )}
                </div>
              )}
            </section>

            <section className="detail-panel" aria-label="Detalle del módulo">
              {selectedModule ? (
                submoduleId && selectedSubmodule ? (
                  <SubmoduleEditor
                    module={selectedModule}
                    submodule={selectedSubmodule}
                    components={components}
                    componentsLoading={componentsLoading}
                    role={role}
                    saving={saving}
                    onBack={() => setSubmoduleId('')}
                    onSave={handleSaveSubmodule}
                    onAddComponent={() => { setEditingComponent(null); setComponentDialog(true); }}
                    onEditComponent={(component) => { setEditingComponent(component); setComponentDialog(true); }}
                    onMoveComponent={moveComponent}
                    onDeleteComponent={handleDeleteComponent}
                    onPublish={handlePublishSubmodule}
                    onRefresh={() => listComponents(db, moduleId, submoduleId, role).then(setComponents)}
                  />
                ) : (
                  <ModuleDetail
                    module={selectedModule}
                    submodules={submodules}
                    loading={submodulesLoading}
                    role={role}
                    saving={saving}
                    onEdit={() => { setEditingModule(selectedModule); setModuleDialog(true); }}
                    onAddSubmodule={() => setSubmoduleDialog(true)}
                    onOpenSubmodule={(id) => setSubmoduleId(id)}
                    onMoveSubmodule={moveSubmodule}
                    onArchiveSubmodule={handleArchiveSubmodule}
                    onPublish={handlePublishModule}
                    onArchiveModule={() => handleArchiveModule(selectedModule)}
                  />
                )
              ) : (
                <div className="empty-state detail-empty">
                  <span className="empty-icon">▤</span>
                  <h2>Empieza con la estructura de contenidos</h2>
                  <p>Crea módulos manualmente o carga los seis módulos y sus submódulos definidos en el documento Word.</p>
                  <div className="empty-actions">
                    <button className="button button-primary" onClick={() => { setEditingModule(null); setModuleDialog(true); }}>Crear módulo</button>
                    {role === 'admin' && modules.length === 0 && (
                      <button className="button button-secondary" onClick={handleSeedCurriculum} disabled={saving}>
                        Cargar estructura del Word
                      </button>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      {moduleDialog && (
        <ModuleFormDialog
          module={editingModule}
          count={modules.length}
          onClose={() => setModuleDialog(false)}
          onSave={handleSaveModule}
        />
      )}
      {submoduleDialog && selectedModule && (
        <SubmoduleFormDialog
          submodule={null}
          count={submodules.length}
          onClose={() => setSubmoduleDialog(false)}
          onSave={handleSaveSubmodule}
        />
      )}
      {componentDialog && selectedSubmodule && (
        <ComponentFormDialog
          component={editingComponent}
          saving={saving}
          onClose={() => { setComponentDialog(false); setEditingComponent(null); }}
          onSave={handleSaveComponent}
        />
      )}
      {previewOpen && selectedSubmodule && (
        <PreviewDialog
          module={selectedModule}
          submodule={selectedSubmodule}
          components={components}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className={`brand-mark ${inverse ? 'inverse' : ''}`}>
      <span className="brand-symbol" aria-hidden="true">TE</span>
      <span className="brand-name">Tributo Educa<small>Perú · Administración</small></span>
    </div>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const labels: Record<ContentStatus, string> = {
    draft: 'Borrador',
    published: 'Publicado',
    archived: 'Archivado',
    coming_soon: 'Próximamente',
  };
  return <span className={`status-badge status-${status}`}>{labels[status]}</span>;
}

function ModuleDetail({
  module,
  submodules,
  loading,
  role,
  saving,
  onEdit,
  onAddSubmodule,
  onOpenSubmodule,
  onMoveSubmodule,
  onArchiveSubmodule,
  onPublish,
  onArchiveModule,
}: {
  module: Module;
  submodules: Submodule[];
  loading: boolean;
  role: UserRole;
  saving: boolean;
  onEdit: () => void;
  onAddSubmodule: () => void;
  onOpenSubmodule: (id: string) => void;
  onMoveSubmodule: (index: number, direction: -1 | 1) => void;
  onArchiveSubmodule: (submodule: Submodule) => void;
  onPublish: () => void;
  onArchiveModule: () => void;
}) {
  return (
    <>
      <div className="detail-heading">
        <div className="detail-title-group">
          <span className="module-icon large" aria-hidden="true">{moduleIcon(module.title)}</span>
          <div>
            <p className="eyebrow">ESTRUCTURA DEL MÓDULO</p>
            <h2>{module.title}</h2>
            <p className="muted-copy">{module.description || 'Añade una descripción para orientar a los usuarios.'}</p>
          </div>
        </div>
        <div className="detail-actions">
          <StatusBadge status={module.status} />
          <button className="button button-secondary button-small" onClick={onEdit}>Editar datos</button>
          {role === 'admin' && module.status !== 'published' && (
            <button className="button button-primary button-small" onClick={onPublish} disabled={saving}>Publicar módulo</button>
          )}
          {role === 'admin' && module.status !== 'archived' && (
            <button className="button button-quiet button-small" onClick={onArchiveModule} disabled={saving}>Archivar</button>
          )}
        </div>
      </div>

      <div className="submodule-heading">
        <div>
          <h3>Submódulos</h3>
          <p className="muted-copy">Ordena las lecciones y administra su publicación.</p>
        </div>
        <button className="button button-primary" onClick={onAddSubmodule}>+ Nuevo submódulo</button>
      </div>

      {loading ? <div className="loading-line"><span className="loader small" /> Cargando submódulos...</div> : (
        submodules.length ? (
          <div className="submodule-table-wrap">
            <table className="content-table">
              <thead><tr><th>Orden</th><th>Submódulo</th><th>Estado</th><th>Actualizado</th><th><span className="sr-only">Acciones</span></th></tr></thead>
              <tbody>
                {submodules.map((item, index) => (
                  <tr key={item.id}>
                    <td><div className="order-controls">
                      <button aria-label={`Mover ${item.title} hacia arriba`} disabled={index === 0 || saving} onClick={() => onMoveSubmodule(index, -1)}>↑</button>
                      <span>{index + 1}</span>
                      <button aria-label={`Mover ${item.title} hacia abajo`} disabled={index === submodules.length - 1 || saving} onClick={() => onMoveSubmodule(index, 1)}>↓</button>
                    </div></td>
                    <td><button className="table-title-button" onClick={() => onOpenSubmodule(item.id)}>{item.title}<small>{item.description || 'Sin descripción'}</small></button></td>
                    <td><StatusBadge status={item.status} /></td>
                    <td className="date-cell">{formatDate(item.updatedAt)}</td>
                    <td>{role === 'admin' && item.status !== 'archived' && <button className="button button-quiet button-small" onClick={() => onArchiveSubmodule(item)}>Archivar</button>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state table-empty">
            <span className="empty-icon">▧</span>
            <h3>Este módulo aún no tiene submódulos</h3>
            <p>Crea una lección para empezar a organizar el contenido educativo.</p>
            <button className="button button-secondary" onClick={onAddSubmodule}>Crear primer submódulo</button>
          </div>
        )
      )}
    </>
  );
}

function SubmoduleEditor({
  module,
  submodule,
  components,
  componentsLoading,
  role,
  saving,
  onBack,
  onSave,
  onAddComponent,
  onEditComponent,
  onMoveComponent,
  onDeleteComponent,
  onPublish,
}: {
  module: Module;
  submodule: Submodule;
  components: ContentComponent[];
  componentsLoading: boolean;
  role: UserRole;
  saving: boolean;
  onBack: () => void;
  onSave: (input: { title: string; slug: string; description: string; order: number }) => void;
  onAddComponent: () => void;
  onEditComponent: (component: ContentComponent) => void;
  onMoveComponent: (index: number, direction: -1 | 1) => void;
  onDeleteComponent: (component: ContentComponent) => void;
  onPublish: () => void;
}) {
  const [title, setTitle] = useState(submodule.title);
  const [slug, setSlug] = useState(submodule.slug);
  const [description, setDescription] = useState(submodule.description);

  useEffect(() => {
    setTitle(submodule.title);
    setSlug(submodule.slug);
    setDescription(submodule.description);
  }, [submodule]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ title: title.trim(), slug: slug.trim(), description: description.trim(), order: submodule.order });
  }

  return (
    <div className="submodule-editor">
      <button className="back-link" onClick={onBack}>← Volver al módulo</button>
      <div className="editor-heading">
        <div><p className="eyebrow">{module.title}</p><h2>{submodule.title}</h2></div>
        <div className="detail-actions"><StatusBadge status={submodule.status} />{role === 'admin' && submodule.status !== 'published' && <button className="button button-primary button-small" onClick={onPublish} disabled={saving}>Publicar</button>}</div>
      </div>

      <form className="metadata-form" onSubmit={submit}>
        <div className="form-grid">
          <label className="form-field"><span>Título</span><input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} /></label>
          <label className="form-field"><span>Identificador URL</span><input value={slug} onChange={(event) => setSlug(event.target.value)} required maxLength={140} /></label>
          <label className="form-field full-width"><span>Descripción breve</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} maxLength={300} /></label>
        </div>
        <div className="form-actions"><span className="muted-copy">Los cambios se guardan como borrador.</span><button className="button button-secondary" disabled={saving}>Guardar datos</button></div>
      </form>

      <div className="component-heading">
        <div><h3>Contenido de la lección</h3><p className="muted-copy">Agrega y ordena los bloques que verá el usuario móvil.</p></div>
        <button className="button button-primary" onClick={onAddComponent}>+ Agregar contenido</button>
      </div>

      {componentsLoading ? <div className="loading-line"><span className="loader small" /> Cargando componentes...</div> : components.length ? (
        <ol className="component-list">
          {components.map((component, index) => (
            <li className="component-item" key={component.id}>
              <span className="drag-handle" aria-hidden="true">⠿</span>
              <div className="component-order">
                <button aria-label="Mover hacia arriba" disabled={index === 0 || saving} onClick={() => onMoveComponent(index, -1)}>↑</button>
                <button aria-label="Mover hacia abajo" disabled={index === components.length - 1 || saving} onClick={() => onMoveComponent(index, 1)}>↓</button>
              </div>
              <div className="component-info">
                <span className="component-type">{componentLabels[component.type]}</span>
                <strong>{component.title || 'Sin título'}</strong>
                <small>{component.isVisible ? 'Visible en la publicación' : 'Oculto para usuarios'}</small>
              </div>
              <button className="button button-quiet button-small" onClick={() => onEditComponent(component)}>Editar</button>
              {role === 'admin' && <button className="icon-button danger-text" aria-label={`Eliminar ${component.title || componentLabels[component.type]}`} onClick={() => onDeleteComponent(component)}>×</button>}
            </li>
          ))}
        </ol>
      ) : (
        <div className="empty-state table-empty">
          <span className="empty-icon">▤</span>
          <h3>Esta lección todavía está vacía</h3>
          <p>Agrega texto, imágenes, tablas, preguntas frecuentes u otro bloque educativo.</p>
          <button className="button button-secondary" onClick={onAddComponent}>Agregar primer componente</button>
        </div>
      )}
    </div>
  );
}

function ModuleFormDialog({
  module,
  count,
  onClose,
  onSave,
}: {
  module: Module | null;
  count: number;
  onClose: () => void;
  onSave: (input: { title: string; slug: string; description: string; order: number }) => void;
}) {
  const [title, setTitle] = useState(module?.title ?? '');
  const [slug, setSlug] = useState(module?.slug ?? '');
  const [description, setDescription] = useState(module?.description ?? '');
  const [order, setOrder] = useState(module?.order ?? count);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave({ title: title.trim(), slug: slug.trim(), description: description.trim(), order: Number(order) });
  }

  return (
    <Dialog title={module ? 'Editar módulo' : 'Crear módulo'} onClose={onClose}>
      <form className="stack-form" onSubmit={submit}>
        <label className="form-field"><span>Título del módulo</span><input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} autoFocus /></label>
        <label className="form-field"><span>Identificador URL</span><input value={slug} onChange={(event) => setSlug(event.target.value)} required maxLength={140} /></label>
        <label className="form-field"><span>Descripción</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} maxLength={300} /></label>
        <label className="form-field"><span>Orden</span><input type="number" min={0} value={order} onChange={(event) => setOrder(Number(event.target.value))} required /></label>
        <p className="muted-copy">El módulo se guardará como borrador. La imagen se podrá asociar cuando se configure la biblioteca de archivos.</p>
        <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary">Guardar borrador</button></div>
      </form>
    </Dialog>
  );
}

function SubmoduleFormDialog({
  submodule,
  count,
  onClose,
  onSave,
}: {
  submodule: Submodule | null;
  count: number;
  onClose: () => void;
  onSave: (input: { title: string; slug: string; description: string; order: number }) => void;
}) {
  const [title, setTitle] = useState(submodule?.title ?? '');
  const [slug, setSlug] = useState(submodule?.slug ?? '');
  const [description, setDescription] = useState(submodule?.description ?? '');
  const [order, setOrder] = useState(submodule?.order ?? count);
  return (
    <Dialog title={submodule ? 'Editar submódulo' : 'Crear submódulo'} onClose={onClose}>
      <form className="stack-form" onSubmit={(event) => { event.preventDefault(); onSave({ title: title.trim(), slug: slug.trim(), description: description.trim(), order: Number(order) }); }}>
        <label className="form-field"><span>Título</span><input value={title} onChange={(event) => { setTitle(event.target.value); if (!submodule) setSlug(event.target.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')); }} required maxLength={120} autoFocus /></label>
        <label className="form-field"><span>Identificador URL</span><input value={slug} onChange={(event) => setSlug(event.target.value)} required maxLength={140} /></label>
        <label className="form-field"><span>Descripción</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} maxLength={300} /></label>
        <label className="form-field"><span>Orden</span><input type="number" min={0} value={order} onChange={(event) => setOrder(Number(event.target.value))} required /></label>
        <p className="muted-copy">Los submódulos se guardan como borrador y no aparecen en la app hasta ser publicados.</p>
        <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary">Guardar borrador</button></div>
      </form>
    </Dialog>
  );
}

function ComponentFormDialog({
  component,
  saving,
  onClose,
  onSave,
}: {
  component: ContentComponent | null;
  saving: boolean;
  onClose: () => void;
  onSave: (type: ComponentType, title: string, data: Record<string, unknown>) => void;
}) {
  const [type, setType] = useState<ComponentType>(component?.type ?? 'rich_text');
  const [title, setTitle] = useState(component?.title ?? '');
  const [values, setValues] = useState<Record<string, string>>(
    component ? fieldValuesFromComponent(component) : emptyFieldValues('rich_text'),
  );
  const [formError, setFormError] = useState('');

  function changeType(nextType: ComponentType) {
    setType(nextType);
    setValues(component?.type === nextType ? fieldValuesFromComponent(component) : emptyFieldValues(nextType));
    setFormError('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    try {
      onSave(type, title.trim(), parseFieldValues(type, values));
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : 'Revisa los campos del componente.');
    }
  }

  return (
    <Dialog title={component ? 'Editar componente' : 'Agregar contenido'} onClose={onClose} wide>
      <form className="stack-form component-form" onSubmit={submit}>
        <label className="form-field"><span>Tipo de contenido</span><select value={type} onChange={(event) => changeType(event.target.value as ComponentType)}>{Object.entries(componentLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label className="form-field"><span>Título del bloque</span><input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={140} /></label>
        <div className="component-fields">
          {contentFields[type].map((field) => (
            <label className="form-field" key={field.key}>
              <span>{field.label}{field.required && <b className="required-mark"> *</b>}</span>
              {field.multiline ? (
                <textarea
                  value={values[field.key] ?? ''}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                  rows={field.format === 'json' ? 7 : 4}
                  required={field.required}
                  spellCheck={field.format !== 'json'}
                />
              ) : (
                <input
                  value={values[field.key] ?? ''}
                  onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
                  required={field.required}
                  type={field.format === 'url' ? 'url' : 'text'}
                />
              )}
              {field.hint && <small>{field.hint}</small>}
            </label>
          ))}
        </div>
        {formError && <p className="form-error" role="alert">{formError}</p>}
        <p className="muted-copy">El contenido se guarda como borrador. La app móvil solo recibe componentes publicados y compatibles.</p>
        <div className="dialog-actions"><button type="button" className="button button-secondary" onClick={onClose}>Cancelar</button><button className="button button-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar componente'}</button></div>
      </form>
    </Dialog>
  );
}

function PreviewDialog({
  module,
  submodule,
  components,
  onClose,
}: {
  module: Module | null;
  submodule: Submodule;
  components: ContentComponent[];
  onClose: () => void;
}) {
  return (
    <Dialog title="Vista previa del contenido" onClose={onClose} wide>
      <div className="preview-phone">
        <div className="preview-topline"><span className="preview-brand">TE</span><span>Tributo Educa Perú</span></div>
        <div className="preview-notice">ⓘ Contenido educativo. No reemplaza asesoría profesional.</div>
        <p className="eyebrow">{module?.title}</p>
        <h2>{submodule.title}</h2>
        {submodule.description && <p className="muted-copy">{submodule.description}</p>}
        {components.filter((item) => item.isVisible).sort((a, b) => a.order - b.order).map((item) => (
          <article className="preview-component" key={item.id}>
            <span className="component-type">{componentLabels[item.type]}</span>
            {item.title && <h3>{item.title}</h3>}
            <PreviewContent component={item} />
          </article>
        ))}
        {components.filter((item) => item.isVisible).length === 0 && <p className="muted-copy">Agrega componentes visibles para ver la previsualización.</p>}
      </div>
      <div className="dialog-actions"><button className="button button-secondary" onClick={onClose}>Volver al editor</button></div>
    </Dialog>
  );
}

function PreviewContent({ component }: { component: ContentComponent }) {
  const values = Object.values(component.data);
  return <div className="preview-copy">{values.map((value, index) => {
    if (typeof value === 'string') return <p key={index}>{value}</p>;
    if (Array.isArray(value)) {
      return <ul key={index}>{value.map((entry, itemIndex) => <li key={itemIndex}>{typeof entry === 'string' ? entry : JSON.stringify(entry)}</li>)}</ul>;
    }
    if (value && typeof value === 'object') return <pre key={index}>{JSON.stringify(value, null, 2)}</pre>;
    return null;
  })}</div>;
}

function Dialog({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={`dialog ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <div className="dialog-heading"><h2 id="dialog-title">{title}</h2><button type="button" className="dialog-close" aria-label="Cerrar" onClick={onClose}>×</button></div>
        {children}
      </section>
    </div>
  );
}

function componentFieldValues(component: ContentComponent) {
  return fieldValuesFromComponent(component);
}

function moduleIcon(title: string) {
  if (title.toLowerCase().includes('tribut')) return '₰';
  if (title.toLowerCase().includes('labor')) return '♙';
  if (title.toLowerCase().includes('societ')) return '▦';
  if (title.toLowerCase().includes('contab')) return '▧';
  if (title.toLowerCase().includes('inmobil')) return '⌂';
  return '©';
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(date);
}
