import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { CalendarDays, CheckCircle2, Clock, MapPin } from 'lucide-react';
import {
  EVENT,
  errorMessage,
  eventDateLabel,
  eventTimeLabel,
  supabase,
  ticketUrl,
  type Ticket,
} from '../../lib/tickets';
import { ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TEXT_SUBTLE, TicketShell, focusRing, primaryButton } from './ticketUi';

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; ticket: Ticket; qr: string };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function TicketPage() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('t') ?? '';
  const isNew = params.get('nueva') === '1';
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    document.title = 'Tu entrada | Effie Paraguay';
    if (isNew) window.history.replaceState(null, '', `/entradas/ticket?t=${token}`);

    if (!UUID_PATTERN.test(token)) {
      setState({ status: 'error', message: 'El link de la entrada está incompleto. Abrilo de nuevo desde el correo.' });
      return;
    }

    let isCancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc('get_ticket', { p_token: token });
      const ticket = Array.isArray(data) ? (data[0] as Ticket | undefined) : undefined;
      if (isCancelled) return;
      if (error || !ticket) {
        setState({ status: 'error', message: error ? errorMessage(error) : 'No encontramos esta entrada. Revisá el link del correo.' });
        return;
      }
      const qr = await QRCode.toDataURL(ticketUrl(token), { margin: 1, width: 480, errorCorrectionLevel: 'M' });
      if (!isCancelled) setState({ status: 'ready', ticket, qr });
    })();
    return () => {
      isCancelled = true;
    };
  }, [token, isNew]);

  return (
    <TicketShell>
      <div className="max-w-md mx-auto">
        {state.status === 'loading' && (
          <div
            className="rounded-3xl border h-[38rem] animate-pulse motion-reduce:animate-none"
            style={{ backgroundColor: SURFACE, borderColor: RULE }}
            aria-busy="true"
            aria-label="Cargando entrada…"
          />
        )}

        {state.status === 'error' && (
          <div role="alert" className="rounded-2xl border p-8 text-center" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
            <p className="text-lg mb-2" style={{ color: '#FFFFFF' }}>No pudimos mostrar la entrada</p>
            <p className="text-sm mb-6" style={{ color: ERROR_TEXT }}>{state.message}</p>
            <a href="/entradas" className={`inline-flex items-center ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
              Ir a entradas
            </a>
          </div>
        )}

        {state.status === 'ready' && (
          <>
            {isNew && (
              <p role="status" className="flex items-start gap-2 mb-6 text-sm" style={{ color: TEXT_MUTED }}>
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: GOLD }} aria-hidden="true" />
                Tu entrada está confirmada. Guardá este link o hacé una captura; en la puerta también podés ingresar con tu nombre.
              </p>
            )}

            <article
              aria-label="Entrada"
              className="rounded-3xl border overflow-hidden"
              style={{ backgroundColor: '#111111', borderColor: '#3a3220' }}
            >
              <div className="p-6 pb-5" style={{ background: 'linear-gradient(135deg, rgba(184,150,80,0.18), rgba(17,17,17,0))' }}>
                <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>Entrada exonerada</p>
                <h1 className="text-2xl leading-tight text-balance" style={{ color: '#FFFFFF', fontWeight: 450 }}>{EVENT.name}</h1>
              </div>

              <div className="px-6 pb-6">
                <p translate="no" className="text-xl break-words" style={{ color: '#FFFFFF', fontWeight: 450 }}>
                  {state.ticket.first_name} {state.ticket.last_name}
                </p>
                <p className="text-sm mt-1 break-words" style={{ color: TEXT_MUTED }}>
                  {state.ticket.job_title} · <span translate="no">{state.ticket.company}</span>
                </p>

                <ul className="mt-5 space-y-2 text-sm" style={{ color: TEXT_MUTED }}>
                  <li className="flex gap-3"><CalendarDays className="w-4 h-4 mt-0.5" style={{ color: GOLD }} aria-hidden="true" /><span className="first-letter:uppercase">{eventDateLabel}</span></li>
                  <li className="flex gap-3"><Clock className="w-4 h-4 mt-0.5" style={{ color: GOLD }} aria-hidden="true" />Convocatoria {eventTimeLabel} h</li>
                  <li className="flex gap-3">
                    <MapPin className="w-4 h-4 mt-0.5" style={{ color: GOLD }} aria-hidden="true" />
                    <a href={EVENT.mapsUrl} target="_blank" rel="noopener noreferrer" className={`underline underline-offset-4 rounded hover:text-white ${focusRing}`}>{EVENT.venue}</a>
                  </li>
                </ul>
              </div>

              <div className="relative border-t border-dashed mx-6" style={{ borderColor: '#3a3a3a' }} aria-hidden="true" />

              <div className="p-6 flex flex-col items-center">
                {state.ticket.checked_in_at ? (
                  <p className="mb-4 text-sm" style={{ color: GOLD }}>Ingreso registrado</p>
                ) : null}
                <div className="rounded-2xl bg-white p-3">
                  <img src={state.qr} width={240} height={240} alt="Código QR de tu entrada para mostrar en la puerta" className="block w-60 h-60" />
                </div>
                <p className="mt-4 text-xs tabular-nums tracking-[0.2em]" style={{ color: TEXT_SUBTLE }}>{state.ticket.code}</p>
              </div>
            </article>
          </>
        )}
      </div>
    </TicketShell>
  );
}
