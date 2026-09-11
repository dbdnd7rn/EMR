import 'server-only';

import type { CmsRecord, CmsStatus } from './content-model';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function assertConfigured() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server configuration is not available.');
  }
}

function headers(prefer?: string) {
  assertConfigured();
  return {
    apikey: serviceRoleKey as string,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export function isSupabaseContentConfigured() {
  return Boolean(supabaseUrl && serviceRoleKey);
}

export async function listConditions() {
  assertConfigured();
  const response = await fetch(
    `${supabaseUrl}/rest/v1/conditions?select=id,slug,title,summary,specialist_name,status,updated_at&order=sort_order.asc,title.asc`,
    { headers: headers(), cache: 'no-store' },
  );

  if (!response.ok) throw new Error(`Unable to load conditions (${response.status}).`);
  return response.json();
}

export async function listSpecialistGuides() {
  assertConfigured();
  const response = await fetch(
    `${supabaseUrl}/rest/v1/specialist_guides?select=id,slug,title,summary,body,safety_note,status,updated_at&order=sort_order.asc,title.asc`,
    { headers: headers(), cache: 'no-store' },
  );

  if (!response.ok) throw new Error(`Unable to load specialist guides (${response.status}).`);
  return response.json();
}

export async function listSafetyMessages() {
  assertConfigured();
  const response = await fetch(
    `${supabaseUrl}/rest/v1/safety_messages?select=id,slug,title,message,severity,placement,status,updated_at&order=updated_at.desc`,
    { headers: headers(), cache: 'no-store' },
  );

  if (!response.ok) throw new Error(`Unable to load safety messages (${response.status}).`);
  return response.json();
}

// This function is intentionally server-only. Do not call it directly from a browser component.
// The future authenticated admin action/route must authorize the user before invoking it.
export async function saveSpecialistGuide(record: CmsRecord) {
  assertConfigured();

  const payload = {
    slug: record.slug,
    title: record.title,
    summary: record.summary,
    body: record.body,
    safety_note: record.safetyNote,
    status: record.status,
    updated_at: new Date().toISOString(),
  };

  const target = record.id
    ? `${supabaseUrl}/rest/v1/specialist_guides?id=eq.${encodeURIComponent(record.id)}`
    : `${supabaseUrl}/rest/v1/specialist_guides`;

  const response = await fetch(target, {
    method: record.id ? 'PATCH' : 'POST',
    headers: headers('return=representation'),
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Unable to save specialist guide (${response.status}).`);
  return response.json();
}

export async function recordContentVersion(input: {
  entityType: string;
  entityId: string;
  versionNumber: number;
  changeNote: string;
  approvedBy?: string;
  status: CmsStatus;
}) {
  assertConfigured();

  const response = await fetch(`${supabaseUrl}/rest/v1/content_versions`, {
    method: 'POST',
    headers: headers('return=representation'),
    body: JSON.stringify({
      entity_type: input.entityType,
      entity_id: input.entityId,
      version_number: input.versionNumber,
      change_note: input.changeNote,
      approved_by: input.approvedBy ?? null,
      approved_at: input.status === 'approved' || input.status === 'published' ? new Date().toISOString() : null,
    }),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`Unable to record content version (${response.status}).`);
  return response.json();
}
