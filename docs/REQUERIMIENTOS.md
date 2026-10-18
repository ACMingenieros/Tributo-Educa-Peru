# Requerimientos — Tributo Educa Perú

## 1. Descripción del producto

Tributo Educa Perú será una aplicación móvil informativa y educativa sobre temas tributarios. Permitirá a los usuarios consultar contenidos organizados en módulos y submódulos, incluyendo textos, recursos visuales, tablas, casos prácticos y evaluaciones.

El contenido será administrado desde un panel web y publicado de forma controlada.

## 2. Objetivo general

Brindar una experiencia sencilla, ordenada y visualmente uniforme para que los usuarios aprendan y consulten información tributaria desde una aplicación móvil.

## 3. Actores

### Usuario móvil

Consulta módulos, revisa submódulos, visualiza recursos y responde evaluaciones cuando estén disponibles.

### Administrador

Gestiona usuarios administrativos, módulos, submódulos, componentes y publicación de contenidos.

### Editor

Gestiona contenidos educativos, pero no necesariamente usuarios ni permisos.

## 4. Requerimientos funcionales

### RF-01: Consultar módulos

La aplicación debe mostrar los módulos publicados, con título, descripción e imagen cuando corresponda.

### RF-02: Consultar submódulos

El usuario debe poder ingresar a un módulo y visualizar sus submódulos publicados en el orden definido por el administrador.

### RF-03: Visualizar componentes

El usuario debe poder leer y utilizar los componentes configurados dentro de un submódulo.

### RF-04: Gestionar módulos

El administrador debe poder crear, editar, ordenar, archivar y publicar módulos.

### RF-05: Gestionar submódulos

El administrador debe poder crear, editar, ordenar, archivar y publicar submódulos.

### RF-06: Gestionar componentes

El administrador debe poder agregar, editar, eliminar, ocultar y ordenar componentes dentro de un submódulo.

### RF-07: Guardar borradores

El panel debe permitir guardar contenido incompleto sin mostrarlo al usuario móvil.

### RF-08: Publicar contenido

El administrador debe poder publicar contenido de forma explícita, previa validación de los datos mínimos requeridos.

### RF-09: Previsualizar contenido

El administrador debe poder previsualizar un submódulo antes de publicarlo.

### RF-10: Administrar archivos

El panel debe permitir subir y asociar imágenes, videos y documentos según los formatos aprobados.

### RF-11: Gestionar exámenes

El administrador debe poder crear preguntas, alternativas, respuestas correctas y retroalimentación cuando el componente de examen esté habilitado.

### RF-12: Notificaciones

La solución debe dejar preparada la integración con notificaciones push mediante Firebase Cloud Messaging.

### RF-13: Autenticación administrativa

El panel debe requerir autenticación y aplicar permisos según el rol del usuario.

## 5. Componentes iniciales requeridos

- Texto enriquecido.
- Imagen.
- Video.
- Documento descargable.
- Tarjeta informativa.
- Tabla comparativa.
- Preguntas frecuentes.
- Caso práctico.
- Examen.

La lista final debe validarse contra el documento entregado por el cliente.

## 6. Casos de uso

### CU-01: Consultar un módulo

**Actor:** Usuario móvil.

**Objetivo:** Revisar los módulos educativos disponibles.

**Flujo principal:**

1. El usuario abre la aplicación.
2. La aplicación consulta los módulos publicados.
3. El sistema muestra los módulos ordenados.
4. El usuario selecciona un módulo.
5. La aplicación muestra sus submódulos.

**Alternativas:**

- Si no hay conexión, se muestra un mensaje apropiado.
- Si no existen módulos publicados, se muestra un estado vacío.

**Criterios de aceptación:**

- Solo se muestran módulos publicados.
- Se respeta el orden configurado.
- Cada módulo muestra información suficiente para seleccionarlo.

### CU-02: Leer un submódulo

**Actor:** Usuario móvil.

**Objetivo:** Consultar el contenido de un submódulo.

**Flujo principal:**

1. El usuario selecciona un submódulo.
2. La aplicación consulta sus componentes publicados.
3. El sistema renderiza cada componente según su tipo.
4. El usuario desplaza la pantalla y consume el contenido.

**Criterios de aceptación:**

- Los componentes aparecen en el orden configurado.
- Los componentes no reconocidos no deben romper toda la pantalla.
- Los archivos y recursos deben mostrar estados de carga y error.

### CU-03: Crear un módulo

**Actor:** Administrador.

**Objetivo:** Crear la estructura principal de un tema educativo.

**Flujo principal:**

1. El administrador inicia sesión.
2. Ingresa a la gestión de módulos.
3. Selecciona “Crear módulo”.
4. Completa título, descripción, imagen y orden.
5. Guarda el módulo como borrador.

**Criterios de aceptación:**

- Los campos obligatorios son validados.
- El módulo se guarda como borrador.
- El módulo no aparece en la aplicación móvil hasta ser publicado.

### CU-04: Crear un submódulo con componentes

**Actor:** Administrador o editor.

**Objetivo:** Configurar el contenido de un submódulo.

**Flujo principal:**

1. El usuario selecciona un módulo.
2. Crea o edita un submódulo.
3. Agrega un componente.
4. Selecciona el tipo de componente.
5. Completa sus datos específicos.
6. Ordena los componentes.
7. Guarda el submódulo como borrador.

**Criterios de aceptación:**

- El componente se identifica por un tipo válido.
- Se validan sus datos específicos.
- El orden puede modificarse.
- El contenido puede previsualizarse antes de publicar.

### CU-05: Previsualizar un submódulo

**Actor:** Administrador o editor.

**Objetivo:** Revisar cómo se verá el contenido antes de publicarlo.

**Flujo principal:**

1. El usuario abre un submódulo en edición.
2. Selecciona “Previsualizar”.
3. El panel renderiza los componentes en orden.
4. El usuario revisa el contenido.
5. Regresa a edición o solicita publicación.

**Criterios de aceptación:**

- La previsualización representa la estructura de la aplicación móvil.
- Se distinguen componentes incompletos o inválidos.
- La previsualización no publica automáticamente el contenido.

### CU-06: Publicar un submódulo

**Actor:** Administrador.

**Objetivo:** Hacer visible un contenido en la aplicación móvil.

**Flujo principal:**

1. El administrador revisa el borrador.
2. Ejecuta la validación.
3. El sistema informa errores o advertencias.
4. El administrador confirma la publicación.
5. El contenido pasa a estado publicado.

**Criterios de aceptación:**

- Solo un rol autorizado puede publicar.
- Los campos obligatorios deben estar completos.
- La aplicación móvil puede consultar el contenido publicado.

### CU-07: Resolver un examen

**Actor:** Usuario móvil.

**Objetivo:** Responder preguntas sobre un submódulo.

**Flujo inicial recomendado:**

1. El usuario abre el componente de examen.
2. Responde las preguntas.
3. Envía sus respuestas.
4. El sistema calcula el resultado.
5. Se muestra retroalimentación.

**Decisión pendiente:** Confirmar si se almacenarán intentos, calificaciones e historial del usuario.

## 7. Requerimientos no funcionales

- La interfaz debe ser clara, legible y consistente.
- La aplicación debe adaptarse a distintos tamaños de pantalla.
- El contenido debe cargarse con estados de carga, error y vacío.
- Las operaciones administrativas deben requerir permisos.
- Los secretos no deben almacenarse en el código fuente.
- Los datos deben validarse tanto en cliente como en backend cuando sea necesario.
- La estructura debe permitir agregar nuevos tipos de componentes.
- El contenido debe poder mantenerse sin publicar una nueva versión de la aplicación.

## 8. Alcance del MVP

La primera versión debe concentrarse en publicar y consultar contenido educativo modular de manera segura y mantenible.

### 8.1 Incluido en el MVP

- Aplicación móvil Flutter para Android e iOS.
- Consulta de módulos y submódulos publicados.
- Texto enriquecido, imágenes, documentos, tarjetas, tablas comparativas y preguntas frecuentes.
- Panel administrativo web en Next.js.
- Autenticación administrativa.
- Roles de administrador y editor.
- Creación, edición, ordenamiento y archivado de contenido.
- Guardado de borradores.
- Previsualización de submódulos.
- Validación previa a la publicación.
- Publicación explícita de contenido.
- Carga y asociación de archivos aprobados.
- Estados de carga, error y vacío.
- Reglas de seguridad iniciales en Firebase.

### 8.2 Fuera del MVP

Salvo aprobación posterior, quedan fuera de la primera versión:

- Izipay y pagos.
- Contenido premium.
- Certificados.
- Rankings y gamificación.
- Analítica avanzada.
- Calculadoras tributarias complejas.
- Sistema completo de progreso del usuario.
- Recomendaciones personalizadas basadas en historial.
- Chat o asesoría profesional.
- Funcionamiento offline completo.

### 8.3 Priorización de componentes

| Prioridad | Componentes |
|---|---|
| MVP | Texto enriquecido, imagen, documento, tarjeta informativa, tabla comparativa y preguntas frecuentes |
| Segunda fase | Video, caso práctico, examen, checklist y glosario con búsqueda |
| Futura | Simuladores avanzados, calculadoras, línea de tiempo y recomendaciones personalizadas |

## 9. Requerimientos por plataforma

### 9.1 Aplicación móvil

La aplicación móvil debe:

- Mostrar únicamente contenido publicado.
- Respetar el orden definido por el administrador.
- Renderizar componentes reconocidos por su tipo.
- Mostrar un fallback para componentes desconocidos.
- Mostrar carga, error y estado vacío por pantalla o recurso.
- Permitir regresar sin perder el contexto de navegación.
- Adaptarse a móviles pequeños, estándar y tabletas.
- Mostrar avisos pedagógicos cuando el contenido pueda confundirse con asesoría profesional.

### 9.2 Panel administrativo

El panel debe:

- Requerir autenticación y aplicar permisos por rol.
- Permitir buscar y filtrar por título, módulo, estado y fecha.
- Crear, editar, ordenar, ocultar y archivar contenido.
- Mostrar claramente si un contenido es borrador, publicado o archivado.
- Validar formularios antes de guardar.
- Permitir guardar sin publicar.
- Solicitar confirmación antes de publicar o archivar.
- Advertir sobre cambios no guardados.
- Permitir previsualizar antes de publicar.

## 10. Roles y permisos

| Acción | Administrador | Editor | Usuario móvil |
|---|---:|---:|---:|
| Consultar contenido publicado | Sí | Sí | Sí |
| Crear y editar contenido | Sí | Sí, según alcance asignado | No |
| Ordenar componentes | Sí | Sí | No |
| Guardar borradores | Sí | Sí | No |
| Previsualizar borradores | Sí | Sí | No |
| Publicar contenido | Sí | No, salvo aprobación posterior | No |
| Archivar contenido | Sí | No, salvo aprobación posterior | No |
| Administrar usuarios y roles | Sí | No | No |

La interfaz no debe considerarse una medida de seguridad. Los permisos deben validarse en Firebase.

## 11. Estados y ciclo de vida del contenido

### 11.1 Estados

- `draft`: contenido incompleto o en revisión; no visible en la app móvil.
- `published`: contenido visible en la app móvil.
- `archived`: contenido conservado, pero retirado de la navegación.
- `coming_soon`: contenido futuro visible solo si se habilita explícitamente.

### 11.2 Reglas

- Guardar un borrador no lo publica.
- La publicación requiere validación y confirmación explícita.
- Archivar no debe borrar el contenido de forma irreversible.
- Un contenido publicado debe conservar su fecha de actualización.
- La aplicación móvil no debe mostrar contenido archivado.
- Los componentes ocultos no deben renderizarse para el usuario final.

## 12. Requerimientos de validación

Antes de publicar un módulo o submódulo, el sistema debe validar:

- Título obligatorio.
- Orden válido.
- Estado válido.
- Relación correcta con su módulo padre.
- Tipo válido para cada componente.
- Datos obligatorios del componente.
- Recursos asociados disponibles.
- Ausencia de errores bloqueantes.

Las advertencias no bloqueantes deben mostrarse antes de confirmar la publicación.

## 13. Requerimientos de archivos y conectividad

El panel debe validar tipo MIME, tamaño máximo, nombre seguro, estado de carga y disponibilidad de la referencia en Storage.

Mientras no se apruebe un modo offline completo:

- Las consultas deben mostrar estados de carga y error.
- Las acciones deben permitir reintentar.
- No se debe confirmar una publicación sin respuesta exitosa del backend.
- Una interrupción de red no debe borrar el contenido escrito en un formulario.

Los formatos y límites definitivos de archivos deben definirse antes de implementar la biblioteca de archivos.

## 14. Requerimientos de contenido normativo

Cuando corresponda, el contenido debe poder registrar y mostrar:

- Fuente normativa o institucional.
- Fecha de última revisión.
- Fecha de vigencia.
- Responsable editorial.
- Aviso de carácter educativo.

El contenido normativo debe poder actualizarse sin publicar una nueva versión de la aplicación móvil.

## 15. Criterios de aceptación del MVP

El MVP se considerará funcional cuando:

1. Un administrador pueda iniciar sesión desde el panel.
2. Un administrador pueda crear un módulo como borrador.
3. Un editor pueda crear un submódulo y agregar componentes autorizados.
4. Los componentes puedan ordenarse y validarse.
5. El submódulo pueda previsualizarse antes de publicarse.
6. Solo un administrador pueda publicar contenido.
7. La aplicación móvil muestre únicamente módulos y submódulos publicados.
8. El orden configurado en el panel se respete en la aplicación móvil.
9. Los estados de carga, error y vacío sean visibles y comprensibles.
10. Un componente desconocido no provoque el cierre de toda la pantalla.
11. Los archivos se almacenen mediante Firebase Storage con reglas autorizadas.
12. Firestore impida que un usuario sin permisos publique o modifique contenido administrativo.

## 16. Casos de error mínimos

La solución debe contemplar:

- Sin conexión al cargar módulos.
- Módulo inexistente o archivado.
- Submódulo sin componentes publicados.
- Imagen o documento no disponible.
- Formulario incompleto.
- Componente con tipo no soportado.
- Error al guardar borrador.
- Error al publicar.
- Sesión administrativa expirada.
- Permiso insuficiente.
- Archivo rechazado por formato o tamaño.

Cada error debe informar qué ocurrió, si el usuario puede reintentar y cuál es la alternativa disponible.

## 17. Alcance futuro

Quedan para fases posteriores, salvo nueva aprobación:

- Pasarela de pago Izipay.
- Contenido premium.
- Progreso del usuario.
- Certificados.
- Rankings o gamificación.
- Analítica avanzada.
- Calculadoras tributarias.

## 18. Decisiones pendientes

- Revisar el Word y confirmar el inventario definitivo de módulos y submódulos.
- Confirmar el nivel de detalle de los exámenes.
- Definir si habrá registro de usuarios móviles o acceso anónimo.
- Definir los formatos y límites de archivos.
- Definir roles administrativos definitivos.
- Confirmar la necesidad de funcionamiento offline.
- Confirmar identidad visual, logo y tipografías.
- Confirmar el inventario final de componentes del MVP.
- Definir la fuente normativa y el proceso de revisión editorial.
- Definir el tamaño máximo y formatos permitidos para cada tipo de archivo.
- Definir si los editores tendrán módulos asignados o acceso global.
