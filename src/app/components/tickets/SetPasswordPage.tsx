import { useEffect, useState, type FormEvent } from 'react';
import { errorMessage, supabase } from '../../lib/tickets';
import { ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TextField, TicketShell, primaryButton } from './ticketUi';

type State = 'checking' | 'ready' | 'no-link' | 'done';

const MIN_LENGTH = 8;

export function SetPasswordPage() {
  const [state, setState] = useState<State>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    document.title = 'Elegir contraseña | Effie Paraguay';
    supabase.auth.getSession().then(({ data }) => {
      setState(data.session ? 'ready' : 'no-link');
    });
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < MIN_LENGTH) {
      setError(`La contraseña tiene que tener al menos ${MIN_LENGTH} caracteres.`);
      return;
    }
    if (password !== confirm) {
      setError('Las dos contraseñas no coinciden.');
      return;
    }
    setError('');
    setIsBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsBusy(false);
    if (updateError) {
      setError(errorMessage(updateError));
      return;
    }
    setState('done');
    window.setTimeout(() => window.location.assign('/entradas/panel'), 1500);
  };

  return (
    <TicketShell>
      <div className="max-w-sm mx-auto rounded-2xl border p-6 md:p-8" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
        <h1 className="text-2xl mb-2" style={{ color: '#FFFFFF', fontWeight: 450 }}>Elegí tu contraseña</h1>

        {state === 'checking' && <p aria-busy="true" style={{ color: TEXT_MUTED }}>Verificando link…</p>}

        {state === 'no-link' && (
          <p role="alert" className="text-sm" style={{ color: ERROR_TEXT }}>
            Este link venció o no es válido. Pedile a un administrador que te mande uno nuevo, o intentá
            "Olvidé mi contraseña" desde la pantalla de acceso.
          </p>
        )}

        {state === 'done' && (
          <p role="status" className="text-sm" style={{ color: GOLD }}>
            Listo, ya podés entrar con tu contraseña. Te llevamos al panel…
          </p>
        )}

        {state === 'ready' && (
          <form onSubmit={submit} noValidate className="space-y-4">
            <TextField label="Contraseña nueva" name="password" type="password" autoComplete="new-password" value={password} onChange={setPassword} />
            <TextField label="Repetí la contraseña" name="confirm" type="password" autoComplete="new-password" value={confirm} onChange={setConfirm} />
            {error && <p role="alert" className="text-sm" style={{ color: ERROR_TEXT }}>{error}</p>}
            <button type="submit" disabled={isBusy} aria-busy={isBusy} className={`w-full ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
              {isBusy ? 'Guardando…' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </TicketShell>
  );
}
