export type PanelRole = 'admin' | 'editor';

export declare const ADMIN_EMAIL: string;

export declare function resolvePanelRole(
  email: string | null,
  emailVerified: boolean,
  claimRole: unknown,
): PanelRole | null;
