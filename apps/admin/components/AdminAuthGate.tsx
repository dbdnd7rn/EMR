'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

import { getBrowserSupabaseClient } from '../lib/supabase-browser';

export type AdminRole = 'admin' | 'editor' | 'reviewer';

type AdminIdentity = {
  user: User;
  role: AdminRole;
  displayName: string;
};

type AuthState =
  | { status: 'loading'; identity: null }
  | { status: 'ready'; identity: AdminIdentity }
  | { status: 'missing-config'; identity: null }
  | { status: 'unauthorized'; identity: null };

const AdminAuthContext = createContext<AuthState>({ status: 'loading', identity: null });

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ status: 'loading', identity: null });

  const publicRoute = pathname === '/login';

  useEffect(() => {
    if (publicRoute) {
      setState({ status: 'loading', identity: null });
      return;
    }

    const supabase = getBrowserSupabaseClient();
    if (!supabase) {
      setState({ status: 'missing-config', identity: null });
      return;
    }

    let active = true;

    async function loadIdentity() {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData.user;

      if (!active) return;

      if (userError || !user) {
        router.replace('/login');
        return;
      }

      const { data: adminUser, error: roleError } = await supabase
        .from('admin_users')
        .select('display_name, role, active')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (!active) return;

      if (roleError || !adminUser) {
        await supabase.auth.signOut();
        setState({ status: 'unauthorized', identity: null });
        return;
      }

      setState({
        status: 'ready',
        identity: {
          user,
          role: adminUser.role as AdminRole,
          displayName: adminUser.display_name || user.email || 'EnVizion user',
        },
      });
    }

    loadIdentity();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.replace('/login');
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') loadIdentity();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [publicRoute, router]);

  const value = useMemo(() => state, [state]);

  if (publicRoute) return <>{children}</>;

  if (state.status === 'loading') {
    return (
      <main style={screenStyle}>
        <div style={cardStyle}>
          <div style={brandMarkStyle}>EV</div>
          <h1 style={titleStyle}>Loading EnVizion Life</h1>
          <p style={bodyStyle}>Checking your secure admin session…</p>
        </div>
      </main>
    );
  }

  if (state.status === 'missing-config') {
    return (
      <main style={screenStyle}>
        <div style={cardStyle}>
          <div style={brandMarkStyle}>EV</div>
          <h1 style={titleStyle}>Admin setup required</h1>
          <p style={bodyStyle}>Supabase public environment variables are not configured for this deployment yet.</p>
        </div>
      </main>
    );
  }

  if (state.status === 'unauthorized') {
    return (
      <main style={screenStyle}>
        <div style={cardStyle}>
          <div style={brandMarkStyle}>EV</div>
          <h1 style={titleStyle}>Access not authorized</h1>
          <p style={bodyStyle}>This account is not active in the EnVizion Life admin directory.</p>
          <button style={buttonStyle} onClick={() => router.replace('/login')}>Return to sign in</button>
        </div>
      </main>
    );
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

const screenStyle = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: 24,
  background: 'linear-gradient(140deg, #F5F7FD, #F7F2FC)',
} as const;

const cardStyle = {
  width: 'min(460px, 100%)',
  border: '1px solid #DDE4EF',
  borderRadius: 24,
  padding: 32,
  background: '#FFFFFF',
  boxShadow: '0 24px 70px rgba(35, 59, 112, .12)',
  textAlign: 'center',
} as const;

const brandMarkStyle = {
  width: 52,
  height: 52,
  borderRadius: 16,
  margin: '0 auto 18px',
  display: 'grid',
  placeItems: 'center',
  background: 'linear-gradient(135deg, #233B70, #6B4EB0)',
  color: '#FFFFFF',
  fontWeight: 900,
} as const;

const titleStyle = { margin: 0, color: '#172033', fontSize: 28 } as const;
const bodyStyle = { color: '#667085', lineHeight: 1.6, margin: '10px 0 0' } as const;
const buttonStyle = {
  marginTop: 18,
  border: 0,
  borderRadius: 12,
  padding: '12px 16px',
  background: '#233B70',
  color: '#FFFFFF',
  fontWeight: 800,
  cursor: 'pointer',
} as const;
