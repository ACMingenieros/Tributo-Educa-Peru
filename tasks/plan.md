# Plan: Integración del panel y Flutter con Firebase

## Alcance aprobado

Conservar `/` como demo visual del panel; exponer el panel con autenticación existente en `/admin`; reemplazar los datos estáticos de Flutter por módulos y submódulos publicados y visibles desde Firestore. No se modifican reglas, datos remotos, despliegues, autenticación móvil ni componentes didácticos.

## Decisiones

- Compartir el contrato Firestore existente (`modules/{id}` y `submodules/{id}`), sin embeber Flutter en la web.
- Aplicar en Flutter los filtros `status == published` e `isVisible == true`, y ordenar localmente por `order` para evitar un nuevo índice compuesto.
- Mantener el cliente Firestore Flutter detrás de un repositorio pequeño y testeable.
- Si Firebase no permite leer el contenido público o no hay contenido, mostrar estados explícitos sin exponer errores internos.

## Tareas

1. Añadir `/admin`, que renderiza `AdminConsole` existente. Verificar lint/build y ruta HTTP.
2. Implementar modelo/repositorio Flutter y pruebas para parseo, filtros y ordenamiento.
3. Conectar listado y detalle de módulos a Firestore con estados loading/error/empty/retry.
4. Ejecutar pruebas/análisis Flutter, build/lint del panel; revisar diff, commitear `feat:` y subir a `origin/main`.

## Riesgos y mitigación

| Riesgo | Mitigación |
| --- | --- |
| Reglas de Firestore rechazan consulta | Filtrar explícitamente por los campos que exige la regla; reportar sin ampliar permisos. |
| Datos históricos incompletos | Parseo tolerante con valores secundarios y estado de error controlado. |
| No hay configuración Firebase web local | `/admin` presenta el estado de configuración ya implementado por `AdminConsole`. |

## Criterios de aceptación

- `/` sigue mostrando `AdminDemo` y `/admin` muestra `AdminConsole`.
- Flutter lista solo documentos publicados y visibles, ordenados por `order`; al abrir un módulo lista sus submódulos con la misma política.
- Carga, error, vacío y reintento tienen UI accesible.
- Ningún cambio a reglas, datos remotos o despliegue.
