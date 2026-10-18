export const ADMIN_UID = 'YUlPcPNGRLbapevGQdrp42DKY6y1';

export function resolvePanelRole(uid, email, claimRole) {
  if (uid === ADMIN_UID) return 'admin';

  return claimRole === 'editor' ? 'editor' : null;
}
