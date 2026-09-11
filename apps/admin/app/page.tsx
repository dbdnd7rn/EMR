'use client';

import { useMemo, useState } from 'react';

type Status = 'Draft' | 'In review' | 'Approved' | 'Published';

type ContentItem = {
  id: number;
  title: string;
  type: string;
  area: string;
  status: Status;
  updated: string;
};

const items: ContentItem[] = [
  { id: 1, title: 'COPD Caregiver Guide', type: 'Condition guide', area: 'Pulmonology', status: 'Published', updated: 'Today' },
  { id: 2, title: 'COPD Green / Yellow / Red Action Plan', type: 'Action plan', area: 'Pulmonology', status: 'Approved', updated: 'Today' },
  { id: 3, title: 'B.E. F.A.S.T. Stroke Guide', type: 'Emergency guide', area: 'Neurology', status: 'Published', updated: 'Today' },
  { id: 4, title: 'Walking Through the Transition', type: 'Transition guide', area: 'Care navigation', status: 'Draft', updated: 'Today' },
  { id: 5, title: 'Faith & Caregiver Wellbeing', type: 'Support resource', area: 'Advocacy', status: 'In review', updated: 'Today' },
];

const nav = ['Dashboard', 'Conditions', 'Specialist Guides', 'Action Plans', 'Resources', 'Safety Messages'];

export default function AdminDashboard() {
  const [active, setActive] = useState('Dashboard');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => items.filter((item) => `${item.title} ${item.type} ${item.area}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const published = items.filter((item) => item.status === 'Published').length;
  const review = items.filter((item) => item.status === 'In review').length;
  const draft = items.filter((item) => item.status === 'Draft').length;

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
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CONTENT MANAGEMENT</p>
            <h1>{active}</h1>
            <p className="subtitle">Review, approve, publish, and maintain caregiver education.</p>
          </div>
          <button className="primaryButton">+ New content</button>
        </header>

        <section className="statsGrid">
          <article className="statCard blue"><span>Published</span><strong>{published}</strong><small>Live in the toolkit</small></article>
          <article className="statCard purple"><span>In review</span><strong>{review}</strong><small>Waiting for approval</small></article>
          <article className="statCard orange"><span>Drafts</span><strong>{draft}</strong><small>Work in progress</small></article>
          <article className="statCard neutral"><span>Safety</span><strong>Active</strong><small>Education-only boundaries</small></article>
        </section>

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
                  <tr key={item.id}>
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

        <section className="workflow">
          <div><span>1</span><strong>Draft</strong><small>Create or update content</small></div>
          <div><span>2</span><strong>Review</strong><small>Clinical/content review</small></div>
          <div><span>3</span><strong>Approve</strong><small>Authorized sign-off</small></div>
          <div><span>4</span><strong>Publish</strong><small>Release to the toolkit</small></div>
        </section>
      </section>
    </main>
  );
}
