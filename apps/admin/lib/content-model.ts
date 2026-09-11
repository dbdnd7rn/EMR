export type CmsStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export type CmsEntityType =
  | 'condition'
  | 'condition_section'
  | 'specialist'
  | 'specialist_guide'
  | 'action_plan'
  | 'resource'
  | 'safety_message';

export type CmsRecord = {
  id?: string;
  entityType: CmsEntityType;
  slug: string;
  title: string;
  summary: string;
  body: string;
  safetyNote: string;
  status: CmsStatus;
  careArea?: string;
  sourceNote?: string;
  changeNote?: string;
  updatedAt?: string;
};

export const workflow: CmsStatus[] = ['draft', 'review', 'approved', 'published', 'archived'];

export const entityLabels: Record<CmsEntityType, string> = {
  condition: 'Condition',
  condition_section: 'Condition section',
  specialist: 'Specialist',
  specialist_guide: 'Specialist guide',
  action_plan: 'Action plan',
  resource: 'Resource',
  safety_message: 'Safety message',
};

export const editorGuidance: Record<CmsEntityType, string> = {
  condition: 'Use client-approved condition overview wording and link detailed sections separately.',
  condition_section: 'Keep each section focused on one approved education topic such as symptoms, monitoring, or questions.',
  specialist: 'Describe the clinician role and scope using the approved professional care-team material.',
  specialist_guide: 'Keep specialist education source-backed and separate from individualized medical advice.',
  action_plan: 'Action plans require explicit clinical approval before publication. Do not invent treatment changes.',
  resource: 'Use trusted links, downloads, videos, or text resources approved for the toolkit.',
  safety_message: 'Safety messages should be concise, prominent, and approved before they are shown to caregivers.',
};

export function canMoveToStatus(record: Pick<CmsRecord, 'title' | 'summary' | 'sourceNote' | 'status'>, next: CmsStatus) {
  if (!record.title.trim()) return { ok: false, reason: 'A title is required.' };

  if (next === 'review' && !record.summary.trim()) {
    return { ok: false, reason: 'Add a summary before sending content to review.' };
  }

  if ((next === 'approved' || next === 'published') && !record.sourceNote?.trim()) {
    return { ok: false, reason: 'Add a source/reference note before approval or publication.' };
  }

  if (next === 'published' && record.status !== 'approved' && record.status !== 'published') {
    return { ok: false, reason: 'Content must be approved before it can be published.' };
  }

  return { ok: true, reason: '' };
}

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
