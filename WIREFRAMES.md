# Wireframes de Tributo Educa Perú

## 1. Propósito

Este documento define el mapa de pantallas y los wireframes funcionales iniciales para la aplicación móvil y el panel administrativo de Tributo Educa Perú.

Los wireframes describen estructura, jerarquía, navegación y acciones principales. No reemplazan el sistema visual de `DESIGN.md` ni representan todavía el diseño final de alta fidelidad.

## 2. Convenciones

- `[Botón]`: acción principal o secundaria.
- `[Campo]`: entrada de texto o selección.
- `[Card]`: tarjeta de contenido.
- `[Lista]`: conjunto de elementos repetibles.
- `→`: navegación hacia otra pantalla.
- `↑`: acción de publicación o confirmación.
- `⋯`: acciones secundarias.

Cada pantalla debe definir posteriormente sus estados de carga, vacío, error y éxito.

## 3. Mapa general de navegación

### 3.1 Aplicación móvil

```text
Inicio
├── Buscar contenido
├── Guía destacada → Detalle de submódulo
├── Continuar aprendiendo → Lección
└── Ver guardados → Guardados

Módulos
├── Lista de módulos
├── Menú de módulos → Detalle de módulo
└── Detalle de módulo → Lista de submódulos

Herramientas
├── Glosario
├── Comparadores
├── Simuladores
└── Checklists

Guardados
└── Contenido o resultados guardados → Detalle correspondiente

Perfil
├── Datos del usuario
├── Preferencias
└── Avisos y configuración
```

### 3.2 Panel administrativo

```text
Login
└── Dashboard
    ├── Módulos
    │   ├── Lista de módulos
    │   ├── Crear módulo
    │   └── Editar módulo
    ├── Submódulos
    │   ├── Lista de submódulos
    │   ├── Crear submódulo
    │   └── Editor de contenido
    ├── Previsualización
    ├── Biblioteca de archivos
    ├── Usuarios y roles
    └── Configuración
```

## 4. Wireframes de la aplicación móvil

### WF-M01 Inicio

```text
┌─────────────────────────────────────┐
│ ☰   Tributo Educa Perú       ◯ Perfil│
├─────────────────────────────────────┤
│                                     │
│ BIENVENIDO A TRIBUTO EDUCA PERÚ     │
│ Hola, [nombre]                      │
│ Resuelve dudas y formaliza tu negocio│
│                                     │
│ [ 🔍 ¿Qué necesitas resolver hoy? ] │
│                                     │
│ [ Guía destacada                    ]│
│   Título y descripción              │
│   [Comenzar →]                      │
│                                     │
│ CONTINÚA APRENDIENDO    Ver todo →  │
│ [Contenido reciente o en progreso]  │
│                                     │
├─────────────────────────────────────┤
│ Inicio | Módulos | Herramientas     │
│ Guardados | Perfil                  │
└─────────────────────────────────────┘
```

Objetivo: orientar al usuario hacia contenido relevante y permitir iniciar o continuar una actividad.

### WF-M02 Lista de módulos

```text
┌─────────────────────────────────────┐
│ ← Módulos              🔍 Buscar     │
├─────────────────────────────────────┤
│ [Filtro: Todos ▾]                   │
│                                     │
│ [▣] Módulo 1: Tributario        ›   │
│     SUNAT · Activo                  │
│     Regímenes, comprobantes         │
│                                     │
│ [▣] Módulo 2: Laboral           ›   │
│     REMYPE, planillas, SUNAFIL      │
│                                     │
│ [▣] Módulo 3: Societario        ›   │
│     EIRL, SRL, SAC, SUNARP          │
│                                     │
│ [▣] Módulo futuro              ›    │
│     Próximamente                    │
└─────────────────────────────────────┘
```

Reglas:

- Mostrar solo módulos publicados.
- Respetar el campo `order`.
- El estado “Próximamente” debe ser explícito.
- El estado vacío debe explicar que aún no hay módulos publicados.

### WF-M03 Menú lateral de módulos

```text
┌──────────────────────────────┐
│ [Logo] Tributo Educa     ×   │
│ RUTA DE APRENDIZAJE          │
├──────────────────────────────┤
│ ← Todos los módulos          │
│                              │
│ [▣] Módulo 1: Tributario ⌃  │
│   ● 1.1 Regímenes       3 pasos│
│     1.2 Comprobantes         │
│     1.3 Calendario SUNAT     │
│                              │
│ [▣] Módulo 2: Laboral     ›  │
│ [▣] Módulo 3: Societario  ›  │
│ [▣] Módulo 4: Contable    ›  │
│ [▣] Módulo 5: Inmobiliario›  │
├──────────────────────────────┤
│ Glosario tributario Consultar│
└──────────────────────────────┘
```

El menú debe conservar el contexto actual y permitir regresar a la lista general.

### WF-M04 Detalle de submódulo o lección

```text
┌─────────────────────────────────────┐
│ ← Regímenes Tributarios       ⋯     │
├─────────────────────────────────────┤
│ [Indicador de avance]               │
│ 1.1 Regímenes Tributarios           │
│ Comparación para elegir mejor       │
│                                     │
│ [Aviso pedagógico]                 │
│ Contenido educativo, no asesoría.   │
│                                     │
│ [Texto enriquecido]                │
│ Concepto y explicación              │
│                                     │
│ [Tabla o tarjeta comparativa]      │
│                                     │
│ [Caso práctico / FAQ / documento]  │
│                                     │
│ [Guardar]              [Continuar] │
└─────────────────────────────────────┘
```

Reglas:

- Renderizar componentes publicados en orden.
- Mostrar error únicamente en el componente afectado cuando sea posible.
- No bloquear toda la lección por un recurso no disponible.
- Mantener acciones de navegación visibles.

### WF-M05 Comparador

```text
┌─────────────────────────────────────┐
│ ← Comparador                        │
├─────────────────────────────────────┤
│ Comparador de formas empresariales  │
│ Selecciona dos opciones             │
│                                     │
│ Opción A              Opción B      │
│ [ RUC 10          ▾ ] [ S.A.C.  ▾ ] │
│                                     │
│ RESPONSABILIDAD PATRIMONIAL         │
│ RUC 10              S.A.C.          │
│ Información         Información     │
│                                     │
│ NÚMERO DE SOCIOS / TITULARES        │
│ RUC 10              S.A.C.          │
│                                     │
│ [← Anterior]          [Finalizar →] │
└─────────────────────────────────────┘
```

En móvil, si las columnas no son legibles, se debe usar desplazamiento horizontal o convertir cada criterio en una tarjeta.

### WF-M06 Resultado de diagnóstico

```text
┌─────────────────────────────────────┐
│ ← Resultado del diagnóstico         │
├─────────────────────────────────────┤
│ Evaluación completada               │
│ 4 de 4 respuestas                   │
│                                     │
│ Régimen sugerido para tu perfil:    │
│                                     │
│ [ MÁS RECOMENDADO ]                 │
│ Régimen MYPE Tributario             │
│ Descripción de la recomendación     │
│                                     │
│ Tus criterios determinantes         │
│ [Criterio 1]                        │
│ [Criterio 2]                        │
│ [Criterio 3]                        │
│                                     │
│ ¿Por qué descartamos otros?         │
│ [Alternativa descartada]            │
│                                     │
│ [Aviso pedagógico y legal]          │
│                                     │
│ [Guardar diagnóstico]               │
│ [Ver guía completa]                 │
│ [Reiniciar simulador]               │
└─────────────────────────────────────┘
```

El resultado debe explicar los criterios y no presentar una recomendación como resolución oficial.

## 5. Wireframes del panel administrativo

### WF-A01 Login

```text
┌────────────────────────────────────────────┐
│              [Logo Tributo Educa]          │
│                                            │
│ Iniciar sesión                             │
│ [Correo electrónico                    ]   │
│ [Contraseña                            ]   │
│ [ ] Recordar sesión                       │
│                                            │
│ [Iniciar sesión]                           │
│ ¿Olvidaste tu contraseña?                  │
│                                            │
│ [Mensaje de error si corresponde]          │
└────────────────────────────────────────────┘
```

### WF-A02 Dashboard

```text
┌──────────────────────────────────────────────────────┐
│ ☰ Tributo Educa Perú              [Usuario] [Salir]  │
├───────────────┬──────────────────────────────────────┤
│ Dashboard     │ Resumen                               │
│ Módulos       │                                      │
│ Archivos      │ [Borradores] [Publicados] [Alertas]  │
│ Previsualizar │                                      │
│ Usuarios      │ Actividad reciente                  │
│ Configuración │ [Lista de cambios]                  │
└───────────────┴──────────────────────────────────────┘
```

### WF-A03 Lista de módulos

```text
┌──────────────────────────────────────────────────────┐
│ Módulos                         [+ Crear módulo]       │
├──────────────────────────────────────────────────────┤
│ [Buscar...] [Estado ▾] [Fecha ▾]                     │
├──────┬────────────────────┬──────────┬───────────────┤
│ Orden│ Título             │ Estado   │ Acciones      │
├──────┼────────────────────┼──────────┼───────────────┤
│ 1    │ Tributario         │ Publicado│ Editar ⋯      │
│ 2    │ Laboral            │ Borrador │ Editar ⋯      │
│ 3    │ Societario         │ Archivado│ Ver ⋯         │
└──────┴────────────────────┴──────────┴───────────────┘
```

### WF-A04 Crear o editar módulo

```text
┌──────────────────────────────────────────────────────┐
│ ← Módulos / Nuevo módulo                             │
├──────────────────────────────────────────────────────┤
│ Información general                                  │
│ [Título                                        ]      │
│ [Slug                                          ]      │
│ [Descripción                                    ]     │
│ [Imagen] [Subir archivo]                             │
│ [Orden]       [Estado: Borrador ▾]                   │
│                                                      │
│ [Cancelar]                    [Guardar borrador]     │
└──────────────────────────────────────────────────────┘
```

### WF-A05 Editor de submódulo

```text
┌─────────────────────────────────────────────────────────┐
│ ← Módulo / Submódulo                  [Previsualizar]   │
├───────────────────────┬─────────────────────────────────┤
│ Información            │ Componentes                    │
│ [Título]              │ [≡] Texto introductorio   ⋯     │
│ [Descripción]         │ [≡] Tabla comparativa     ⋯     │
│ [Orden]               │ [≡] Preguntas frecuentes  ⋯     │
│ [Estado ▾]            │                                 │
│                       │ [+ Agregar componente]          │
│                       │                                 │
│                       │ [Guardar borrador] [Validar]   │
└───────────────────────┴─────────────────────────────────┘
```

El ordenamiento debe permitir teclado y controles alternativos al arrastre.

### WF-A06 Editor de componente

```text
┌──────────────────────────────────────────────────────┐
│ Componente: Tabla comparativa                        │
├──────────────────────────────────────────────────────┤
│ [Título                                          ]   │
│ [Visibilidad: Visible ▾]                              │
│                                                      │
│ Columnas                                             │
│ [Nombre] [Agregar columna]                            │
│                                                      │
│ Filas                                                │
│ [Dato] [Dato] [Dato]  [Eliminar]                     │
│ [+ Agregar fila]                                     │
│                                                      │
│ [Cancelar]              [Guardar componente]         │
└──────────────────────────────────────────────────────┘
```

Cada tipo de componente debe tener un formulario específico y validaciones propias.

### WF-A07 Previsualización y publicación

```text
┌──────────────────────────────────────────────────────┐
│ Previsualización: Regímenes Tributarios              │
├──────────────────────────────┬───────────────────────┤
│ Vista móvil                  │ Validación            │
│ [Render de la lección]      │ ✓ Título completo     │
│                             │ ✓ Componentes válidos │
│                             │ ! Falta fuente legal  │
│                             │                       │
│                             │ [Volver a editar]     │
│                             │ [Publicar]            │
└──────────────────────────────┴───────────────────────┘
```

Publicar requiere confirmación explícita y debe mostrar el resumen de cambios, advertencias y consecuencias.

## 6. Estados comunes

### Carga

- Skeleton o indicador contextual.
- Mantener la estructura de la pantalla cuando sea posible.
- Evitar bloquear toda la aplicación por una imagen o documento.

### Vacío

- Explicar por qué no hay datos.
- Mostrar la acción siguiente cuando exista.
- Diferenciar “todavía no hay contenido” de “no se encontraron resultados”.

### Error

- Explicar el problema en lenguaje simple.
- Permitir reintentar.
- Mantener el contexto y los datos escritos cuando sea posible.

### Éxito

- Confirmar la acción realizada.
- Indicar el nuevo estado.
- Ofrecer la siguiente acción relevante.

## 7. Criterios de validación de wireframes

Antes de implementar una pantalla se debe comprobar:

- Tiene un objetivo principal identificable.
- La navegación de entrada y salida está definida.
- La acción principal es visible.
- Se contemplan carga, vacío, error y éxito.
- La pantalla funciona en el breakpoint correspondiente.
- La jerarquía visual coincide con `DESIGN.md`.
- Los términos coinciden con `REQUERIMIENTOS.md`.
- Los permisos y estados de contenido están representados.
- El flujo puede completarse sin depender de instrucciones verbales.

## 8. Pantallas pendientes de diseño detallado

- Recuperación de contraseña.
- Gestión de usuarios y roles.
- Biblioteca de archivos.
- Glosario con búsqueda.
- Examen y retroalimentación.
- Checklist interactivo.
- Estado de sesión expirada.
- Confirmación de archivado.
- Confirmación de pérdida de cambios.

