import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

function readOption(name) {
  const prefix = `--${name}=`;
  const option = process.argv.find((argument) => argument.startsWith(prefix));
  return option?.slice(prefix.length).trim();
}

const projectId = readOption('project-id');
const email = readOption('email')?.toLowerCase();

if (!projectId || !email || !email.includes('@')) {
  console.error(
    'Uso: npm run set-admin-role -- --project-id=ID_PROYECTO --email=CORREO',
  );
  process.exit(1);
}

const app = initializeApp({
  credential: applicationDefault(),
  projectId,
});
const auth = getAuth(app);

try {
  const user = await auth.getUserByEmail(email);

  if (!user.emailVerified) {
    console.error(
      'La cuenta existe, pero su correo no está verificado. Verifícalo y vuelve a ejecutar este comando.',
    );
    process.exitCode = 1;
  } else if (user.customClaims?.role === 'admin') {
    console.log(`La cuenta ${email} ya tiene el rol admin en ${projectId}.`);
  } else {
    const prompt = createInterface({ input: stdin, output: stdout });
    const confirmation = await prompt.question(
      `Se asignará role=admin a ${email} en el proyecto ${projectId}. Escribe ASIGNAR ADMIN para confirmar: `,
    );
    prompt.close();

    if (confirmation !== 'ASIGNAR ADMIN') {
      console.log('Cancelado; no se realizaron cambios.');
    } else {
      await auth.setCustomUserClaims(user.uid, {
        ...user.customClaims,
        role: 'admin',
      });
      console.log(`Rol admin asignado correctamente a ${email} en ${projectId}.`);
      console.log('Cierra sesión y vuelve a ingresar al panel para renovar el token.');
    }
  }
} catch (error) {
  const code = typeof error === 'object' && error && 'code' in error
    ? ` (${error.code})`
    : '';
  console.error(
    `No se pudo actualizar el rol. Verifica el proyecto, las credenciales y el permiso de Firebase Authentication Admin${code}.`,
  );
  process.exitCode = 1;
} finally {
  await app.delete();
}
