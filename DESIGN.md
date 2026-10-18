# Diseño de Tributo Educa Perú

## 1. Propósito

Este documento define las reglas visuales, funcionales y de experiencia de usuario para Tributo Educa Perú.

Su objetivo es mantener una experiencia coherente entre:

- La aplicación móvil desarrollada con Flutter.
- El panel administrativo desarrollado con Next.js y TypeScript.
- La estructura de contenido administrada en Firebase.

El documento funciona como referencia para diseño, desarrollo, revisión visual y evolución del producto. No reemplaza los requerimientos funcionales ni las decisiones de arquitectura.

## 2. Fuentes y alcance de este diseño

La dirección visual se basa en:

- La documentación funcional y arquitectónica del proyecto.
- Las referencias visuales entregadas para la aplicación móvil.
- La necesidad de representar contenido tributario, laboral, societario, contable e inmobiliario de manera clara y didáctica.

Las imágenes de referencia orientan la apariencia y la experiencia, pero no obligan a copiar literalmente cada pantalla. Antes de implementar una nueva función se debe confirmar si pertenece al MVP o a una fase posterior.

## 3. Principios de diseño

### 3.1 Claridad antes que densidad

El contenido legal, tributario y contable debe dividirse en bloques cortos, títulos descriptivos, tarjetas y comparaciones. Las pantallas no deben presentar grandes muros de texto sin jerarquía.

### 3.2 Orientación práctica

Cada contenido debe ayudar al usuario a entender qué significa una regla y qué acción puede tomar. Cuando corresponda, se deben utilizar ejemplos, pasos, checklists, comparadores y casos prácticos.

### 3.3 Confianza y responsabilidad

La interfaz debe comunicar orden, estabilidad y rigor. Los avisos pedagógicos o legales deben diferenciar claramente el contenido educativo de una asesoría profesional.

### 3.4 Progreso visible

Cuando el flujo lo permita, mostrar avance, pasos completados, contenido guardado y resultados. El progreso debe apoyar la comprensión y no convertirse en una mecánica de gamificación obligatoria.

### 3.5 Consistencia entre plataformas

Flutter y Next.js pueden tener controles propios de cada plataforma, pero deben compartir:

- Tokens de color, tipografía y espaciado.
- Nombres y tipos de componentes.
- Jerarquía de contenido.
- Estados de carga, vacío, error y publicación.
- Reglas de validación y mensajes principales.

## 4. Dirección visual

### 4.1 Personalidad

La interfaz debe sentirse:

- Profesional, pero accesible.
- Educativa, pero no infantil.
- Moderna, pero estable.
- Institucional, pero cercana.
- Clara para usuarios sin conocimientos técnicos o tributarios avanzados.

### 4.2 Paleta semántica inicial

Los valores siguientes son una base de diseño y deben convertirse en tokens reutilizables. La paleta definitiva puede ajustarse después de una validación visual con el logo y la identidad institucional.

| Token | Uso | Valor inicial |
|---|---|---|
| `color.brand.navy` | Fondos principales, encabezados y contraste | `#0E172A` |
| `color.brand.blue` | Elementos informativos y navegación | `#173B5C` |
| `color.brand.green` | Acción principal, éxito y progreso | `#008A5B` |
| `color.brand.greenLight` | Fondos de progreso y estados positivos | `#B7F2D2` |
| `color.surface.primary` | Fondo principal | `#FFFFFF` |
| `color.surface.softBlue` | Fondos de pantallas y secciones | `#F1F5FF` |
| `color.surface.card` | Tarjetas | `#FFFFFF` |
| `color.text.primary` | Títulos y contenido principal | `#10243E` |
| `color.text.secondary` | Descripciones y metadatos | `#596579` |
| `color.text.muted` | Estados secundarios | `#7C8798` |
| `color.border.default` | Bordes y separadores | `#DCE4F0` |
| `color.status.warning` | Advertencias | `#D99000` |
| `color.status.error` | Errores y contenido descartado | `#C9334D` |
| `color.status.info` | Información pedagógica | `#DCE9FF` |

No se debe usar el color como único mecanismo para comunicar un estado. Los estados deben incluir texto, icono o ambos.

### 4.3 Tipografía

La tipografía debe priorizar legibilidad en pantallas pequeñas. Se recomienda una familia sans serif con buena lectura en español y soporte para pesos semibold y bold.

Escala inicial:

| Nivel | Tamaño móvil | Uso |
|---|---:|---|
| `display` | 28–32 px | Resultados y encabezados destacados |
| `heading1` | 24 px | Título principal de pantalla |
| `heading2` | 20 px | Título de sección |
| `heading3` | 16–18 px | Título de tarjeta o componente |
| `body` | 15–16 px | Texto principal |
| `bodySmall` | 13–14 px | Metadatos y texto auxiliar |
| `caption` | 11–12 px | Etiquetas breves y estados |

El texto principal debe usar un interlineado cómodo. Los títulos pueden usar pesos semibold o bold, evitando abusar de mayúsculas.

### 4.4 Forma, elevación y espaciado

- Radio pequeño: 8 px para controles y campos.
- Radio medio: 12–16 px para tarjetas.
- Radio grande: 24–32 px para hero cards y contenedores destacados.
- Espaciado base: múltiplos de 4 px.
- Separación habitual entre secciones: 24–32 px.
- Sombra: suave, corta y solo cuando ayude a distinguir una tarjeta del fondo.
- Bordes: preferibles a sombras fuertes para elementos secundarios.

## 5. Arquitectura de información móvil

La navegación principal será inferior y tendrá como base:

1. Inicio.
2. Módulos.
3. Herramientas.
4. Guardados.
5. Perfil.

El menú lateral podrá complementar la navegación para mostrar la ruta completa de módulos y submódulos.

### 5.0 Flujo principal de aprendizaje

El flujo base debe ser comprensible sin explicación externa:

```text
Inicio
  → Módulos
  → Módulo
  → Submódulo
  → Componentes de la lección
  → Actividad o evaluación
  → Resultado
  → Guardar o continuar
```

Cada pantalla debe mantener visible el contexto actual, permitir regresar sin perder el avance y ofrecer una acción principal claramente identificable.

### 5.1 Inicio

Debe permitir al usuario entender rápidamente qué puede hacer. Puede incluir:

- Saludo o encabezado contextual.
- Buscador de necesidades o temas.
- Acceso a una guía destacada.
- Continuar aprendiendo.
- Contenido guardado.
- Accesos a herramientas disponibles.

La personalización avanzada depende de que se defina autenticación y almacenamiento de progreso.

### 5.2 Módulos

Debe mostrar módulos publicados, su descripción breve, estado y avance cuando exista.

Cada módulo puede mostrar:

- Número y título.
- Descripción corta.
- Categoría o institución relacionada.
- Estado activo o próximamente.
- Cantidad de submódulos o pasos.

### 5.3 Detalle de módulo y menú lateral

El menú lateral debe presentar la jerarquía completa sin ocultar el contexto actual. Los submódulos deben conservar su orden editorial y mostrar el estado de avance cuando aplique.

Los módulos no publicados no deben aparecer en la aplicación móvil. El estado “Próximamente” solo debe usarse cuando el contenido visible haya sido diseñado y publicado explícitamente con ese estado.

### 5.4 Lección o submódulo

Una lección se compone de componentes ordenados. La pantalla debe:

- Mostrar el título y contexto del submódulo.
- Renderizar cada componente en orden.
- Mantener una lectura vertical continua.
- Mostrar carga y error por recurso.
- Evitar que un componente desconocido rompa toda la pantalla.
- Permitir guardar el contenido cuando la función esté habilitada.

### 5.5 Resultados y diagnósticos

Los resultados de simuladores o exámenes pueden mostrar:

- Estado de finalización.
- Resultado o nivel de afinidad.
- Recomendación principal.
- Criterios que explican la recomendación.
- Alternativas descartadas y motivo.
- Aviso de carácter educativo.
- Acción para guardar el resultado.
- Acción para consultar la guía relacionada.
- Acción para reiniciar.

Los porcentajes o recomendaciones deben indicar claramente que son resultados informativos y no resoluciones oficiales.

## 6. Componentes de contenido

Todos los componentes deben identificarse con un campo `type`, tener orden y poder representar estados de validación y visibilidad.

### 6.1 Componentes iniciales

| Tipo | Propósito | Reglas visuales |
|---|---|---|
| `rich_text` | Explicar conceptos | Lectura continua, títulos y listas semánticas |
| `image` | Apoyar una explicación | Relación de aspecto, texto alternativo y carga progresiva |
| `video` | Mostrar una explicación audiovisual | Portada, duración, controles y error recuperable |
| `document` | Descargar o consultar un archivo | Tipo, tamaño, acción clara y estado de descarga |
| `info_card` | Resumir una idea | Título, icono opcional y contenido breve |
| `comparison_table` | Comparar regímenes, formas o beneficios | Encabezados persistentes y adaptación a móvil |
| `faq` | Resolver preguntas frecuentes | Acordeón con una pregunta por fila |
| `practical_case` | Explicar una situación | Contexto, datos, análisis y conclusión |
| `exam` | Evaluar comprensión | Preguntas, alternativas, validación y retroalimentación |

### 6.2 Componentes interactivos

Los siguientes componentes aparecen en las referencias visuales y deben tratarse como funcionalidad específica:

- `simulator`: flujo de preguntas y resultado calculado.
- `checklist`: lista de verificación con avance.
- `recommendation_result`: recomendación explicada por criterios.
- `glossary`: término, definición y búsqueda.
- `legal_notice`: aviso pedagógico o legal.

Antes de implementarlos se debe confirmar su alcance, reglas de cálculo, persistencia y fuente de información.

### 6.3 Reglas de los componentes

Cada componente debe:

- Tener un tipo válido.
- Validar sus datos específicos.
- Respetar el orden configurado.
- Poder ocultarse sin eliminarse cuando corresponda.
- Mostrar una representación de borrador en el panel.
- Tener un fallback para datos incompletos o tipos desconocidos.
- Mantener textos y etiquetas en español.

## 7. Estados de experiencia

### 7.1 Estados de contenido

- `draft`: visible para usuarios administrativos autorizados.
- `published`: visible para la aplicación móvil.
- `archived`: conservado, pero retirado de la navegación.
- `coming_soon`: visible como disponibilidad futura únicamente si se publica de forma explícita.

### 7.2 Estados de interfaz

Toda pantalla o componente que consulte datos debe contemplar:

- Carga inicial.
- Carga parcial de recursos.
- Estado vacío.
- Error recuperable.
- Error permanente o contenido no disponible.
- Éxito.
- Operación en progreso.
- Confirmación posterior a una acción.

Los mensajes deben explicar qué ocurrió y cuál es la siguiente acción posible.

## 8. Panel administrativo

### 8.1 Navegación

El panel debe priorizar escritorio y tablet, con una navegación lateral persistente que incluya:

- Inicio.
- Módulos.
- Biblioteca de archivos.
- Previsualización.
- Usuarios y roles, si está dentro del alcance aprobado.
- Configuración.

### 8.2 Gestión de contenido

El editor de módulos y submódulos debe permitir:

- Crear y editar información general.
- Cambiar estado entre borrador y publicación según permisos.
- Agregar componentes por tipo.
- Ordenar componentes.
- Ocultar o archivar componentes.
- Validar campos obligatorios.
- Previsualizar antes de publicar.
- Ver advertencias de contenido incompleto.

### 8.3 Editor de componentes

El editor debe mostrar un formulario específico para cada `type`. Debe evitar formularios genéricos que permitan guardar estructuras inválidas.

Cada formulario debe tener:

- Estado de carga.
- Validación de campos.
- Mensajes de error junto al campo.
- Prevención de pérdida accidental de cambios.
- Acción de guardar borrador.
- Acción de cancelar.
- Vista previa cuando corresponda.

### 8.4 Publicación

La publicación debe ser una acción explícita y autorizada. Antes de publicar se debe mostrar:

- Campos faltantes.
- Componentes inválidos.
- Archivos no disponibles.
- Advertencias editoriales.
- Resumen del contenido que se hará visible.

Publicar no debe ocurrir automáticamente al guardar.

### 8.6 Flujo editorial

El flujo editorial recomendado es:

```text
Crear borrador
  → Completar información general
  → Agregar componentes
  → Ordenar y validar
  → Previsualizar
  → Corregir observaciones
  → Solicitar o ejecutar publicación
  → Confirmar publicación
```

El panel debe advertir sobre cambios no guardados antes de abandonar un formulario. Las acciones de publicar, archivar o eliminar deben mostrar una confirmación explícita y explicar su consecuencia.

### 8.7 Gestión y búsqueda

Las pantallas administrativas deben permitir buscar y filtrar por:

- Título.
- Módulo.
- Estado.
- Autor o editor.
- Fecha de actualización.

Las listas deben mostrar el estado, la última actualización y la acción principal disponible. Los permisos deben reflejarse visualmente, pero la autorización real debe validarse en Firebase.

### 8.5 Previsualización

La previsualización debe compartir contratos de datos y tokens visuales con Flutter. No tiene que ser idéntica a nivel de código, pero debe reflejar:

- Jerarquía.
- Orden.
- Tipos de componentes.
- Estados visibles.
- Advertencias de contenido incompleto.
- Apariencia general de la aplicación móvil.

## 9. Responsive

### 9.0 Breakpoints y layout

Los siguientes breakpoints son la base inicial:

| Rango | Uso | Regla principal |
|---|---|---|
| 320–374 px | Móvil pequeño | Una columna y controles compactos sin reducir legibilidad |
| 375–767 px | Móvil estándar | Una columna y navegación inferior |
| 768–1199 px | Tablet | Navegación lateral opcional y contenido en una o dos columnas |
| 1200 px o más | Escritorio | Navegación persistente, área de trabajo centrada y vista previa paralela |

El contenido de lectura no debe crecer indefinidamente en escritorio. Se recomienda un ancho máximo aproximado de 720–840 px para lecturas y de 1200–1440 px para áreas administrativas.

### 9.1 Móvil

- Una columna principal.
- Navegación inferior.
- Controles táctiles de al menos 44 px cuando sea posible.
- Tablas transformadas en tarjetas o desplazamiento horizontal controlado.
- Acciones principales visibles sin depender de gestos ocultos.

### 9.2 Tablet

- Posibilidad de mostrar navegación lateral reducida.
- Mayor ancho para tablas y comparaciones.
- Dos columnas solo cuando no afecte la lectura.

### 9.3 Escritorio

- Navegación lateral persistente.
- Área de trabajo centrada.
- Previsualización junto al editor cuando el espacio lo permita.
- Tablas completas y herramientas de ordenamiento.

### 9.4 Tablas y comparadores

Las tablas deben elegir una estrategia según la cantidad y longitud de columnas:

- Hasta dos opciones: comparación lado a lado.
- Tres o más opciones: desplazamiento horizontal controlado con encabezado visible.
- Texto extenso: conversión a tarjetas por criterio.
- Datos prioritarios: mostrar primero los campos decisivos y permitir ampliar el detalle.

Nunca se debe reducir el texto hasta volverlo ilegible para encajar una tabla en móvil.

## 10. Accesibilidad

- Mantener contraste suficiente entre texto y fondo.
- No comunicar estados únicamente mediante color.
- Proporcionar texto alternativo para imágenes relevantes.
- Usar etiquetas claras en controles y formularios.
- Mantener foco visible en el panel.
- Permitir navegación por teclado en controles administrativos.
- Evitar textos demasiado pequeños.
- Usar lenguaje simple y explicar abreviaturas cuando sea necesario.
- Mostrar mensajes de error que indiquen cómo corregir el problema.

Como criterio inicial de calidad se debe cumplir WCAG 2.2 AA en los flujos principales:

- Contraste mínimo de 4.5:1 para texto normal.
- Contraste mínimo de 3:1 para texto grande y elementos gráficos relevantes.
- Áreas táctiles de al menos 44 × 44 px cuando sea posible.
- Foco visible y orden lógico de navegación por teclado.
- Etiquetas accesibles para iconos, imágenes, campos y botones.
- Anuncios accesibles para errores, confirmaciones y cambios de estado.

La revisión debe realizarse con lectores de pantalla y navegación por teclado en las pantallas administrativas principales.

### 10.1 Sistema de controles

Todo control interactivo debe definir al menos estos estados:

```text
default → hover → pressed → focus → disabled → loading → success/error
```

Controles mínimos:

- Botón primario.
- Botón secundario.
- Botón terciario o de texto.
- Botón destructivo.
- Campo de texto.
- Selector.
- Checkbox y radio.
- Acordeón.
- Modal de confirmación.
- Toast o mensaje temporal.
- Paginación o carga progresiva.

Los controles principales deben tener una etiqueta textual. Un icono aislado solo puede utilizarse cuando su significado sea inequívoco y tenga etiqueta accesible.

## 11. Datos y contratos visuales

La representación visual debe depender de contratos tipados y no de textos libres sin validación.

Ejemplo conceptual de un componente:

```json
{
  "id": "component-id",
  "type": "comparison_table",
  "title": "Comparación de regímenes",
  "order": 2,
  "isVisible": true,
  "data": {},
  "status": "draft",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Los contratos compartidos deben definir campos obligatorios, valores permitidos, reglas de validación y comportamiento cuando falte información.

### 11.1 Vigencia y fuente del contenido

El contenido tributario, laboral y legal debe poder mostrar, cuando corresponda:

- Fecha de última revisión.
- Fuente normativa o institucional.
- Fecha de vigencia.
- Responsable editorial.
- Advertencia de que puede requerir actualización.

La interfaz no debe presentar información normativa como vigente indefinidamente sin fecha o fuente identificable.

### 11.2 Conectividad y modo offline

La primera versión debe definir explícitamente si funciona solo en línea o si permite consulta local. Mientras esa decisión esté pendiente:

- Mostrar estado de conectividad cuando una operación dependa de red.
- Permitir reintentar sin perder el contexto.
- Diferenciar contenido no disponible de contenido vacío.
- Informar si una descarga está en progreso o fue interrumpida.
- No confirmar una operación de guardado o publicación hasta recibir respuesta del backend.

## 12. MVP y fases posteriores

### MVP recomendado

- Inicio básico.
- Listado de módulos.
- Submódulos publicados.
- Texto enriquecido.
- Imágenes.
- Documentos.
- Tarjetas informativas.
- Tablas comparativas.
- Preguntas frecuentes.
- Borradores y publicación.
- Previsualización.
- Autenticación administrativa.
- Roles de administrador y editor.

### Segunda fase

- Exámenes con retroalimentación.
- Casos prácticos interactivos.
- Simuladores tributarios.
- Checklists.
- Guardado de resultados.
- Glosario con búsqueda.
- Notificaciones configurables.

### Futuro

- Progreso avanzado del usuario.
- Certificados.
- Rankings o gamificación.
- Contenido premium.
- Izipay.
- Analítica avanzada.
- Calculadoras tributarias complejas.

## 13. Reglas para nuevas funcionalidades

Antes de diseñar o desarrollar una función nueva se debe responder:

1. ¿Qué actor la utilizará?
2. ¿Qué problema resuelve?
3. ¿Es contenido, herramienta, administración o infraestructura?
4. ¿Puede reutilizar un componente existente?
5. ¿Qué datos necesita?
6. ¿Qué estados de carga, error y vacío requiere?
7. ¿Debe persistir información del usuario?
8. ¿Qué permisos necesita?
9. ¿Pertenece al MVP o a una fase posterior?
10. ¿Cómo se previsualiza y valida en el panel?

Si la función introduce reglas de negocio nuevas, cambios de modelo de datos, permisos, Firebase o contratos entre aplicaciones, debe aprobarse antes de implementarse.

### 13.1 Validación UX

Antes de dar por terminada una pantalla se debe revisar:

- ¿El usuario entiende dónde está?
- ¿La acción principal es evidente?
- ¿Puede recuperarse de un error?
- ¿Se conserva el trabajo no guardado?
- ¿La pantalla funciona en móvil, tablet y escritorio cuando corresponda?
- ¿El contenido es legible y accesible?
- ¿Los estados de carga, vacío y error están diseñados?
- ¿La terminología coincide con el resto del producto?

Las pantallas principales deben probarse con usuarios o representantes del público objetivo antes de cerrar el diseño. Las pruebas deben observar comprensión, facilidad de navegación, errores frecuentes y tiempo para completar la tarea.

## 14. Decisiones pendientes

- Confirmar familia tipográfica y logo definitivos.
- Validar la paleta con la identidad institucional.
- Definir si habrá usuarios móviles autenticados o acceso anónimo.
- Confirmar persistencia de resultados, intentos y progreso.
- Definir reglas exactas de simuladores y recomendaciones.
- Establecer formatos y límites de archivos.
- Confirmar roles administrativos finales.
- Definir la fuente y mantenimiento de información normativa.
- Confirmar si las notificaciones estarán dentro del MVP.

