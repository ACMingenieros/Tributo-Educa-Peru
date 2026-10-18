export const ADMIN_EMAIL = 'admin@gmail.com';

export function resolvePanelRole(email, emailVerified, claimRole) {
  if (
    emailVerified === true &&
    typeof email === 'string' &&
    email.trim().toLowerCase() === ADMIN_EMAIL
  ) {
    return 'admin';
  }

  return claimRole === 'editor' ? 'editor' : null;
}
