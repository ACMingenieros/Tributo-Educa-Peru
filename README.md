# Tributo Educa Perú

Plataforma educativa tributaria compuesta por una aplicación móvil Flutter, un panel administrativo Next.js y servicios Firebase.

## Estructura

- `mobile/tributo_educa/`: aplicación móvil Flutter para Android e iOS.
- `admin/`: panel administrativo Next.js.
- `packages/contracts/`: contratos de datos compartidos.
- `docs/`: requerimientos y documentación funcional.

## Estado actual

El panel Next.js incluye una consola de contenidos preparada para Firebase: módulos, submódulos, componentes ordenables, borradores, vista previa y publicación con roles. El proyecto Firebase todavía no existe y la aplicación móvil aún no consume contenidos de Firestore; la sincronización en vivo requiere completar ambas configuraciones.

### Preparar el panel en desarrollo

1. Crea un proyecto Firebase de desarrollo y registra una aplicación web.
2. Habilita Firebase Authentication con correo y contraseña y crea Firestore.
3. Copia `admin/.env.example` como `admin/.env.local` y completa los valores de configuración de la app web (no uses claves de cuenta de servicio en el cliente).
4. Despliega las reglas e índices revisados con `firebase.json` usando Firebase CLI, después de verificar el proyecto destino.
5. En esta versión, el acceso administrador está limitado al correo verificado `admin@gmail.com`, definido también en `firestore.rules`. Los editores siguen usando el claim `role: "editor"`.
6. Publica las reglas actualizadas de Firestore antes de intentar guardar o publicar contenido. Instala dependencias en `admin/` y ejecuta `npm run dev`.

La configuración del proyecto Firebase y estas reglas aún deben aplicarse en la consola del proyecto. El acceso administrador usa el correo verificado indicado arriba; las cuentas editoras siguen usando custom claims. La vista previa del panel es aproximada y no garantiza paridad exacta con Flutter. Recursos multimedia se agregan mediante URL por ahora; Storage y la carga directa requieren definir límites y formatos.

## Documentación

- [Requerimientos](docs/REQUERIMIENTOS.md)
- [Arquitectura](docs/ARQUITECTURA.md)
- [Diseño](DESIGN.md)
- [Wireframes](WIREFRAMES.md)
