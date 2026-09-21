import { useId, useState, type FormEvent } from 'react';
import { LogIn, RotateCcw, Trash2, UserPlus } from 'lucide-react';
import { errorMessage, supabase, type AttendeeInput } from '../../lib/tickets';
import { formatDateTime } from '../../lib/csv';
import { ERROR_TEXT, GOLD, RULE, TEXT_MUTED, TEXT_SUBTLE, TextField, focusRing, primaryButton } from './ticketUi';

type Code = { code: string; company_id: string; redeemed_at: string | null };
type Attendee = {
  id: string; company_id: string; code: string; first_name: string; last_name: string; email: string;
  company: string; job_title: string; phone: string; created_at: string; checked_in_at: string | null;
};

const EMPTY_ATTENDEE: AttendeeInput = { firstName: '', lastName: '', email: '', company: '', jobTitle: '', phone: '' };

type CompanyDetailProps = {
  companyName: string;
  codes: Code[];
  attendees: Attendee[];
  onChange: () => void;
};

/** Inline codes + attendees management for one company, opened from the companies table. */
export function CompanyDetail({ companyName, codes, attendees, onChange }: CompanyDetailProps) {
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [attendee, setAttendee] = useState<AttendeeInput>({ ...EMPTY_ATTENDEE, company: companyName });
  const formId = useId();

  const nextCode = codes.find((c) => !c.redeemed_at)?.code;

  const run = async (key: string, action: () => PromiseLike<{ error: { message: string } | null }>, success: string) => {
    setBusyKey(key);
    setError('');
    setNotice('');
    const { error: actionError } = await action();
    setBusyKey('');
    if (actionError) {
      setError(errorMessage(new Error(actionError.message)));
      return;
    }
    setNotice(success);
    onChange();
  };

  const addAttendee = async (event: FormEvent) => {
    event.preventDefault();
    if (!nextCode) return;
    setBusyKey('add-attendee');
    setError('');
    setNotice('');
    const { error: rpcError } = await supabase.rpc('register_attendee', {
      p_code: nextCode,
      p_first_name: attendee.firstName,
      p_last_name: attendee.lastName,
      p_email: attendee.email,
      p_company: attendee.company,
      p_job_title: attendee.jobTitle,
      p_phone: attendee.phone,
    });
    setBusyKey('');
    if (rpcError) {
      setError(errorMessage(rpcError));
      return;
    }
    setNotice(`${attendee.firstName} agregado con el código ${nextCode}.`);
    setAttendee({ ...EMPTY_ATTENDEE, company: companyName });
    onChange();
  };

  const updateField = (field: keyof AttendeeInput) => (value: string) =>
    setAttendee((current) => ({ ...current, [field]: value }));

  return (
    <div className="p-5 space-y-6" style={{ backgroundColor: '#0d0d0d' }}>
      <div aria-live="polite" className="min-h-5 text-sm">
        {error && <p role="alert" style={{ color: ERROR_TEXT }}>{error}</p>}
        {notice && !error && <p style={{ color: GOLD }}>{notice}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-label={`Códigos de ${companyName}`}>
          <h3 className="text-sm uppercase tracking-wider mb-3" style={{ color: TEXT_SUBTLE }}>
            Códigos ({codes.length})
          </h3>
          {codes.length === 0 ? (
            <p className="text-sm" style={{ color: TEXT_MUTED }}>Todavía no se generaron códigos.</p>
          ) : (
            <ul className="rounded-xl border divide-y max-h-80 overflow-y-auto" style={{ borderColor: RULE }}>
              {codes.map((c) => (
                <li key={c.code} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm" style={{ borderColor: RULE }}>
                  <span className="tabular-nums" style={{ color: '#FFFFFF' }}>{c.code}</span>
                  {c.redeemed_at ? (
                    <span className="text-xs whitespace-nowrap" style={{ color: TEXT_SUBTLE }}>
                      Usado {formatDateTime(c.redeemed_at)}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="text-xs" style={{ color: GOLD }}>Disponible</span>
                      <button
                        type="button"
                        aria-label={`Eliminar código ${c.code}`}
                        disabled={busyKey === `del-code-${c.code}`}
                        onClick={() => {
                          if (window.confirm(`¿Eliminar el código ${c.code}? No se puede deshacer.`)) {
                            run(`del-code-${c.code}`, () => supabase.from('invitation_codes').delete().eq('code', c.code), `Código ${c.code} eliminado.`);
                          }
                        }}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/5 ${focusRing}`}
                        style={{ color: TEXT_SUBTLE }}
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-label={`Inscriptos de ${companyName}`}>
          <h3 className="text-sm uppercase tracking-wider mb-3" style={{ color: TEXT_SUBTLE }}>
            Inscriptos ({attendees.length})
          </h3>
          {attendees.length === 0 ? (
            <p className="text-sm" style={{ color: TEXT_MUTED }}>Nadie se anotó todavía con estos códigos.</p>
          ) : (
            <ul className="rounded-xl border divide-y max-h-80 overflow-y-auto" style={{ borderColor: RULE }}>
              {attendees.map((a) => (
                <li key={a.id} className="px-4 py-3 text-sm" style={{ borderColor: RULE }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words" style={{ color: '#FFFFFF' }}>{a.first_name} {a.last_name}</p>
                      <p className="text-xs break-words" style={{ color: TEXT_SUBTLE }}>{a.email} · {a.code}</p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Eliminar inscripción de ${a.first_name} ${a.last_name}`}
                      disabled={busyKey === `del-attendee-${a.id}`}
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la inscripción de ${a.first_name} ${a.last_name}? Su código ${a.code} vuelve a quedar disponible.`)) {
                          run(`del-attendee-${a.id}`, () => supabase.rpc('delete_attendee', { p_attendee_id: a.id }), `${a.first_name} eliminado. El código ${a.code} quedó disponible.`);
                        }
                      }}
                      className={`inline-flex shrink-0 items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/5 ${focusRing}`}
                      style={{ color: TEXT_SUBTLE }}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-xs" style={{ color: a.checked_in_at ? GOLD : TEXT_SUBTLE }}>
                      {a.checked_in_at ? `Ingresó ${formatDateTime(a.checked_in_at)}` : 'No ingresó'}
                    </span>
                    <button
                      type="button"
                      disabled={busyKey === `checkin-${a.id}`}
                      onClick={() =>
                        run(
                          `checkin-${a.id}`,
                          () => a.checked_in_at
                            ? supabase.rpc('undo_check_in', { p_attendee_id: a.id })
                            : supabase.rpc('check_in', { p_attendee_id: a.id }),
                          a.checked_in_at ? `Ingreso de ${a.first_name} deshecho.` : `Ingreso de ${a.first_name} registrado.`
                        )
                      }
                      className={`inline-flex items-center gap-1.5 min-h-8 px-2.5 rounded-lg text-xs transition-colors hover:bg-white/5 ${focusRing}`}
                      style={{ color: GOLD }}
                    >
                      {a.checked_in_at ? (
                        <><RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />Deshacer</>
                      ) : (
                        <><LogIn className="w-3.5 h-3.5" aria-hidden="true" />Marcar ingreso</>
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby={formId} className="rounded-xl border p-4" style={{ borderColor: RULE }}>
        <h3 id={formId} className="text-sm uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: TEXT_SUBTLE }}>
          <UserPlus className="w-4 h-4" aria-hidden="true" />Agregar inscripto manualmente
        </h3>
        {nextCode ? (
          <form onSubmit={addAttendee} className="grid gap-3 sm:grid-cols-2">
            <TextField label="Nombre" name="nombre" autoComplete="given-name" value={attendee.firstName} onChange={updateField('firstName')} />
            <TextField label="Apellido" name="apellido" autoComplete="family-name" value={attendee.lastName} onChange={updateField('lastName')} />
            <TextField label="Correo" name="correo" type="email" autoComplete="email" value={attendee.email} onChange={updateField('email')} />
            <TextField label="Celular" name="celular" type="tel" autoComplete="tel" inputMode="tel" value={attendee.phone} onChange={updateField('phone')} placeholder="0981 123456" />
            <TextField label="Empresa" name="empresa" autoComplete="organization" value={attendee.company} onChange={updateField('company')} />
            <TextField label="Cargo" name="cargo" autoComplete="organization-title" value={attendee.jobTitle} onChange={updateField('jobTitle')} />
            <p className="sm:col-span-2 text-xs" style={{ color: TEXT_SUBTLE }}>
              Se le asigna el código <span className="tabular-nums" style={{ color: GOLD }}>{nextCode}</span> y le llega la entrada por correo.
            </p>
            <button
              type="submit"
              disabled={busyKey === 'add-attendee'}
              aria-busy={busyKey === 'add-attendee'}
              className={`sm:col-span-2 ${primaryButton}`}
              style={{ backgroundColor: GOLD, color: '#000000' }}
            >
              {busyKey === 'add-attendee' ? 'Agregando…' : 'Agregar inscripto'}
            </button>
          </form>
        ) : (
          <p className="text-sm" style={{ color: TEXT_MUTED }}>
            No quedan códigos disponibles para esta empresa. Generá más arriba antes de agregar a alguien.
          </p>
        )}
      </section>
    </div>
  );
}
