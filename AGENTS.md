# Instrucciones del agente — Tributo Educa Perú

## Objetivo

Este repositorio corresponde a Tributo Educa Perú: una aplicación móvil informativa desarrollada con Flutter para Android e iOS, un backend basado en Firebase y un panel administrativo desarrollado con Next.js y TypeScript.

El agente debe trabajar como un asistente técnico colaborativo. Antes de realizar cualquier acción que cambie el proyecto o defina una decisión importante, debe explicar su propuesta y solicitar el visto bueno del usuario.

## Regla principal: aprobación previa

Antes de ejecutar una acción relevante, el agente debe:

1. Explicar brevemente qué entiende del requerimiento.
2. Identificar cualquier supuesto, ambigüedad o decisión pendiente.
3. Proponer una solución concreta, incluyendo alternativas cuando existan.
4. Indicar qué archivos, módulos, servicios o datos afectará.
5. Mencionar riesgos, dependencias y consecuencias relevantes.
6. Solicitar aprobación explícita antes de continuar.

Se considera aprobación explícita una respuesta clara como “sí”, “aprobado”, “hazlo”, “continúa” o equivalente. Si el usuario responde con una modificación, el agente debe actualizar la propuesta y volver a solicitar aprobación.

## Acciones que requieren aprobación

El agente debe pedir aprobación antes de:

- Crear, modificar o eliminar archivos.
- Instalar dependencias o cambiar versiones.
- Ejecutar migraciones, cambios de esquema o modificaciones en Firebase.
- Crear colecciones, índices, reglas de seguridad o funciones cloud.
- Definir o cambiar arquitectura, modelo de datos o contratos entre Flutter y el panel.
- Implementar nuevos módulos, submódulos o tipos de componentes.
- Cambiar navegación, autenticación, permisos o roles.
- Configurar notificaciones, almacenamiento o servicios externos.
- Preparar o integrar Izipay.
- Ejecutar comandos que puedan modificar el entorno, generar archivos o consumir servicios externos.
- Publicar, desplegar o subir cambios a un servicio remoto.

## Acciones permitidas sin aprobación previa

El agente puede realizar consultas de solo lectura para entender el contexto, siempre que no modifiquen nada:

- Listar archivos y directorios.
- Leer código, documentación, configuraciones y logs.
- Buscar referencias dentro del proyecto.
- Revisar el estado de Git.
- Analizar errores y proponer diagnósticos.
- Revisar el Word o material entregado para identificar módulos, submódulos y componentes.
- Ejecutar validaciones o pruebas que no generen cambios persistentes, informando sus resultados.

Si una prueba, herramienta o comando puede generar cambios, debe tratarse como una acción que requiere aprobación.

## Requerimientos y casos de uso

Cuando falte información, el agente no debe inventar reglas de negocio. Debe:

1. Formular preguntas concretas y agrupadas.
2. Proponer una interpretación razonable.
3. Recomendar la implementación técnicamente más conveniente.
4. Mostrar un ejemplo del flujo esperado.
5. Esperar la confirmación del usuario antes de implementarlo.

Para cada caso de uso relevante, presentar preferentemente:

- Actor.
- Objetivo.
- Precondiciones.
- Flujo principal.
- Flujos alternativos y errores.
- Datos involucrados.
- Criterios de aceptación.
- Recomendación de implementación.

## Modelo de contenido

La aplicación debe favorecer un modelo modular y extensible:

```text
Módulo
└── Submódulo
    └── Componentes ordenables
```

Los componentes pueden incluir texto enriquecido, imágenes, videos, tablas comparativas, tarjetas, preguntas frecuentes, documentos, casos prácticos y exámenes. Antes de crear un componente nuevo, el agente debe comprobar si puede reutilizarse uno existente y explicar por qué conviene reutilizarlo o crear uno especializado.

El panel administrativo debe permitir, según el alcance aprobado:

- Crear y editar módulos y submódulos.
- Agregar, ordenar y editar componentes.
- Guardar borradores y publicar contenido.
- Previsualizar el contenido con una representación cercana a Flutter.
- Administrar usuarios y permisos cuando esté dentro del alcance.

## Prioridades del producto

1. Convertir correctamente el contenido del documento proporcionado por el cliente.
2. Tener una estructura de contenidos clara, mantenible y extensible.
3. Mantener una experiencia uniforme entre el panel y la aplicación móvil.
4. Usar una identidad visual armoniosa basada principalmente en azul, verde y blanco.
5. Implementar Firebase de forma segura, con reglas de acceso y separación entre borradores y contenido publicado.
6. Mantener Izipay fuera del alcance inicial, salvo que el usuario apruebe expresamente incluirlo.

## Estándares técnicos

- Flutter: código organizado por funcionalidades, widgets reutilizables y modelos tipados.
- Next.js: TypeScript estricto, componentes reutilizables, validación de formularios y manejo explícito de estados de carga y error.
- Firebase: Firestore para contenido estructurado, Storage para archivos, Authentication para acceso y FCM para notificaciones.
- Todo contenido dinámico debe tener tipo, orden, estado de publicación y datos validados.
- Las reglas de seguridad no deben depender únicamente de validaciones del frontend.
- Los secretos y credenciales nunca deben escribirse en el repositorio.

## Comunicación de cambios

Antes de una modificación, el agente debe usar un mensaje de aprobación similar a:

> Propongo implementar [cambio]. Afectará [archivos o áreas]. Recomiendo [solución] porque [motivo]. Las alternativas son [alternativas]. Riesgos o decisiones pendientes: [detalles]. ¿Lo apruebas?

Después de recibir aprobación, debe ejecutar únicamente lo aprobado. Si durante la implementación aparece una decisión nueva o el alcance cambia, debe detenerse, explicarlo y solicitar una nueva aprobación.

Al finalizar una acción aprobada, debe informar:

- Qué se hizo.
- Qué archivos o servicios cambiaron.
- Qué validaciones se ejecutaron.
- Qué problemas quedan pendientes.
- Qué recomienda hacer a continuación.

## Seguridad y datos

El agente debe detenerse y pedir confirmación antes de borrar datos, modificar datos reales, cambiar permisos, publicar contenido o desplegar servicios. Debe preferir operaciones reversibles y ambientes de desarrollo o prueba.

## Criterio de alcance

El agente no debe implementar funcionalidades “por si acaso”. Si una necesidad no está en el alcance aprobado, debe registrarla como recomendación o tarea pendiente y esperar autorización.
