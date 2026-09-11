'use client';

import { useMemo, useState } from 'react';

import { useAdminAuth } from '../components/AdminAuthGate';

type Status = 'Draft' | 'In review' | 'Approved' | 'Published';
type ContentType = 'Condition guide' | 'Specialist guide' | 'Action plan' | 'Resource' | 'Safety message' | 'Emergency guide' | 'Transition guide' | 'Support resource';

type ContentItem = {
  id: number;
  title: string;
  type: ContentType;
  area: string;
  status: Status;
  summary: string;
  body: string;
  safetyNote: string;
  updated: string;
};

const seedItems: ContentItem[] = [
  {
    id: 1,
    title: 'COPD Caregiver Guide',
    type: 'Condition guide',
    area: 'Pulmonology',
    status: 'Published',
    summary: 'Caregiver education for COPD, daily management, monitoring, and appointment preparation.',
    body: 'Current source-backed sections include overview, symptoms and triggers, daily management, action plan, monitoring, questions to ask, and resources.',
    safetyNote: 'Educational support only. Follow the individualized care plan and prescribed oxygen or medication instructions.',
    updated: 'Today',
  },
  {
    id: 2,
    title: 'COPD Green / Yellow / Red Action Plan',
    type: 'Action plan',
    area: 'Pulmonology',
    status: 'Approved',
    summary: 'Three-zone caregiver action-plan structure based on EnVizion Life COPD materials.',
    body: 'Green: usual baseline. Yellow: worse than usual symptoms. Red: severe symptoms requiring emergency action.',
    safetyNote: 'Do not independently change medication, rescue treatment, inhaler, or oxygen instructions.',
    updated: 'Today',
  },
  {
    id: 3,
    title: 'B.E. F.A.S.T. Stroke Guide',
    type: 'Emergency guide',
    area: 'Neurology',
    status: 'Published',
    summary: 'Stroke and TIA warning-sign reference for caregivers.',
    body: 'Balance, Eyes, Face, Arm, Speech, Time. Sudden stroke-like symptoms require emergency assessment even if they improve.',
    safetyNote: 'Emergency content must remain prominent, concise, and clinically approved.',
    updated: 'Today',
  },
  {
    id: 4,
    title: 'Walking Through the Transition',
    type: 'Transition guide',
    area: 'Care navigation',
    status: 'Draft',
    summary: 'Hospital-to-home caregiver transition support.',
    body: 'Working checklist covers discharge instructions, medication reconciliation, follow-up appointments, warning signs, care-team contacts, and questions.',
    safetyNote: 'Final client insert wording has not yet been supplied and should stay in draft until approved.',
    updated: 'Today',
  },
  {
    id: 5,
    title: 'Faith & Caregiver Wellbeing',
    type: 'Support resource',
    area: 'Advocacy',
    status: 'In review',
    summary: 'Faith-based and spiritual-wellness support area for caregivers.',
    body: 'Program direction is confirmed, but detailed coaching copy remains pending client-approved source material.',
    safetyNote: 'Do not invent spiritual, legal, insurance, or clinical guidance that has not been supplied and approved.',
    updated: 'Today',
  },
];

const nav = ['Dashboard', 'Conditions', 'Specialist Guides', 'Action Plans', 'Resources', 'Safety Messages'];
const typeOptions: ContentType[] = ['Condition guide', 'Specialist guide', 'Action plan', 'Resource', 'Safety message', 'Emergency guide', 'Transition guide', 'Support resource'];

function blankItem(id: number): ContentItem {
  return {
    id,
    title: '',
    type: 'Condition guide',
    area: '',
    status: 'Draft',
    summary: '',
    body: '',
    safetyNote: '',
    updated: 'Now',
  };
}

export default function AdminDashboard() {
  const auth = useAdminAuth();
  const role = auth.status === 'ready' ? auth.identity.role : 'editor';
  const identity = auth.status === 'ready' ? auth.identity : null;
  const canEdit = role === 'admin' || role === 'editor';
  const canReview = role === 'admin' || role === 'reviewer';
  const canPublish = role === 'admin';

  const [active, setActive] = useState('Dashboard');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ContentItem[]>(seedItems);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ContentItem | null>(null);
  const [savedMessage, setSavedMessage] = useState('');

  const filtered = useMemo(() => {
    const sectionFiltered = items.filter((item) => {
      if (active === 'Conditions') return item.type === 'Condition guide';
      if (active === 'Specialist Guides') return item.type === 'Specialist guide';
      if (active === 'Action Plans') return item.type === 'Action plan';
      if (active === 'Resources') return ['Resource', 'Emergency guide', 'Transition guide', 'Support resource'].includes(item.type);
      if (active === 'Safety Messages') return item.type === 'Safety message' || Boolean(item.safetyNote);
      return true;
    });

    return sectionFiltered.filter((item) => `${item.title} ${item.type} ${item.area}`.toLowerCase().includes(query.toLowerCase()));
  }, [active, items, query]);

  const published = items.filter((item) => item.status === 'Published').length;
  const review = items.filter((item) => item.status === 'In review').length;
  const draftCount = items.filter((item) => item.status === 'Draft').length;

  const openItem = (item: ContentItem) => {
    setSelectedId(item.id);
    setDraft({ ...item });
    setSavedMessage('');
  };

  const startNew = () => {
    if (!canEdit) {
      setSavedMessage('Your role can review content but cannot create a new draft.');
      return;
    }

    const nextId = Math.max(0, ...items.map((item) => item.id)) + 1;
    setSelectedId(null);
    setDraft(blankItem(nextId));
    setSavedMessage('');
  };

  const save = (nextStatus?: Status) => {
    if (!draft || !draft.title.trim()) return;

    if (!nextStatus && !canEdit) {
      setSavedMessage('Only Admins and Editors can save draft changes.');
      return;
    }

    if (nextStatus === 'In review' && !(canEdit || canReview)) {
      setSavedMessage('Your role cannot send content to review.');
      return;
    }

    if (nextStatus === 'Approved' && !canReview) {
      setSavedMessage('Only Admins and Reviewers can approve content.');
      return;
    }

    if (nextStatus === 'Published' && !canPublish) {
      setSavedMessage('Only an Admin can publish content to the toolkit.');
      return;
    }

    const next: ContentItem = { ...draft, status: nextStatus ?? draft.status, updated: 'Now' };
    setItems((current) => {
      const exists = current.some((item) => item.id === next.id);
      return exists ? current.map((item) => (item.id === next.id ? next : item)) : [next, ...current];
    });
    setSelectedId(next.id);
    setDraft(next);
    setSavedMessage(nextStatus ? `Saved as ${nextStatus}.` : 'Draft saved.');
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">EV</div>
          <div>
            <strong>EnVizion Life</strong>
            <span>Content Portal</span>
          </div>
        </div>

        <nav className="nav">
          {nav.map((label) => (
            <button key={label} className={active === label ? 'navButton active' : 'navButton'} onClick={() => setActive(label)}>
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebarNote">
          <span className="dot" />
          Clinical wording stays in review until approved.
        </div>

        {identity && (
          <div className="sidebarNote">
            <span className="dot" />
            <div>
              <strong style={{ display: 'block', color: '#FFFFFF', textTransform: 'capitalize' }}>{role}</strong>
              <span>{identity.displayName}</span>
            </div>
          </div>
        )}
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CONTENT MANAGEMENT</p>
            <h1>{active}</h1>
            <p className="subtitle">Create, review, approve, publish, and maintain caregiver education.</p>
          </div>
          <button className="primaryButton" onClick={startNew} disabled={!canEdit} style={{ opacity: canEdit ? 1 : 0.55, cursor: canEdit ? 'pointer' : 'not-allowed' }}>+ New content</button>
        </header>

        <section className="statsGrid">
          <article className="statCard blue"><span>Published</span><strong>{published}</strong><small>Live in the toolkit</small></article>
          <article className="statCard purple"><span>In review</span><strong>{review}</strong><small>Waiting for approval</small></article>
          <article className="statCard orange"><span>Drafts</span><strong>{draftCount}</strong><small>Work in progress</small></article>
          <article className="statCard neutral"><span>Role</span><strong style={{ textTransform: 'capitalize' }}>{role}</strong><small>{canPublish ? 'Full publishing access' : canReview ? 'Review and approval access' : 'Draft and review submission access'}</small></article>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: draft ? 'minmax(0, 1.15fr) minmax(360px, .85fr)' : '1fr', gap: 20, alignItems: 'start' }}>
          <section className="panel">
            <div className="panelHeader">
              <div>
                <h2>Content library</h2>
                <p>Current working content from the EnVizion caregiver toolkit.</p>
              </div>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search content" />
            </div>

            <div className="tableWrap">
              <table>
                <thead><tr><th>Title</th><th>Type</th><th>Care area</th><th>Status</th><th>Updated</th></tr></thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.id} onClick={() => openItem(item)} style={{ cursor: 'pointer', background: selectedId === item.id ? 'rgba(78, 58, 166, .05)' : undefined }}>
                      <td><strong>{item.title}</strong></td>
                      <td>{item.type}</td>
                      <td>{item.area}</td>
                      <td><span className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></td>
                      <td>{item.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {draft && (
            <aside className="panel" style={{ position: 'sticky', top: 24 }}>
              <div className="panelHeader">
                <div>
                  <p className="eyebrow">EDITOR</p>
                  <h2>{selectedId ? 'Edit content' : 'New content'}</h2>
                  <p>Keep clinical wording source-backed and move it through review before publishing.</p>
                </div>
                <button onClick={() => { setDraft(null); setSelectedId(null); setSavedMessage(''); }} style={{ border: 0, background: 'transparent', fontSize: 22, cursor: 'pointer' }}>×</button>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                <label style={labelStyle}>Title<input disabled={!canEdit} style={{ ...fieldStyle, opacity: canEdit ? 1 : 0.7 }} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Content title" /></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <label style={labelStyle}>Type<select disabled={!canEdit} style={{ ...fieldStyle, opacity: canEdit ? 1 : 0.7 }} value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as ContentType })}>{typeOptions.map((type) => <option key={type}>{type}</option>)}</select></label>
                  <label style={labelStyle}>Care area<input disabled={!canEdit} style={{ ...fieldStyle, opacity: canEdit ? 1 : 0.7 }} value={draft.area} onChange={(event) => setDraft({ ...draft, area: event.target.value })} placeholder="e.g. Neurology" /></label>
                </div>
                <label style={labelStyle}>Summary<textarea disabled={!canEdit} style={{ ...fieldStyle, minHeight: 84, resize: 'vertical', opacity: canEdit ? 1 : 0.7 }} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} placeholder="Short caregiver-facing summary" /></label>
                <label style={labelStyle}>Content<textarea disabled={!canEdit} style={{ ...fieldStyle, minHeight: 150, resize: 'vertical', opacity: canEdit ? 1 : 0.7 }} value={draft.body} onChange={(event) => setDraft({ ...draft, body: event.target.value })} placeholder="Approved educational content" /></label>
                <label style={labelStyle}>Safety message<textarea disabled={!canEdit} style={{ ...fieldStyle, minHeight: 92, resize: 'vertical', opacity: canEdit ? 1 : 0.7 }} value={draft.safetyNote} onChange={(event) => setDraft({ ...draft, safetyNote: event.target.value })} placeholder="Education-only, emergency, or treatment boundary" /></label>

                <div style={{ padding: 14, borderRadius: 14, background: '#F6F2FF', border: '1px solid #E4DDF8' }}>
                  <strong style={{ display: 'block', color: '#49358C' }}>Current status: {draft.status}</strong>
                  <span style={{ display: 'block', marginTop: 5, color: '#667085', fontSize: 13 }}>Draft → In review → Approved → Published</span>
                </div>

                {savedMessage && <div style={{ padding: 12, borderRadius: 12, background: '#EEF7F3', color: '#216E54', fontWeight: 700 }}>{savedMessage}</div>}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button className="primaryButton" disabled={!canEdit} onClick={() => save()} style={{ opacity: canEdit ? 1 : 0.5, cursor: canEdit ? 'pointer' : 'not-allowed' }}>Save draft</button>
                  <button disabled={!(canEdit || canReview)} style={{ ...secondaryButtonStyle, opacity: canEdit || canReview ? 1 : 0.5, cursor: canEdit || canReview ? 'pointer' : 'not-allowed' }} onClick={() => save('In review')}>Send to review</button>
                  <button disabled={!canReview} style={{ ...secondaryButtonStyle, opacity: canReview ? 1 : 0.5, cursor: canReview ? 'pointer' : 'not-allowed' }} onClick={() => save('Approved')}>Approve</button>
                  <button disabled={!canPublish} style={{ ...secondaryButtonStyle, borderColor: '#C95B3F', color: '#A33E28', opacity: canPublish ? 1 : 0.5, cursor: canPublish ? 'pointer' : 'not-allowed' }} onClick={() => save('Published')}>Publish</button>
                </div>
              </div>
            </aside>
          )}
        </section>

        <section className="workflow">
          <div><span>1</span><strong>Draft</strong><small>Editor creates or updates content</small></div>
          <div><span>2</span><strong>Review</strong><small>Reviewer checks wording and source</small></div>
          <div><span>3</span><strong>Approve</strong><small>Reviewer or Admin signs off</small></div>
          <div><span>4</span><strong>Publish</strong><small>Admin releases to the toolkit</small></div>
        </section>
      </section>
    </main>
  );
}

const labelStyle = {
  display: 'grid',
  gap: 7,
  color: '#25324A',
  fontWeight: 800,
  fontSize: 13,
} as const;

const fieldStyle = {
  width: '100%',
  border: '1px solid #D7DFEA',
  borderRadius: 12,
  background: '#FFFFFF',
  color: '#172033',
  padding: '11px 12px',
  font: 'inherit',
  outline: 'none',
} as const;

const secondaryButtonStyle = {
  border: '1px solid #C9D5E5',
  borderRadius: 12,
  background: '#FFFFFF',
  color: '#233B70',
  padding: '11px 14px',
  fontWeight: 800,
  cursor: 'pointer',
} as const;
