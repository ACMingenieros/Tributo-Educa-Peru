export type ContentStatus = 'draft' | 'published' | 'archived' | 'coming_soon';

export type UserRole = 'admin' | 'editor' | 'mobile_user';

export type ComponentType =
  | 'rich_text'
  | 'image'
  | 'document'
  | 'info_card'
  | 'comparison_table'
  | 'faq'
  | 'video'
  | 'practical_case'
  | 'exam'
  | 'checklist'
  | 'glossary'
  | 'simulator'
  | 'calculator'
  | 'alert_calendar'
  | 'legal_notice';

export interface AuditFields {
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

export interface Module extends AuditFields {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  order: number;
  status: ContentStatus;
  isVisible: boolean;
}

export interface Submodule extends AuditFields {
  id: string;
  moduleId: string;
  title: string;
  slug: string;
  description: string;
  order: number;
  status: ContentStatus;
  isVisible: boolean;
}

export interface ContentComponent extends AuditFields {
  id: string;
  moduleId: string;
  submoduleId: string;
  type: ComponentType;
  title?: string;
  order: number;
  status: ContentStatus;
  isVisible: boolean;
  data: Record<string, unknown>;
}

export interface ValidationIssue {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

export class UnsupportedComponentError extends Error {
  constructor(public readonly type: string) {
    super(`Unsupported content component type: ${type}`);
    this.name = 'UnsupportedComponentError';
  }
}
