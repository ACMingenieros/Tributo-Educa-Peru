import type {
  ComponentType,
  ContentComponent,
  ContentStatus,
  Module,
  Submodule,
  UserRole,
} from '@tributo-educa/contracts';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';

import { initialCurriculum, slugify } from './curriculum';
import { wordLessons } from './word-content';

type ModuleInput = Pick<Module, 'title' | 'slug' | 'description' | 'order' | 'isVisible'>;
type SubmoduleInput = Pick<Submodule, 'title' | 'slug' | 'description' | 'order' | 'isVisible'>;

function fromSnapshot<T extends { id: string }>(snapshot: {
  id: string;
  data: () => Record<string, unknown>;
}): T {
  return { ...snapshot.data(), id: snapshot.id } as T;
}

function draftFilter(role: UserRole) {
  return role === 'editor' ? [where('status', '==', 'draft')] : [];
}

export async function listModules(db: Firestore, role: UserRole): Promise<Module[]> {
  const modulesQuery = query(
    collection(db, 'modules'),
    ...draftFilter(role),
    orderBy('order', 'asc'),
  );
  const snapshot = await getDocs(modulesQuery);
  return snapshot.docs.map((item) => fromSnapshot<Module>(item));
}

export async function listSubmodules(
  db: Firestore,
  moduleId: string,
  role: UserRole,
): Promise<Submodule[]> {
  const submodulesQuery = query(
    collection(db, 'modules', moduleId, 'submodules'),
    ...draftFilter(role),
    orderBy('order', 'asc'),
  );
  const snapshot = await getDocs(submodulesQuery);
  return snapshot.docs.map((item) => fromSnapshot<Submodule>(item));
}

export async function listComponents(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  role: UserRole,
): Promise<ContentComponent[]> {
  const componentsQuery = query(
    collection(db, 'modules', moduleId, 'submodules', submoduleId, 'components'),
    ...draftFilter(role),
    orderBy('order', 'asc'),
  );
  const snapshot = await getDocs(componentsQuery);
  return snapshot.docs.map((item) => fromSnapshot<ContentComponent>(item));
}

export async function createModule(
  db: Firestore,
  input: ModuleInput,
  actorId: string,
): Promise<Module> {
  const now = new Date().toISOString();
  const reference = await addDoc(collection(db, 'modules'), {
    ...input,
    status: 'draft' satisfies ContentStatus,
    createdBy: actorId,
    updatedBy: actorId,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    serverUpdatedAt: serverTimestamp(),
  });
  return {
    ...input,
    id: reference.id,
    status: 'draft',
    createdBy: actorId,
    updatedBy: actorId,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };
}

export async function updateModule(
  db: Firestore,
  moduleId: string,
  input: ModuleInput,
  actorId: string,
) {
  await updateDoc(doc(db, 'modules', moduleId), {
    ...input,
    status: 'draft',
    publishedAt: null,
    updatedBy: actorId,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  });
}

export async function createSubmodule(
  db: Firestore,
  moduleId: string,
  input: SubmoduleInput,
  actorId: string,
): Promise<Submodule> {
  const now = new Date().toISOString();
  const reference = await addDoc(collection(db, 'modules', moduleId, 'submodules'), {
    ...input,
    moduleId,
    status: 'draft' satisfies ContentStatus,
    createdBy: actorId,
    updatedBy: actorId,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    serverUpdatedAt: serverTimestamp(),
  });
  return {
    ...input,
    id: reference.id,
    moduleId,
    status: 'draft',
    createdBy: actorId,
    updatedBy: actorId,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };
}

export async function updateSubmodule(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  input: SubmoduleInput,
  actorId: string,
) {
  await updateDoc(doc(db, 'modules', moduleId, 'submodules', submoduleId), {
    ...input,
    status: 'draft',
    publishedAt: null,
    updatedBy: actorId,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  });
}

export async function createComponent(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  input: {
    type: ComponentType;
    title: string;
    order: number;
    data: Record<string, unknown>;
  },
  actorId: string,
): Promise<ContentComponent> {
  const now = new Date().toISOString();
  const reference = await addDoc(
    collection(db, 'modules', moduleId, 'submodules', submoduleId, 'components'),
    {
      ...input,
      moduleId,
      submoduleId,
      status: 'draft' satisfies ContentStatus,
      isVisible: true,
      createdBy: actorId,
      updatedBy: actorId,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
      serverUpdatedAt: serverTimestamp(),
    },
  );
  return {
    ...input,
    id: reference.id,
    moduleId,
    submoduleId,
    status: 'draft',
    isVisible: true,
    createdBy: actorId,
    updatedBy: actorId,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
  };
}

export async function updateComponent(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  component: ContentComponent,
  actorId: string,
) {
  const now = new Date().toISOString();
  const batch = writeBatch(db);
  batch.update(
    doc(db, 'modules', moduleId, 'submodules', submoduleId, 'components', component.id),
    {
      type: component.type,
      title: component.title ?? '',
      order: component.order,
      data: component.data,
      isVisible: component.isVisible,
      status: 'draft',
      publishedAt: null,
      updatedBy: actorId,
      updatedAt: now,
      serverUpdatedAt: serverTimestamp(),
    },
  );
  batch.update(doc(db, 'modules', moduleId, 'submodules', submoduleId), {
    status: 'draft',
    publishedAt: null,
    updatedBy: actorId,
    updatedAt: now,
    serverUpdatedAt: serverTimestamp(),
  });
  await batch.commit();
}

export async function deleteComponent(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  componentId: string,
) {
  await deleteDoc(
    doc(db, 'modules', moduleId, 'submodules', submoduleId, 'components', componentId),
  );
}

export async function reorderComponents(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  components: ContentComponent[],
  actorId: string,
) {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  for (const [order, component] of components.entries()) {
    batch.update(
      doc(db, 'modules', moduleId, 'submodules', submoduleId, 'components', component.id),
      { order, updatedBy: actorId, updatedAt: now, serverUpdatedAt: serverTimestamp() },
    );
  }
  await batch.commit();
}

export async function publishModule(db: Firestore, moduleId: string, actorId: string) {
  await updateDoc(doc(db, 'modules', moduleId), {
    status: 'published',
    publishedAt: new Date().toISOString(),
    updatedBy: actorId,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  });
}

export async function archiveModule(db: Firestore, moduleId: string, actorId: string) {
  await updateDoc(doc(db, 'modules', moduleId), {
    status: 'archived',
    updatedBy: actorId,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  });
}

export async function archiveSubmodule(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  actorId: string,
) {
  await updateDoc(doc(db, 'modules', moduleId, 'submodules', submoduleId), {
    status: 'archived',
    updatedBy: actorId,
    updatedAt: new Date().toISOString(),
    serverUpdatedAt: serverTimestamp(),
  });
}

export async function publishSubmodule(
  db: Firestore,
  moduleId: string,
  submoduleId: string,
  actorId: string,
) {
  const moduleSnapshot = await getDoc(doc(db, 'modules', moduleId));
  if (!moduleSnapshot.exists() || moduleSnapshot.data().status !== 'published') {
    throw new Error('Primero publica el módulo para poder publicar este submódulo.');
  }

  const componentSnapshot = await getDocs(
    collection(db, 'modules', moduleId, 'submodules', submoduleId, 'components'),
  );
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  batch.update(doc(db, 'modules', moduleId, 'submodules', submoduleId), {
    status: 'published',
    publishedAt: now,
    updatedBy: actorId,
    updatedAt: now,
    serverUpdatedAt: serverTimestamp(),
  });
  for (const component of componentSnapshot.docs) {
    const data = component.data();
    if (data.isVisible === false) continue;
    batch.update(component.ref, {
      status: 'published',
      publishedAt: now,
      updatedBy: actorId,
      updatedAt: now,
      serverUpdatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}

export async function saveInitialCurriculum(db: Firestore, actorId: string) {
  const existingModules = await getDocs(collection(db, 'modules'));
  if (!existingModules.empty) {
    throw new Error('La estructura inicial solo se puede cargar en un espacio sin módulos.');
  }

  const batch = writeBatch(db);
  const now = new Date().toISOString();
  let moduleOrder = 0;
  for (const module of initialCurriculum) {
    const moduleReference = doc(collection(db, 'modules'));
    const moduleId = moduleReference.id;
    batch.set(moduleReference, {
      title: `Módulo ${moduleOrder + 1}: ${module.title}`,
      slug: slugify(module.title),
      description: module.description,
      order: moduleOrder,
      status: 'draft',
      isVisible: true,
      createdBy: actorId,
      updatedBy: actorId,
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    });

    module.submodules.forEach((title, submoduleOrder) => {
      const submoduleReference = doc(
        collection(db, 'modules', moduleId, 'submodules'),
      );
      batch.set(submoduleReference, {
        moduleId,
        title,
        slug: slugify(title),
        description: '',
        order: submoduleOrder,
        status: 'draft',
        isVisible: true,
        createdBy: actorId,
        updatedBy: actorId,
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
      });
    });
    moduleOrder += 1;
  }
  await batch.commit();
}

export async function saveWordContentDrafts(db: Firestore, actorId: string) {
  const moduleSnapshots = await getDocs(collection(db, 'modules'));
  const modulesBySlug = new Map(moduleSnapshots.docs.map((item) => [item.data().slug, item]));
  const submodulesByModule = new Map(await Promise.all(
    [...modulesBySlug.values()].map(async (module) => [
      module.id,
      await getDocs(collection(db, 'modules', module.id, 'submodules')),
    ] as const),
  ));

  // Resolve the whole temario before any write so missing lessons cannot cause a partial import.
  const locations = wordLessons.map((lesson) => {
    const module = modulesBySlug.get(lesson.moduleSlug);
    if (!module) throw new Error(`Falta el módulo «${lesson.moduleSlug}». Carga primero la estructura del Word.`);
    const submodules = submodulesByModule.get(module.id);
    if (!submodules) throw new Error(`No se pudieron cargar los temas de «${module.data().title}».`);
    const submodule = submodules.docs.find((item) => item.data().slug === lesson.submoduleSlug);
    if (!submodule) throw new Error(`Falta el submódulo «${lesson.submoduleSlug}» en «${module.data().title}».`);
    return { moduleId: module.id, submoduleId: submodule.id, blocks: lesson.blocks };
  });
  const existing = await Promise.all(locations.map((lesson) =>
    getDocs(collection(db, 'modules', lesson.moduleId, 'submodules', lesson.submoduleId, 'components')),
  ));
  const prepared = locations.filter((_, index) => existing[index].empty);
  const skipped = locations.length - prepared.length;

  if (prepared.length === 0) return { created: 0, skipped };
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  let created = 0;
  for (const lesson of prepared) {
    lesson.blocks.forEach((block, order) => {
      const reference = doc(collection(db, 'modules', lesson.moduleId, 'submodules', lesson.submoduleId, 'components'));
      batch.set(reference, {
        ...block,
        moduleId: lesson.moduleId,
        submoduleId: lesson.submoduleId,
        order,
        status: 'draft',
        isVisible: true,
        createdBy: actorId,
        updatedBy: actorId,
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
        serverUpdatedAt: serverTimestamp(),
      });
      created += 1;
    });
  }
  await batch.commit();
  return { created, skipped };
}

export async function reorderSubmodules(
  db: Firestore,
  moduleId: string,
  submodules: Submodule[],
  actorId: string,
) {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  for (const [order, submodule] of submodules.entries()) {
    batch.update(doc(db, 'modules', moduleId, 'submodules', submodule.id), {
      order,
      updatedBy: actorId,
      updatedAt: now,
      serverUpdatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}
