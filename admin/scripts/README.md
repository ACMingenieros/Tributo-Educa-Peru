# Asignar el primer rol administrador

El panel no tiene cuentas predeterminadas. Crea primero el usuario en Firebase Authentication con correo y contraseña, y verifica su correo electrónico.

Este script asigna el custom claim `role: "admin"` a una cuenta existente. Usa Firebase Admin SDK con Application Default Credentials y solicita confirmación explícita con el texto `ASIGNAR ADMIN`. Los claims existentes se conservan.

## Credenciales locales

Usa una identidad de Google autorizada para administrar usuarios de Firebase Authentication en el proyecto objetivo. La identidad debe tener el rol IAM `Firebase Authentication Admin` (o permisos equivalentes mínimos).

Configura ADC en la sesión de PowerShell. Se recomienda iniciar sesión con Google Cloud CLI si ya está instalado:

```powershell
gcloud auth application-default login
```

Si no tienes Google Cloud CLI, crea una cuenta de servicio dedicada en Google Cloud Console → IAM y administración → Cuentas de servicio. Asígnale `Firebase Authentication Admin`, crea una clave JSON y guárdala fuera de este repositorio. En PowerShell, apunta ADC a esa clave:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\ruta\segura\clave-admin-temporal.json"
```

No copies la clave a `admin/`, no la compartas y revoca la clave en Google Cloud Console y elimina el archivo local al terminar.

## Ejecución

Desde la carpeta `admin/`:

```powershell
npm run set-admin-role -- --project-id=tributo-educa-peru --email=TU_CORREO
```

Revisa cuidadosamente el proyecto y correo que muestra el script; confirma escribiendo exactamente `ASIGNAR ADMIN`. Si cancelas o el correo no está verificado, no habrá cambios.

Después, vuelve al panel en `/admin`, cierra sesión e inicia sesión otra vez para que Firebase emita un token con el nuevo claim. Este script no crea usuarios, no modifica Firestore y no despliega reglas.
