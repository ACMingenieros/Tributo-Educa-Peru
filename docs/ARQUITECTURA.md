# Arquitectura — Tributo Educa Perú

## 1. Propósito

Este documento define la arquitectura inicial de Tributo Educa Perú, una plataforma educativa sobre temas tributarios compuesta por:

- Aplicación móvil para Android e iOS.
- Panel administrativo web.
- Backend y servicios administrados en Firebase.

La arquitectura debe permitir publicar contenido educativo modular, mantener una experiencia consistente y agregar nuevos tipos de contenido sin rehacer la aplicación.

## 2. Alcance inicial

El alcance inicial contempla:

- Visualización de módulos y submódulos en la aplicación móvil.
- Gestión administrativa de módulos, submódulos y componentes.
- Contenido en borrador y contenido publicado.
- Previsualización del contenido desde el panel.
- Componentes educativos como texto, imágenes, tablas, documentos y exámenes.
- Autenticación de administradores.
- Almacenamiento de archivos.
- Base técnica para notificaciones push.

Izipay queda fuera del primer alcance y se implementará en una fase posterior.

## 3. Stack tecnológico

### Aplicación móvil

- Flutter y Dart.
- Android e iOS desde una base de código común.
- Firebase SDK para autenticación, datos, archivos y notificaciones.

### Panel administrativo

- Next.js.
- TypeScript.
- Interfaz responsive con prioridad para escritorio y tablet.
- Componentes reutilizables y formularios validados.

### Backend y servicios

- Firebase Authentication para autenticación.
- Cloud Firestore como base de datos NoSQL.
- Firebase Storage para imágenes, videos y documentos.
- Firebase Cloud Messaging para notificaciones.
- Cloud Functions, si se requieren procesos del lado del servidor.

## 4. Arquitectura lógica

```text
Administrador
    │
    ▼
Panel Next.js ───────► Firebase Authentication
    │                  Firestore
    │                  Storage
    │                  Cloud Functions
    │
    ▼
Contenido publicado
    │
    ▼
Aplicación Flutter ──► Firestore / Storage / FCM
```

El panel administra el contenido. La aplicación móvil consume únicamente contenido publicado, salvo que se autorice explícitamente otro comportamiento.

## 5. Modelo de contenido

```text
Módulo
└── Submódulo
    └── Componentes ordenables
```

Ejemplo:

```text
Regímenes tributarios
└── Régimen MYPE Tributario
    ├── Concepto
    ├── Características
    ├── Tabla comparativa
    ├── Caso práctico
    └── Examen
```

Cada componente tendrá como mínimo:

- Identificador.
- Tipo.
- Título opcional.
- Orden.
- Estado de visibilidad.
- Datos específicos del componente.
- Fecha de creación y actualización.

## 6. Componentes de contenido

### Componentes generales

- Texto enriquecido.
- Imagen.
- Video.
- Audio.
- Documento descargable.
- Tarjetas informativas.
- Tabla.
- Enlace externo.
- Preguntas frecuentes.

### Componentes especializados

- Tabla comparativa tributaria.
- Caso práctico.
- Examen o cuestionario.
- Glosario.
- Línea de tiempo.
- Calculadora tributaria, como posible evolución.

Los componentes deben identificarse mediante un campo `type`, de modo que Flutter y el panel puedan renderizarlos según su tipo.

## 7. Estructura inicial de Firestore

```text
users/{userId}
modules/{moduleId}
modules/{moduleId}/submodules/{submoduleId}
modules/{moduleId}/submodules/{submoduleId}/components/{componentId}
notifications/{notificationId}
```

Campos sugeridos para un módulo:

```json
{
  "title": "Regímenes tributarios",
  "description": "Información sobre los principales regímenes",
  "imageUrl": "",
  "order": 1,
  "status": "draft",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Campos sugeridos para un componente:

```json
{
  "type": "comparison_table",
  "title": "Comparación de regímenes",
  "order": 2,
  "isVisible": true,
  "data": {
    "columns": ["Régimen", "Límite", "Beneficios"],
    "rows": []
  }
}
```

## 8. Estados de publicación

Se recomienda utilizar como mínimo:

- `draft`: borrador visible solo para administradores.
- `published`: contenido visible en la aplicación móvil.
- `archived`: contenido retirado de la navegación, pero conservado.

La publicación debe ser una acción explícita del administrador.

## 9. Roles y seguridad

Roles iniciales recomendados:

- Administrador: administra usuarios y contenido.
- Editor: crea y modifica contenido, sin administrar permisos.
- Usuario móvil: consume contenido publicado.

Las reglas de Firebase deben validar permisos del lado del servidor. Las restricciones visuales del panel no deben considerarse una medida de seguridad suficiente.

## 10. Previsualización

El panel debe permitir previsualizar un submódulo antes de publicarlo. La previsualización debe:

- Mostrar los componentes en el orden configurado.
- Permitir revisar borradores.
- Aproximarse al diseño de Flutter.
- Mostrar estados vacíos, errores y contenido incompleto.

La mejor estrategia es compartir contratos de datos y tokens visuales entre panel y aplicación, aunque cada plataforma tenga su propia implementación visual.

## 11. Diseño visual

La identidad visual utilizará principalmente:

- Azul como color institucional y de confianza.
- Verde como color de progreso, confirmación y educación.
- Blanco como base de limpieza y legibilidad.

Se recomienda definir antes de la implementación final:

- Paleta exacta.
- Tipografías.
- Escala de espaciado.
- Bordes y sombras.
- Estados de botones y formularios.
- Componentes reutilizables para Flutter y Next.js.

## 12. Evolución futura

La arquitectura debe dejar espacio para:

- Integración con Izipay.
- Cursos o rutas de aprendizaje.
- Progreso del usuario.
- Certificados.
- Estadísticas avanzadas.
- Recomendaciones de contenido.
- Panel de analítica.

Estas funciones no forman parte del alcance inicial salvo aprobación expresa.

## 13. Decisiones pendientes

- Definir el contenido exacto del Word.
- El administrador inicial se identifica por un UID fijo de Firebase compartido entre el panel y las reglas de Firestore; los editores usan el claim `role: "editor"`.
- Confirmar si los exámenes guardarán intentos y calificaciones.
- Confirmar tamaño y tipos de archivos permitidos.
- Definir si habrá contenido gratuito y restringido en el futuro.
- Definir la paleta visual definitiva.

## 14. Arquitectura técnica del MVP

La primera versión debe separar claramente tres responsabilidades:

```text
Flutter
  Consulta y renderizado de contenido publicado

Next.js
  Administración, edición, validación y previsualización

Firebase
  Autenticación, persistencia, archivos y reglas de seguridad
```

La aplicación móvil no debe implementar lógica de edición. El panel no debe duplicar reglas de renderizado de contenido de manera incompatible con Flutter. Ambas plataformas deben depender de contratos de datos compartidos y versionados.

## 15. Modelo de datos recomendado

### 15.1 Módulo

```json
{
  "id": "module-id",
  "title": "Módulo Tributario",
  "slug": "modulo-tributario",
  "description": "Información tributaria para emprendedores",
  "imageUrl": "",
  "order": 1,
  "status": "draft",
  "isVisible": true,
  "createdBy": "user-id",
  "updatedBy": "user-id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "publishedAt": null
}
```

### 15.2 Submódulo

```json
{
  "id": "submodule-id",
  "moduleId": "module-id",
  "title": "Regímenes Tributarios",
  "slug": "regimenes-tributarios",
  "description": "Comparación de los principales regímenes",
  "order": 1,
  "status": "draft",
  "isVisible": true,
  "createdBy": "user-id",
  "updatedBy": "user-id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "publishedAt": null
}
```

### 15.3 Componente

```json
{
  "id": "component-id",
  "moduleId": "module-id",
  "submoduleId": "submodule-id",
  "type": "comparison_table",
  "title": "Comparación de regímenes",
  "order": 1,
  "isVisible": true,
  "status": "draft",
  "data": {},
  "createdBy": "user-id",
  "updatedBy": "user-id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

El campo `data` debe validarse según `type`. No se debe permitir guardar un componente sin un tipo conocido o con una estructura incompatible.

## 16. Contratos compartidos

Los modelos compartidos deben definir:

- Identificadores y relaciones.
- Tipos permitidos.
- Estados de publicación.
- Campos obligatorios y opcionales.
- Reglas de ordenamiento.
- Estructura de `data` por componente.
- Comportamiento ante campos desconocidos.
- Versión del contrato cuando ocurra una evolución incompatible.

Se recomienda mantener un catálogo central de tipos:

```text
rich_text
image
document
info_card
comparison_table
faq
video
practical_case
exam
checklist
glossary
```

Flutter debe renderizar tipos conocidos y mostrar un componente fallback para tipos no soportados. El panel debe mostrar advertencias antes de guardar o publicar tipos incompletos.

## 17. Estructura de carpetas recomendada

### 17.1 Flutter

```text
mobile/
├── lib/
│   ├── app/
│   ├── core/
│   │   ├── theme/
│   │   ├── routing/
│   │   ├── errors/
│   │   └── widgets/
│   ├── features/
│   │   ├── home/
│   │   ├── modules/
│   │   ├── lessons/
│   │   ├── tools/
│   │   ├── saved/
│   │   └── profile/
│   └── shared/
│       ├── models/
│       └── services/
└── test/
```

### 17.2 Next.js

```text
admin/
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── modules/
│   ├── preview/
│   └── settings/
├── components/
│   ├── ui/
│   ├── content/
│   ├── forms/
│   └── preview/
├── features/
│   ├── modules/
│   ├── submodules/
│   ├── components/
│   ├── media/
│   └── users/
├── lib/
│   ├── firebase/
│   ├── validation/
│   └── permissions/
└── types/
```

La organización final puede adaptarse al repositorio cuando se inicialicen los proyectos, pero debe conservar separación por funcionalidad y modelos tipados.

## 18. Firebase y seguridad

### 18.1 Firestore

Las consultas móviles deben filtrar por `status == published` e `isVisible == true`. Las consultas administrativas deben limitarse mediante autenticación y rol.

Las reglas no deben confiar únicamente en campos enviados por el cliente. El rol debe validarse mediante claims o una fuente segura asociada al usuario autenticado.

### 18.2 Storage

Los archivos deben organizarse por contexto, por ejemplo:

```text
media/modules/{moduleId}/...
media/submodules/{submoduleId}/...
media/components/{componentId}/...
```

Storage debe validar autenticación, permisos, tipo de archivo y tamaño permitido. No se deben conceder permisos públicos globales por comodidad.

### 18.3 Publicación

La publicación debe ser una operación explícita y autorizada. Cuando sea necesario, debe actualizar de forma consistente el estado y la fecha de publicación del recurso padre y sus descendientes.

## 19. Servicios y responsabilidades

| Servicio | Responsabilidad |
|---|---|
| Authentication | Inicio de sesión y sesión administrativa |
| Firestore | Contenido, usuarios, roles y estados |
| Storage | Imágenes, videos y documentos |
| FCM | Base para notificaciones futuras |
| Cloud Functions | Procesos backend que no deben confiar en el cliente |

Cloud Functions no debe introducirse por defecto. Solo debe utilizarse cuando una operación requiera privilegios del servidor, consistencia entre documentos, tareas programadas o integración externa.

## 20. Previsualización y renderizado

La previsualización del panel debe consumir los mismos contratos de contenido que la aplicación móvil. Se recomienda crear una capa de renderizadores por tipo:

```text
ContentRenderer
├── RichTextRenderer
├── ImageRenderer
├── DocumentRenderer
├── ComparisonTableRenderer
├── FaqRenderer
└── UnsupportedRenderer
```

El panel puede incluir indicadores adicionales de borrador, validación o contenido incompleto, pero la estructura final debe aproximarse al resultado móvil.

## 21. Errores, conectividad y observabilidad

Las plataformas deben distinguir entre:

- Sin conexión.
- Permiso insuficiente.
- Recurso inexistente.
- Recurso archivado.
- Datos inválidos.
- Error temporal del servicio.
- Tipo de componente no soportado.

Las operaciones de escritura deben mostrar estado en progreso, éxito o error. Los errores técnicos deben registrarse sin exponer secretos ni detalles innecesarios al usuario.

## 22. Estrategia de evolución

Los cambios de contrato deben ser compatibles cuando sea posible. Si un tipo de componente cambia de forma incompatible:

1. Se debe versionar o migrar el contrato.
2. El panel debe indicar los componentes afectados.
3. Flutter debe conservar un fallback seguro.
4. No se debe publicar contenido que la aplicación móvil no pueda interpretar.

La incorporación de un nuevo componente requiere actualizar el catálogo de tipos, los modelos, el panel, la previsualización, Flutter, validaciones y pruebas.
