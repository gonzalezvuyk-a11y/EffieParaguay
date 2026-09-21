import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/tickets';
import { ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TEXT_SUBTLE, TextField, TicketShell, primaryButton, secondaryButton } from './ticketUi';

export type StaffRole = 'admin' | 'door';

type GateState =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'no-access'; email: string }
  | { status: 'wrong-role'; role: StaffRole }
  | { status: 'ready'; session: Session; role: StaffRole };

type StaffGateProps = {
  title: string;
  /** Omit to allow any signed-in staff member (admin or door). */
  requireRole?: StaffRole;
  redirectHint?: string;
  children: (context: { session: Session; role: StaffRole }) => ReactNode;
};

const fetchRole = async (): Promise<StaffRole | null> => {
  const { data } = await supabase.rpc('my_staff_role');
  const role = Array.isArray(data) ? data[0]?.role : undefined;
  return role === 'admin' || role === 'door' ? role : null;
};

/** Renders children only for signed-in staff, optionally restricted to one role. */
export function StaffGate({ title, requireRole, redirectHint, children }: StaffGateProps) {
  const [state, setState] = useState<GateState>({ status: 'loading' });
  const [showLinkFallback, setShowLinkFallback] = useState(false);

  useEffect(() => {
    document.title = `${title} | Effie Paraguay`;

    const resolve = async (session: Session | null) => {
      if (!session) {
        setState({ status: 'signed-out' });
        return;
      }
      const role = await fetchRole();
      if (!role) {
        setState({ status: 'no-access', email: session.user.email ?? '' });
        return;
      }
      if (requireRole && role !== requireRole) {
        setState({ status: 'wrong-role', role });
        return;
      }
      setState({ status: 'ready', session, role });
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session);
    });
    return () => listener.subscription.unsubscribe();
  }, [title, requireRole]);

  if (state.status === 'ready') return <>{children({ session: state.session, role: state.role })}</>;

  return (
    <TicketShell>
      <div className="max-w-sm mx-auto rounded-2xl border p-6 md:p-8" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
        <h1 className="text-2xl mb-2" style={{ color: '#FFFFFF', fontWeight: 450 }}>{title}</h1>

        {state.status === 'loading' && <p aria-busy="true" style={{ color: TEXT_MUTED }}>Verificando sesión…</p>}

        {state.status === 'no-access' && (
          <>
            <p className="text-sm mb-6" style={{ color: TEXT_MUTED }}>
              {state.email} no tiene acceso. Pedile a un administrador que te agregue desde el panel.
            </p>
            <button type="button" onClick={() => supabase.auth.signOut()} className={secondaryButton} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
              Cerrar sesión
            </button>
          </>
        )}

        {state.status === 'wrong-role' && (
          <>
            <p className="text-sm mb-6" style={{ color: TEXT_MUTED }}>
              Tu cuenta es de {state.role === 'admin' ? 'administrador' : 'puerta'}, sin acceso acá.
              {redirectHint && <> {redirectHint}</>}
            </p>
            <button type="button" onClick={() => supabase.auth.signOut()} className={secondaryButton} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
              Cerrar sesión
            </button>
          </>
        )}

        {state.status === 'signed-out' && (
          showLinkFallback ? (
            <MagicLinkForm onBack={() => setShowLinkFallback(false)} />
          ) : (
            <PasswordForm onUseLink={() => setShowLinkFallback(true)} />
          )
        )}
      </div>
    </TicketShell>
  );
}

function PasswordForm({ onUseLink }: { onUseLink: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    setIsBusy(false);
    if (authError) setError('Correo o contraseña incorrectos.');
  };

  const forgotPassword = async () => {
    if (!email.trim()) {
      setError('Escribí tu correo arriba primero.');
      return;
    }
    setError('');
    setNotice('');
    setIsBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/entradas/set-password`,
    });
    setIsBusy(false);
    if (resetError) {
      setError('No pudimos enviar el link. Probá de nuevo en un minuto.');
      return;
    }
    setNotice(`Te enviamos un link a ${email.trim()} para elegir una contraseña nueva.`);
  };

  return (
    <form onSubmit={signIn} noValidate className="space-y-4">
      <TextField label="Correo" name="email" type="email" autoComplete="username" value={email} onChange={setEmail} />
      <TextField label="Contraseña" name="password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
      {error && <p role="alert" className="text-sm" style={{ color: ERROR_TEXT }}>{error}</p>}
      {notice && !error && <p role="status" className="text-sm" style={{ color: GOLD }}>{notice}</p>}
      <button type="submit" disabled={isBusy} aria-busy={isBusy} className={`w-full ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
        {isBusy ? 'Ingresando…' : 'Ingresar'}
      </button>
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={forgotPassword} disabled={isBusy} className="underline underline-offset-4" style={{ color: TEXT_SUBTLE }}>
          Olvidé mi contraseña
        </button>
        <button type="button" onClick={onUseLink} className="underline underline-offset-4" style={{ color: TEXT_SUBTLE }}>
          Entrar con link por correo
        </button>
      </div>
    </form>
  );
}

function MagicLinkForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [codeOrLink, setCodeOrLink] = useState('');

  const sendLink = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsBusy(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.href, shouldCreateUser: false },
    });
    setIsBusy(false);
    if (authError) {
      setError('No pudimos enviar el link. Revisá el correo e intentá de nuevo.');
      return;
    }
    setLinkSent(true);
  };

  const verifyCodeOrLink = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsBusy(true);
    const input = codeOrLink.trim();
    let result;
    if (/^\d{6}$/.test(input)) {
      result = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: input, type: 'email' });
    } else {
      let tokenHash = '';
      try {
        const url = new URL(input);
        tokenHash = url.searchParams.get('token') ?? url.searchParams.get('token_hash') ?? '';
      } catch {
        tokenHash = '';
      }
      result = tokenHash
        ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' })
        : { error: new Error('invalid') };
    }
    setIsBusy(false);
    if (result.error) setError('Ese código o link no sirvió. Puede haber vencido: pedí uno nuevo.');
  };

  if (!linkSent) {
    return (
      <form onSubmit={sendLink} noValidate className="space-y-4">
        <p className="text-sm" style={{ color: TEXT_MUTED }}>
          Solo para cuentas que ya tienen acceso.
        </p>
        <TextField label="Correo" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
        {error && <p role="alert" className="text-sm" style={{ color: ERROR_TEXT }}>{error}</p>}
        <button type="submit" disabled={isBusy || !email.trim()} aria-busy={isBusy} className={`w-full ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
          {isBusy ? 'Enviando link…' : 'Enviarme el link'}
        </button>
        <button type="button" onClick={onBack} className={`w-full ${secondaryButton}`} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
          Volver a usuario y contraseña
        </button>
      </form>
    );
  }

  return (
    <div>
      <p role="status" className="text-sm mb-5" style={{ color: TEXT_MUTED }}>
        Te enviamos un link a <span style={{ color: '#FFFFFF' }}>{email.trim().toLowerCase()}</span>.
        Abrilo desde este dispositivo y entrás directo.
      </p>
      <form onSubmit={verifyCodeOrLink} noValidate className="space-y-4">
        <TextField
          label="¿No te llevó de vuelta acá?"
          name="codigo"
          value={codeOrLink}
          onChange={setCodeOrLink}
          autoComplete="one-time-code"
          hint="Pegá el link del correo, o el código de 6 dígitos si te llegó así."
        />
        {error && <p role="alert" className="text-sm" style={{ color: ERROR_TEXT }}>{error}</p>}
        <button type="submit" disabled={isBusy || !codeOrLink.trim()} aria-busy={isBusy} className={`w-full ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
          {isBusy ? 'Verificando…' : 'Entrar con el código o link'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => { setLinkSent(false); setError(''); setCodeOrLink(''); }}
        className={`mt-4 ${secondaryButton}`}
        style={{ borderColor: '#333333', color: TEXT_MUTED }}
      >
        Usar otro correo
      </button>
    </div>
  );
}
