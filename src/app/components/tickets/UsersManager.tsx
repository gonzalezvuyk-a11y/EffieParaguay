import { useCallback, useEffect, useId, useState, type FormEvent } from 'react';
import { Trash2 } from 'lucide-react';
import { errorMessage, supabase } from '../../lib/tickets';
import { ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TEXT_SUBTLE, TextField, focusRing, primaryButton, secondaryButton } from './ticketUi';

type StaffMember = { email: string; role: 'admin' | 'door' };

const ROLE_LABEL: Record<StaffMember['role'], string> = { admin: 'Administrador', door: 'Puerta' };

type UsersManagerProps = { currentEmail: string };

/** Admin-only staff roster: invite new users by email/role, remove existing ones. */
export function UsersManager({ currentEmail }: UsersManagerProps) {
  const [staff, setStaff] = useState<StaffMember[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffMember['role']>('admin');
  const roleId = useId();

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('staff').select('email, role').order('email');
    if (error) {
      setLoadError(errorMessage(error));
      return;
    }
    setLoadError('');
    setStaff(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addUser = async (event: FormEvent) => {
    event.preventDefault();
    setBusyKey('add');
    setActionError('');
    setNotice('');
    const { data, error } = await supabase.functions.invoke<{ added?: boolean; email_sent?: boolean; error?: string }>(
      'manage-staff',
      { body: { email: email.trim().toLowerCase(), role } }
    );
    setBusyKey('');
    if (error || !data?.added) {
      setActionError(data?.error ?? errorMessage(error ?? new Error('unknown')));
      return;
    }
    setNotice(
      data.email_sent
        ? `${email.trim()} agregado como ${ROLE_LABEL[role]}. Le enviamos un correo para elegir su contraseña.`
        : `${email.trim()} agregado, pero no pudimos enviarle el correo para elegir contraseña. Pedile que use "Olvidé mi contraseña".`
    );
    setEmail('');
    load();
  };

  const removeUser = async (target: string) => {
    if (!window.confirm(`¿Sacar a ${target} del equipo? Deja de tener acceso, pero su cuenta no se borra.`)) return;
    setBusyKey(`del-${target}`);
    setActionError('');
    setNotice('');
    const { error } = await supabase.from('staff').delete().eq('email', target);
    setBusyKey('');
    if (error) {
      setActionError(errorMessage(error));
      return;
    }
    setNotice(`${target} ya no tiene acceso.`);
    load();
  };

  return (
    <section aria-labelledby="users-title" className="rounded-2xl border overflow-hidden" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
      <h2 id="users-title" className="px-5 py-4 border-b text-lg" style={{ color: GOLD, borderColor: RULE, fontWeight: 450 }}>
        Usuarios del equipo
      </h2>

      <div className="p-5 space-y-5">
        <div aria-live="polite" className="min-h-5 text-sm">
          {actionError && <p role="alert" style={{ color: ERROR_TEXT }}>{actionError}</p>}
          {notice && !actionError && <p style={{ color: GOLD }}>{notice}</p>}
        </div>

        <form onSubmit={addUser} className="grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end">
          <TextField label="Correo" name="nuevo-correo" type="email" autoComplete="off" value={email} onChange={setEmail} placeholder="nombre@effie.com.py" />
          <div>
            <label htmlFor={roleId} className="block text-sm mb-2" style={{ color: TEXT_MUTED }}>Rol</label>
            <select
              id={roleId}
              value={role}
              onChange={(e) => setRole(e.target.value as StaffMember['role'])}
              className={`w-full min-h-11 rounded-lg border px-3 text-base touch-manipulation ${focusRing}`}
              style={{ borderColor: '#333333', color: '#FFFFFF', backgroundColor: '#111111', colorScheme: 'dark' }}
            >
              <option value="admin">Administrador</option>
              <option value="door">Puerta</option>
            </select>
          </div>
          <button type="submit" disabled={busyKey === 'add' || !email.trim()} className={primaryButton} style={{ backgroundColor: GOLD, color: '#000000' }}>
            Agregar
          </button>
        </form>
        <p className="text-xs -mt-3" style={{ color: TEXT_SUBTLE }}>
          Le llega un correo para que elija su propia contraseña. Administrador ve todo este panel; Puerta solo puede ingresar en /entradas/puerta.
        </p>

        {loadError ? (
          <div>
            <p role="alert" className="text-sm mb-2" style={{ color: ERROR_TEXT }}>{loadError}</p>
            <button type="button" onClick={load} className={secondaryButton} style={{ borderColor: '#333333', color: TEXT_MUTED }}>Reintentar</button>
          </div>
        ) : !staff ? (
          <p aria-busy="true" className="text-sm" style={{ color: TEXT_MUTED }}>Cargando…</p>
        ) : (
          <ul className="rounded-xl border divide-y" style={{ borderColor: RULE }}>
            {staff.map((member) => (
              <li key={member.email} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="break-words" style={{ color: '#FFFFFF' }}>{member.email}</p>
                  <p className="text-xs" style={{ color: TEXT_SUBTLE }}>{ROLE_LABEL[member.role]}</p>
                </div>
                {member.email !== currentEmail && (
                  <button
                    type="button"
                    aria-label={`Sacar a ${member.email} del equipo`}
                    disabled={busyKey === `del-${member.email}`}
                    onClick={() => removeUser(member.email)}
                    className={`inline-flex shrink-0 items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-white/5 ${focusRing}`}
                    style={{ color: TEXT_SUBTLE }}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
