export type PanelRole = 'admin' | 'editor';

export declare const ADMIN_UID: string;

export declare function resolvePanelRole(
  uid: string,
  email: string | null,
  claimRole: unknown,
): PanelRole | null;
