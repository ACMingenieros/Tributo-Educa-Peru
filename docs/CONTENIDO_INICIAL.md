# Contenido inicial del temario

El archivo `admin/lib/firebase/word-content.ts` contiene 15 lecciones educativas basadas en los temas y objetivos de `ESTRUCTURA TÉCNICA Y FUNCIONAL DE LOS MÓDULOS.docx`. Las lecciones alternan tablas comparativas, tarjetas, preguntas frecuentes, casos prácticos, listas de verificación y términos de glosario, e incluyen una fuente institucional. Los formatos interactivos avanzados no se simulan.

## Carga desde el panel

1. Inicia sesión como administrador.
2. Si aún no hay módulos, pulsa **Cargar estructura del Word**.
3. Pulsa **Cargar borradores del temario**. El panel comprueba que existen los 15 submódulos y agrega bloques solo a los que no tienen contenido. La operación completa se guarda en un lote; los bloques existentes se conservan.
4. Para refrescar las 15 lecciones del lote inicial, usa **Actualizar 15 lecciones**. La acción actualiza los bloques reconocidos, conserva sus identificadores y estado de publicación, y agrega los bloques nuevos que falten; no elimina componentes. Antes de escribir, comprueba todas las lecciones. Si detecta un bloque renombrado, reordenado o agregado manualmente, cancela el lote para proteger el contenido.
5. Revisa y ajusta cada lección en **Vista previa**. Confirma que las fuentes y condiciones legales siguen vigentes.
6. Si los temas son borradores, publica primero cada módulo y luego sus submódulos. Al publicar un submódulo, se publican sus componentes visibles. La actualización conserva el estado ya publicado.

Flutter consulta exclusivamente módulos, submódulos y componentes con `status: published` e `isVisible: true`. Por eso los borradores no aparecen en la aplicación hasta completar el paso 5. Al tocar un submódulo publicado, se abre su pantalla de lectura.

Este lote proporciona contenido educativo inicial. El simulador tributario, las calculadoras, las alertas push y los exámenes interactivos mencionados en el Word requieren flujos y reglas de negocio adicionales; este lote no los simula.
