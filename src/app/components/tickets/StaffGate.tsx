import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/tickets';
import { ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TextField, TicketShell, primaryButton, secondaryButton } from './ticketUi';

type GateState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'not-staff'; email: string }
  | { status: 'ready'; session: Session };

type StaffGateProps = {
  title: string;
  children: (session: Session) => ReactNode;
};

/** Renders children only for signed-in users listed in the staff table. */
export function StaffGate({ title, children }: StaffGateProps) {
  const [state, setState] = useState<GateState>({ status: 'loading' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    document.title = `${title} | Effie Paraguay`;

    const resolve = async (session: Session | null) => {
      if (!session) {
        setState({ status: 'signed-out' });
        return;
      }
      const { data: isStaff } = await supabase.rpc('is_staff');
      setState(isStaff ? { status: 'ready', session } : { status: 'not-staff', email: session.user.email ?? '' });
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session);
    });
    return () => listener.subscription.unsubscribe();
  }, [title]);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setIsBusy(false);
    if (authError) setError('Correo o contraseña incorrectos.');
  };

  if (state.status === 'ready') return <>{children(state.session)}</>;

  return (
    <TicketShell>
      <div className="max-w-sm mx-auto rounded-2xl border p-6 md:p-8" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
        <h1 className="text-2xl mb-2" style={{ color: '#FFFFFF', fontWeight: 450 }}>{title}</h1>

        {state.status === 'loading' && <p aria-busy="true" style={{ color: TEXT_MUTED }}>Verificando sesión…</p>}

        {state.status === 'not-staff' && (
          <>
            <p className="text-sm mb-6" style={{ color: TEXT_MUTED }}>
              {state.email} no tiene acceso. Pedile al administrador que lo agregue al equipo.
            </p>
            <button type="button" onClick={() => supabase.auth.signOut()} className={secondaryButton} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
              Cerrar sesión
            </button>
          </>
        )}

        {state.status === 'signed-out' && (
          <form onSubmit={signIn} noValidate className="space-y-4">
            <p className="text-sm" style={{ color: TEXT_MUTED }}>Acceso solo para el equipo de Effie.</p>
            <TextField label="Correo" name="email" type="email" autoComplete="username" value={email} onChange={setEmail} />
            <TextField label="Contraseña" name="password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
            {error && <p role="alert" className="text-sm" style={{ color: ERROR_TEXT }}>{error}</p>}
            <button type="submit" disabled={isBusy} aria-busy={isBusy} className={`w-full ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
              {isBusy ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>
        )}
      </div>
    </TicketShell>
  );
}
