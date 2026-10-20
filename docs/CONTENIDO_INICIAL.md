# Contenido inicial del temario

El archivo `admin/lib/firebase/word-content.ts` contiene 15 lecciones y 47 bloques educativos redactados a partir de `ESTRUCTURA TÉCNICA Y FUNCIONAL DE LOS MÓDULOS.docx`. Abarca los seis módulos del Word y agrega una fuente institucional a cada lección.

## Carga desde el panel

1. Inicia sesión como administrador.
2. Si aún no hay módulos, pulsa **Cargar estructura del Word**.
3. Pulsa **Cargar borradores del temario**. El panel comprueba que existen los 15 submódulos y agrega bloques solo a los que no tienen contenido. La operación completa se guarda en un lote; los bloques existentes se conservan.
4. Revisa y ajusta cada lección en **Vista previa**. Confirma que las fuentes y condiciones legales siguen vigentes.
5. Publica primero cada módulo y luego sus submódulos. Al publicar un submódulo, se publican sus componentes visibles.

Flutter consulta exclusivamente módulos, submódulos y componentes con `status: published` e `isVisible: true`. Por eso los borradores no aparecen en la aplicación hasta completar el paso 5. Al tocar un submódulo publicado, se abre su pantalla de lectura.

Este lote proporciona contenido educativo inicial. El simulador tributario, las calculadoras, las alertas push y los exámenes interactivos mencionados en el Word requieren flujos y reglas de negocio adicionales; este lote no los simula.
