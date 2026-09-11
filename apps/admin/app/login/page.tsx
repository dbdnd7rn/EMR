'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getBrowserSupabaseClient } from '../../lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const supabase = getBrowserSupabaseClient();

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/');
    });
  }, [router, supabase]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!supabase) {
      setMessage('Supabase environment variables are not configured yet.');
      return;
    }

    if (!email.trim() || !password) {
      setMessage('Enter your email and password.');
      return;
    }

    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);

    if (error) {
      setMessage('Sign-in was not successful. Check your credentials and try again.');
      return;
    }

    router.replace('/');
    router.refresh();
  }

  return (
    <main style={screenStyle}>
      <section style={panelStyle}>
        <div style={brandStyle}>
          <div style={brandMarkStyle}>EV</div>
          <div>
            <strong style={brandNameStyle}>EnVizion Life</strong>
            <span style={brandSubStyle}>Content Management Portal</span>
          </div>
        </div>

        <div style={heroStyle}>
          <p style={eyebrowStyle}>SECURE ADMIN ACCESS</p>
          <h1 style={titleStyle}>Welcome back</h1>
          <p style={bodyStyle}>Sign in to review and manage approved caregiver education for the Digital Caregiver Toolkit.</p>
        </div>

        <form onSubmit={signIn} style={formStyle}>
          <label style={labelStyle}>
            Email
            <input
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@envizionlife.net"
              style={fieldStyle}
            />
          </label>

          <label style={labelStyle}>
            Password
            <input
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              style={fieldStyle}
            />
          </label>

          {message && <div style={messageStyle}>{message}</div>}

          <button disabled={busy} type="submit" style={{ ...buttonStyle, opacity: busy ? 0.65 : 1 }}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={securityStyle}>
          <span style={securityDotStyle} />
          <span>Access is limited to active EnVizion Life Admin, Editor, and Reviewer accounts.</span>
        </div>
      </section>

      <aside style={visualStyle}>
        <div style={orbBlueStyle} />
        <div style={orbPurpleStyle} />
        <div style={visualContentStyle}>
          <p style={visualEyebrowStyle}>TRUSTED CONTENT WORKFLOW</p>
          <h2 style={visualTitleStyle}>Draft. Review. Approve. Publish.</h2>
          <p style={visualBodyStyle}>Clinical and caregiver-facing content stays governed, traceable, and intentional before it reaches the toolkit.</p>
          <div style={stepsStyle}>
            {['Draft', 'Review', 'Approve', 'Publish'].map((step, index) => (
              <div key={step} style={stepStyle}>
                <span style={stepNumberStyle}>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

const screenStyle = {
  minHeight: '100vh',
  display: 'grid',
  gridTemplateColumns: 'minmax(360px, 520px) minmax(0, 1fr)',
  background: '#F7F8FC',
} as const;

const panelStyle = {
  minHeight: '100vh',
  padding: '44px clamp(28px, 5vw, 68px)',
  background: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 28,
} as const;

const brandStyle = { display: 'flex', alignItems: 'center', gap: 12 } as const;
const brandMarkStyle = { width: 48, height: 48, borderRadius: 15, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #233B70, #6B4EB0)', color: '#FFFFFF', fontWeight: 900 } as const;
const brandNameStyle = { display: 'block', color: '#172033', fontSize: 18 } as const;
const brandSubStyle = { display: 'block', color: '#667085', fontSize: 12, marginTop: 2 } as const;
const heroStyle = { marginTop: 12 } as const;
const eyebrowStyle = { margin: 0, color: '#6B4EB0', fontSize: 12, fontWeight: 900, letterSpacing: 1.2 } as const;
const titleStyle = { margin: '8px 0 0', color: '#172033', fontSize: 42, lineHeight: 1.05 } as const;
const bodyStyle = { color: '#667085', lineHeight: 1.65, margin: '14px 0 0', maxWidth: 430 } as const;
const formStyle = { display: 'grid', gap: 16 } as const;
const labelStyle = { display: 'grid', gap: 8, color: '#25324A', fontWeight: 800, fontSize: 13 } as const;
const fieldStyle = { width: '100%', border: '1px solid #D7DFEA', borderRadius: 13, background: '#FFFFFF', color: '#172033', padding: '13px 14px', font: 'inherit', outline: 'none' } as const;
const messageStyle = { padding: 12, borderRadius: 12, background: '#FFF3EF', color: '#A33E28', fontSize: 13, lineHeight: 1.5 } as const;
const buttonStyle = { border: 0, borderRadius: 13, padding: '13px 16px', background: 'linear-gradient(135deg, #233B70, #6B4EB0)', color: '#FFFFFF', fontWeight: 900, fontSize: 15, cursor: 'pointer' } as const;
const securityStyle = { display: 'flex', alignItems: 'flex-start', gap: 9, color: '#667085', fontSize: 12, lineHeight: 1.55 } as const;
const securityDotStyle = { width: 8, height: 8, borderRadius: 999, background: '#D66B36', marginTop: 5, flex: '0 0 auto' } as const;
const visualStyle = { position: 'relative', overflow: 'hidden', minHeight: '100vh', background: 'linear-gradient(145deg, #233B70 0%, #49358C 52%, #6B4EB0 100%)', display: 'grid', placeItems: 'center', padding: 48 } as const;
const orbBlueStyle = { position: 'absolute', width: 430, height: 430, borderRadius: 999, top: -130, right: -80, background: 'rgba(255,255,255,.08)' } as const;
const orbPurpleStyle = { position: 'absolute', width: 300, height: 300, borderRadius: 999, bottom: -100, left: -90, background: 'rgba(214,107,54,.18)' } as const;
const visualContentStyle = { position: 'relative', zIndex: 1, width: 'min(650px, 100%)', color: '#FFFFFF' } as const;
const visualEyebrowStyle = { margin: 0, color: '#FFD9C7', fontSize: 12, fontWeight: 900, letterSpacing: 1.3 } as const;
const visualTitleStyle = { margin: '10px 0 0', fontSize: 'clamp(38px, 5vw, 64px)', lineHeight: 1.04, maxWidth: 620 } as const;
const visualBodyStyle = { color: 'rgba(255,255,255,.82)', fontSize: 17, lineHeight: 1.65, maxWidth: 600, marginTop: 18 } as const;
const stepsStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, marginTop: 34 } as const;
const stepStyle = { border: '1px solid rgba(255,255,255,.20)', borderRadius: 16, padding: 14, background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(8px)' } as const;
const stepNumberStyle = { display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 9, background: 'rgba(255,255,255,.15)', marginBottom: 12, fontSize: 12 } as const;
