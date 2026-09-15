import { useId, useState, type FormEvent } from 'react';
import { CalendarDays, Clock, MapPin, Ticket } from 'lucide-react';
import { DotsPattern } from '../DotsPattern';
import {
  EVENT,
  errorMessage,
  eventDateLabel,
  eventTimeLabel,
  formatCode,
  priceLabel,
  supabase,
  type AttendeeInput,
} from '../../lib/tickets';
import { TextField, focusRing, GOLD, SURFACE, RULE, TEXT_MUTED, TEXT_SUBTLE } from './ticketUi';

type Step =
  | { name: 'code' }
  | { name: 'details'; code: string; companyName: string };

const EMPTY_ATTENDEE: AttendeeInput = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  phone: '',
};

export function RegistrationPage() {
  const [step, setStep] = useState<Step>({ name: 'code' });
  const [code, setCode] = useState('');
  const [attendee, setAttendee] = useState<AttendeeInput>(EMPTY_ATTENDEE);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const codeId = useId();
  const codeErrorId = useId();
  const formErrorId = useId();

  const updateField = (field: keyof AttendeeInput) => (value: string) =>
    setAttendee((current) => ({ ...current, [field]: value }));

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsBusy(true);
    const { data, error: rpcError } = await supabase.rpc('check_code', { p_code: code });
    setIsBusy(false);
    const companyName = Array.isArray(data) ? data[0]?.company_name : undefined;
    if (rpcError || !companyName) {
      setError(errorMessage(rpcError ?? new Error('CODE_NOT_FOUND')));
      return;
    }
    setAttendee((current) => ({ ...current, company: current.company || companyName }));
    setStep({ name: 'details', code, companyName });
  };

  const submitDetails = async (event: FormEvent) => {
    event.preventDefault();
    if (step.name !== 'details') return;
    setError('');
    setIsBusy(true);
    const { data: token, error: rpcError } = await supabase.rpc('register_attendee', {
      p_code: step.code,
      p_first_name: attendee.firstName,
      p_last_name: attendee.lastName,
      p_email: attendee.email,
      p_company: attendee.company,
      p_job_title: attendee.jobTitle,
      p_phone: attendee.phone,
    });
    if (rpcError || typeof token !== 'string') {
      setIsBusy(false);
      setError(errorMessage(rpcError ?? new Error('unknown')));
      return;
    }
    supabase.functions.invoke('send-ticket', { body: { token } }).catch(() => undefined);
    window.location.assign(`/entradas/ticket?t=${token}&nueva=1`);
  };

  const isExonerated = step.name === 'details';

  return (
    <main className="min-h-screen relative overflow-x-clip pt-36 pb-24" style={{ backgroundColor: '#0a0a0a' }}>
      <DotsPattern />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] mb-4" style={{ color: GOLD, fontWeight: 500 }}>
              Entradas
            </p>
            <h1 className="text-4xl md:text-6xl leading-[1.05] text-balance mb-6" style={{ color: '#FFFFFF', fontWeight: 450 }}>
              {EVENT.name}
            </h1>
            <p className="text-base md:text-lg leading-relaxed text-pretty mb-10 max-w-xl" style={{ color: TEXT_MUTED }}>
              Esta primera edición es por invitación. Ingresá el código que te dio tu empresa o agencia
              para obtener tu entrada sin costo.
            </p>

            <ol className="flex gap-3 mb-6 text-sm" aria-label="Pasos">
              {['Código', 'Tus datos', 'Entrada'].map((label, index) => {
                const current = step.name === 'code' ? 0 : 1;
                return (
                  <li
                    key={label}
                    aria-current={index === current ? 'step' : undefined}
                    className="flex items-center gap-2"
                    style={{ color: index <= current ? '#FFFFFF' : TEXT_SUBTLE }}
                  >
                    <span
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs tabular-nums"
                      style={{ borderColor: index <= current ? GOLD : '#444444', color: index <= current ? GOLD : TEXT_SUBTLE }}
                    >
                      {index + 1}
                    </span>
                    {label}
                  </li>
                );
              })}
            </ol>

            <div className="rounded-2xl border p-5 md:p-8" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
              {step.name === 'code' ? (
                <form onSubmit={submitCode} noValidate>
                  <label htmlFor={codeId} className="block text-sm mb-2" style={{ color: TEXT_MUTED }}>
                    Código de invitación
                  </label>
                  <input
                    id={codeId}
                    name="codigo"
                    value={code}
                    onChange={(e) => setCode(formatCode(e.target.value))}
                    placeholder="ABCD-2345"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    inputMode="text"
                    required
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? codeErrorId : undefined}
                    className={`w-full min-h-12 rounded-lg border px-4 text-xl tracking-[0.2em] tabular-nums bg-transparent uppercase ${focusRing}`}
                    style={{ borderColor: error ? '#E26D5A' : '#333333', color: '#FFFFFF' }}
                  />
                  {error && (
                    <p id={codeErrorId} role="alert" className="mt-2 text-sm" style={{ color: '#F0A090' }}>
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isBusy || code.length < 9}
                    aria-busy={isBusy}
                    className={`mt-6 w-full min-h-12 rounded-full font-medium transition-colors touch-manipulation disabled:opacity-50 hover:bg-[#d1b06a] ${focusRing}`}
                    style={{ backgroundColor: GOLD, color: '#000000' }}
                  >
                    {isBusy ? 'Validando código…' : 'Validar código'}
                  </button>
                </form>
              ) : (
                <form onSubmit={submitDetails} noValidate aria-describedby={error ? formErrorId : undefined}>
                  <p className="mb-6 text-sm" style={{ color: TEXT_MUTED }}>
                    Código <span className="tabular-nums" style={{ color: '#FFFFFF' }}>{step.code}</span> de{' '}
                    <span style={{ color: '#FFFFFF' }}>{step.companyName}</span>.{' '}
                    <button
                      type="button"
                      onClick={() => { setStep({ name: 'code' }); setError(''); }}
                      className={`underline underline-offset-4 rounded ${focusRing}`}
                      style={{ color: GOLD }}
                    >
                      Cambiar código
                    </button>
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Nombre" name="nombre" autoComplete="given-name" value={attendee.firstName} onChange={updateField('firstName')} />
                    <TextField label="Apellido" name="apellido" autoComplete="family-name" value={attendee.lastName} onChange={updateField('lastName')} />
                    <TextField label="Correo" name="correo" type="email" autoComplete="email" value={attendee.email} onChange={updateField('email')} hint="Te enviamos la entrada a este correo." />
                    <TextField label="Celular" name="celular" type="tel" autoComplete="tel" inputMode="tel" value={attendee.phone} onChange={updateField('phone')} placeholder="0981 123456" />
                    <TextField label="Empresa" name="empresa" autoComplete="organization" value={attendee.company} onChange={updateField('company')} />
                    <TextField label="Cargo" name="cargo" autoComplete="organization-title" value={attendee.jobTitle} onChange={updateField('jobTitle')} />
                  </div>
                  {error && (
                    <p id={formErrorId} role="alert" className="mt-4 text-sm" style={{ color: '#F0A090' }}>
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isBusy}
                    aria-busy={isBusy}
                    className={`mt-6 w-full min-h-12 rounded-full font-medium transition-colors touch-manipulation disabled:opacity-50 hover:bg-[#d1b06a] ${focusRing}`}
                    style={{ backgroundColor: GOLD, color: '#000000' }}
                  >
                    {isBusy ? 'Confirmando…' : 'Confirmar entrada gratis'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <aside
            aria-label="Resumen de la entrada"
            className="rounded-2xl border p-6 lg:sticky lg:top-28"
            style={{ backgroundColor: SURFACE, borderColor: RULE }}
          >
            <div className="flex items-center gap-2 mb-5" style={{ color: GOLD }}>
              <Ticket className="w-5 h-5" aria-hidden="true" />
              <h2 className="text-lg" style={{ fontWeight: 450 }}>Resumen</h2>
            </div>
            <ul className="space-y-3 text-sm mb-6" style={{ color: TEXT_MUTED }}>
              <li className="flex gap-3"><CalendarDays className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} aria-hidden="true" /><span className="first-letter:uppercase">{eventDateLabel}</span></li>
              <li className="flex gap-3"><Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} aria-hidden="true" /><span>Convocatoria {eventTimeLabel} h</span></li>
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} aria-hidden="true" />
                <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-4 rounded hover:text-white ${focusRing}`}>
                  {EVENT.venue}
                </a>
              </li>
            </ul>
            <dl className="border-t pt-4 space-y-2 text-sm tabular-nums" style={{ borderColor: RULE }}>
              <div className="flex justify-between">
                <dt style={{ color: TEXT_MUTED }}>1 entrada</dt>
                <dd style={{ color: isExonerated ? TEXT_SUBTLE : '#FFFFFF' }} className={isExonerated ? 'line-through' : undefined}>
                  {priceLabel}
                </dd>
              </div>
              {isExonerated && (
                <div className="flex justify-between" style={{ color: GOLD }}>
                  <dt>Exoneración por invitación</dt>
                  <dd>−{priceLabel}</dd>
                </div>
              )}
              <div className="flex justify-between border-t pt-3 text-base" style={{ borderColor: RULE, color: '#FFFFFF' }}>
                <dt>Total</dt>
                <dd aria-live="polite">{isExonerated ? 'USD 0' : priceLabel}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </main>
  );
}
