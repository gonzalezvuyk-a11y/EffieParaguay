import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Camera, CheckCircle2, RotateCcw, Search, X } from 'lucide-react';
import type QrScanner from 'qr-scanner';
import { errorMessage, supabase } from '../../lib/tickets';
import { StaffGate } from './StaffGate';
import { ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TEXT_SUBTLE, TicketShell, focusRing, primaryButton, secondaryButton } from './ticketUi';

type Attendee = { id: string; first_name: string; last_name: string; company: string; email: string; phone: string; checked_in_at: string | null };
type Feedback = { tone: 'ok' | 'warn' | 'error'; message: string };

const REFRESH_MS = 15000;
const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const timeLabel = (value: string) => new Intl.DateTimeFormat('es-PY', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));

export function DoorPage() {
  return <StaffGate title="Ingreso en puerta">{() => <Door />}</StaffGate>;
}

function Door() {
  const [attendees, setAttendees] = useState<Attendee[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [busyId, setBusyId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const lastScanRef = useRef('');

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('attendees')
      .select('id, first_name, last_name, company, email, phone, checked_in_at')
      .order('last_name');
    if (error) {
      setLoadError(errorMessage(error));
      return;
    }
    setLoadError('');
    setAttendees(data);
  }, []);

  useEffect(() => {
    document.title = 'Ingreso en puerta | Effie Paraguay';
    load();
    const interval = window.setInterval(load, REFRESH_MS);
    return () => window.clearInterval(interval);
  }, [load]);

  const checkIn = useCallback(async (params: { p_attendee_id?: string; p_token?: string }) => {
    setBusyId(params.p_attendee_id ?? 'scan');
    const { data, error } = await supabase.rpc('check_in', params);
    setBusyId('');
    const row = Array.isArray(data) ? data[0] : undefined;
    if (error || !row) {
      setFeedback({ tone: 'error', message: errorMessage(error ?? new Error('TICKET_NOT_FOUND')) });
      return;
    }
    const name = `${row.first_name} ${row.last_name}`;
    setFeedback(
      row.already_checked_in
        ? { tone: 'warn', message: `${name} ya había ingresado a las ${timeLabel(row.checked_in_at)}.` }
        : { tone: 'ok', message: `Ingreso registrado: ${name} (${row.company}).` }
    );
    load();
  }, [load]);

  const undo = async (attendee: Attendee) => {
    setBusyId(attendee.id);
    const { error } = await supabase.rpc('undo_check_in', { p_attendee_id: attendee.id });
    setBusyId('');
    setFeedback(error ? { tone: 'error', message: errorMessage(error) } : { tone: 'warn', message: `Ingreso de ${attendee.first_name} ${attendee.last_name} deshecho.` });
    load();
  };

  const stopScanner = useCallback(() => {
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setIsScanning(false);
  }, []);

  useEffect(() => stopScanner, [stopScanner]);

  const startScanner = async () => {
    setFeedback(null);
    setIsScanning(true);
    const { default: Scanner } = await import('qr-scanner');
    if (!videoRef.current) return;
    const scanner = new Scanner(videoRef.current, (result) => {
      if (result.data === lastScanRef.current) return;
      lastScanRef.current = result.data;
      window.setTimeout(() => { lastScanRef.current = ''; }, 4000);
      let token = '';
      try {
        token = new URL(result.data).searchParams.get('t') ?? '';
      } catch {
        token = '';
      }
      if (!token) {
        setFeedback({ tone: 'error', message: 'Ese QR no es una entrada de Effie.' });
        return;
      }
      checkIn({ p_token: token });
    }, { returnDetailedScanResult: true, highlightScanRegion: true, preferredCamera: 'environment' });
    scannerRef.current = scanner;
    try {
      await scanner.start();
    } catch {
      stopScanner();
      setFeedback({ tone: 'error', message: 'No se pudo abrir la cámara. Permití el acceso o buscá al invitado por nombre.' });
    }
  };

  const results = useMemo(() => {
    const term = normalize(deferredQuery.trim());
    if (!attendees || term.length < 2) return [];
    return attendees
      .filter((a) => normalize(`${a.first_name} ${a.last_name} ${a.company} ${a.email} ${a.phone}`).includes(term))
      .slice(0, 30);
  }, [attendees, deferredQuery]);

  const checkedInCount = attendees?.filter((a) => a.checked_in_at).length ?? 0;
  const feedbackColor = feedback?.tone === 'ok' ? GOLD : feedback?.tone === 'warn' ? '#E8C170' : ERROR_TEXT;

  return (
    <TicketShell>
      <div className="max-w-2xl mx-auto space-y-5">
        <header className="flex items-end justify-between gap-4">
          <h1 className="text-3xl md:text-4xl" style={{ color: '#FFFFFF', fontWeight: 450 }}>Ingreso</h1>
          <p className="text-sm tabular-nums" style={{ color: TEXT_MUTED }}>
            <span style={{ color: '#FFFFFF' }}>{checkedInCount}</span> de {attendees?.length ?? '—'} ingresaron
          </p>
        </header>

        {loadError && <p role="alert" className="text-sm" style={{ color: ERROR_TEXT }}>{loadError}</p>}

        <div aria-live="assertive" className="min-h-14">
          {feedback && (
            <p className="flex items-start gap-2 rounded-xl border px-4 py-3 text-base" style={{ borderColor: feedbackColor, color: feedbackColor }}>
              <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />{feedback.message}
            </p>
          )}
        </div>

        <div className="rounded-2xl border p-4" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
          {isScanning ? (
            <div className="space-y-3">
              <video ref={videoRef} className="w-full aspect-square rounded-xl object-cover bg-black" muted playsInline aria-label="Vista de la cámara para escanear QR" />
              <button type="button" onClick={stopScanner} className={`w-full inline-flex items-center justify-center gap-2 ${secondaryButton}`} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
                <X className="w-4 h-4" aria-hidden="true" />Cerrar cámara
              </button>
            </div>
          ) : (
            <button type="button" onClick={startScanner} className={`w-full inline-flex items-center justify-center gap-2 ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
              <Camera className="w-5 h-5" aria-hidden="true" />Escanear QR
            </button>
          )}
        </div>

        <div>
          <label htmlFor={searchId} className="block text-sm mb-2" style={{ color: TEXT_MUTED }}>Buscar por nombre, apellido, empresa o celular</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" style={{ color: TEXT_SUBTLE }} aria-hidden="true" />
            <input
              id={searchId} name="buscar" type="search" autoComplete="off" spellCheck={false}
              value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ej: Martínez…"
              className={`w-full min-h-14 rounded-xl border pl-11 pr-3 text-lg bg-transparent ${focusRing}`} style={{ borderColor: '#333333', color: '#FFFFFF' }}
            />
          </div>
        </div>

        {query.trim().length >= 2 && attendees && (
          <ul className="rounded-2xl border overflow-hidden" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
            {results.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm" style={{ color: TEXT_MUTED }}>
                Nadie inscripto coincide con “{query.trim()}”. Probá con el apellido o la empresa.
              </li>
            ) : (
              results.map((attendee) => (
                <li key={attendee.id} className="flex items-center justify-between gap-3 px-5 py-3 border-b last:border-b-0" style={{ borderColor: '#222222' }}>
                  <div className="min-w-0">
                    <p className="text-lg break-words" style={{ color: '#FFFFFF' }}>{attendee.first_name} {attendee.last_name}</p>
                    <p className="text-sm break-words" style={{ color: TEXT_SUBTLE }}>{attendee.company}</p>
                  </div>
                  {attendee.checked_in_at ? (
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm tabular-nums" style={{ color: GOLD }}>Ingresó {timeLabel(attendee.checked_in_at)}</span>
                      <button type="button" onClick={() => undo(attendee)} disabled={busyId === attendee.id} aria-label={`Deshacer ingreso de ${attendee.first_name} ${attendee.last_name}`} className={`inline-flex w-11 items-center justify-center ${secondaryButton} px-0`} style={{ borderColor: '#333333', color: TEXT_SUBTLE }}>
                        <RotateCcw className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => checkIn({ p_attendee_id: attendee.id })} disabled={busyId === attendee.id} aria-busy={busyId === attendee.id} className={`shrink-0 ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
                      Marcar ingreso
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </TicketShell>
  );
}
