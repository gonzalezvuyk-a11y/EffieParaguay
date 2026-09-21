import { useDeferredValue, useId, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { formatDateTime } from '../../lib/csv';
import { GOLD, RULE, SURFACE, TEXT_MUTED, TEXT_SUBTLE, focusRing } from './ticketUi';

export type PanelAttendee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  created_at: string;
  checked_in_at: string | null;
};

const normalize = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Read-only list of everyone registered, with a search box. */
export function AttendeesTable({ attendees }: { attendees: PanelAttendee[] }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const searchId = useId();

  const results = useMemo(() => {
    const term = normalize(deferredQuery.trim());
    if (!term) return attendees;
    return attendees.filter((a) =>
      normalize(`${a.first_name} ${a.last_name} ${a.company} ${a.email} ${a.phone} ${a.job_title}`).includes(term)
    );
  }, [attendees, deferredQuery]);

  return (
    <section aria-labelledby="attendees-title" className="rounded-2xl border overflow-hidden" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b" style={{ borderColor: RULE }}>
        <h2 id="attendees-title" className="text-lg" style={{ color: GOLD, fontWeight: 450 }}>Inscriptos</h2>
        <div className="relative">
          <label htmlFor={searchId} className="sr-only">Buscar inscripto</label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: TEXT_SUBTLE }} aria-hidden="true" />
          <input
            id={searchId}
            name="buscar-inscripto"
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nombre, empresa o correo…"
            className={`min-h-11 w-56 rounded-lg border pl-9 pr-3 text-sm bg-transparent ${focusRing}`}
            style={{ borderColor: '#333333', color: '#FFFFFF' }}
          />
        </div>
      </div>

      {attendees.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm" style={{ color: TEXT_MUTED }}>
          Todavía no se anotó nadie. Cuando alguien use su código, aparece acá.
        </p>
      ) : results.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm" style={{ color: TEXT_MUTED }}>
          Nadie coincide con “{query.trim()}”.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead style={{ color: TEXT_SUBTLE }}>
              <tr className="border-b" style={{ borderColor: RULE }}>
                <th scope="col" className="px-5 py-3 font-medium">Nombre</th>
                <th scope="col" className="px-3 py-3 font-medium">Empresa</th>
                <th scope="col" className="px-3 py-3 font-medium">Contacto</th>
                <th scope="col" className="px-5 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {results.map((attendee) => (
                <tr key={attendee.id} className="border-b last:border-b-0" style={{ borderColor: '#222222' }}>
                  <th scope="row" className="px-5 py-3 font-normal align-top" style={{ color: '#FFFFFF' }}>
                    {attendee.first_name} {attendee.last_name}
                    <span className="block text-xs" style={{ color: TEXT_SUBTLE }}>{attendee.job_title}</span>
                  </th>
                  <td className="px-3 py-3 align-top" style={{ color: TEXT_MUTED }}>{attendee.company}</td>
                  <td className="px-3 py-3 align-top" style={{ color: TEXT_MUTED }}>
                    {attendee.email}
                    <span className="block text-xs tabular-nums" style={{ color: TEXT_SUBTLE }}>{attendee.phone}</span>
                  </td>
                  <td className="px-5 py-3 align-top whitespace-nowrap" style={{ color: attendee.checked_in_at ? GOLD : TEXT_SUBTLE }}>
                    {attendee.checked_in_at ? `Ingresó ${formatDateTime(attendee.checked_in_at)}` : 'Anotado'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
