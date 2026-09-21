import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Download, KeyRound, Trash2 } from 'lucide-react';
import { errorMessage, supabase } from '../../lib/tickets';
import { downloadCsv, formatDateTime } from '../../lib/csv';
import { StaffGate } from './StaffGate';
import { BulkCompanies } from './BulkCompanies';
import { AttendeesTable } from './AttendeesTable';
import {
  ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TEXT_SUBTLE, TextField, TicketShell,
  focusRing, primaryButton, secondaryButton,
} from './ticketUi';

type Company = { id: string; name: string; quota: number };
type Code = { code: string; company_id: string; redeemed_at: string | null };
type Attendee = {
  id: string; company_id: string; code: string; first_name: string; last_name: string; email: string;
  company: string; job_title: string; phone: string; created_at: string; checked_in_at: string | null;
};
type PanelData = { capacity: number; companies: Company[]; codes: Code[]; attendees: Attendee[] };

export function PanelPage() {
  return <StaffGate title="Panel de entradas">{() => <Panel />}</StaffGate>;
}

function Panel() {
  const [data, setData] = useState<PanelData | null>(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const [capacityDraft, setCapacityDraft] = useState('');
  const [newName, setNewName] = useState('');
  const [newQuota, setNewQuota] = useState('');

  const load = useCallback(async () => {
    const [settings, companies, codes, attendees] = await Promise.all([
      supabase.from('event_settings').select('global_capacity').single(),
      supabase.from('companies').select('id, name, quota').order('name'),
      supabase.from('invitation_codes').select('code, company_id, redeemed_at'),
      supabase.from('attendees').select('id, company_id, code, first_name, last_name, email, company, job_title, phone, created_at, checked_in_at').order('created_at'),
    ]);
    const failure = settings.error ?? companies.error ?? codes.error ?? attendees.error;
    if (failure) {
      setLoadError(errorMessage(failure));
      return;
    }
    setLoadError('');
    setData({ capacity: settings.data.global_capacity, companies: companies.data, codes: codes.data, attendees: attendees.data });
    setCapacityDraft(String(settings.data.global_capacity));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (key: string, action: () => PromiseLike<{ error: { message: string } | null }>, success: string) => {
    setBusyKey(key);
    setActionError('');
    setNotice('');
    const { error } = await action();
    setBusyKey('');
    if (error) {
      setActionError(errorMessage(new Error(error.message)));
      return false;
    }
    setNotice(success);
    await load();
    return true;
  };

  if (loadError) {
    return (
      <TicketShell>
        <div role="alert" className="max-w-md mx-auto text-center">
          <p className="mb-4" style={{ color: ERROR_TEXT }}>{loadError}</p>
          <button type="button" onClick={load} className={secondaryButton} style={{ borderColor: '#333333', color: TEXT_MUTED }}>Reintentar</button>
        </div>
      </TicketShell>
    );
  }

  if (!data) {
    return <TicketShell><p aria-busy="true" className="text-center" style={{ color: TEXT_MUTED }}>Cargando panel…</p></TicketShell>;
  }

  const assigned = data.companies.reduce((sum, company) => sum + company.quota, 0);
  const checkedIn = data.attendees.filter((attendee) => attendee.checked_in_at).length;
  const stats = [
    { label: 'Capacidad', value: data.capacity },
    { label: 'Cupos asignados', value: assigned },
    { label: 'Códigos generados', value: data.codes.length },
    { label: 'Inscriptos', value: data.attendees.length },
    { label: 'Ingresaron', value: checkedIn },
  ];

  const addCompany = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await run('add', () => supabase.from('companies').insert({ name: newName.trim(), quota: Number(newQuota) }), `Empresa “${newName.trim()}” agregada.`);
    if (ok) { setNewName(''); setNewQuota(''); }
  };

  const exportCodes = (company?: Company) => {
    const companyById = new Map(data.companies.map((c) => [c.id, c.name]));
    const rows = data.codes
      .filter((code) => !company || code.company_id === company.id)
      .map((code) => [companyById.get(code.company_id) ?? '', code.code, code.redeemed_at ? 'Usado' : 'Disponible', formatDateTime(code.redeemed_at)]);
    downloadCsv(company ? `codigos-${company.name}.csv` : 'codigos-effie-2026.csv', ['Empresa', 'Código', 'Estado', 'Usado el'], rows);
  };

  const exportAttendees = () => {
    downloadCsv('inscriptos-effie-2026.csv', ['Nombre', 'Apellido', 'Correo', 'Celular', 'Empresa', 'Cargo', 'Código', 'Inscripto el', 'Ingresó'],
      data.attendees.map((a) => [a.first_name, a.last_name, a.email, a.phone, a.company, a.job_title, a.code, formatDateTime(a.created_at), formatDateTime(a.checked_in_at)]));
  };

  return (
    <TicketShell>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] mb-2" style={{ color: GOLD }}>Entradas 2026</p>
            <h1 className="text-3xl md:text-5xl" style={{ color: '#FFFFFF', fontWeight: 450 }}>Panel</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/entradas/puerta" className={`inline-flex items-center ${secondaryButton}`} style={{ borderColor: '#333333', color: TEXT_MUTED }}>Ir a la puerta</a>
            <button type="button" onClick={exportAttendees} className={`inline-flex items-center gap-2 ${secondaryButton}`} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
              <Download className="w-4 h-4" aria-hidden="true" />Inscriptos CSV
            </button>
            <button type="button" onClick={() => exportCodes()} className={`inline-flex items-center gap-2 ${secondaryButton}`} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
              <Download className="w-4 h-4" aria-hidden="true" />Todos los códigos
            </button>
          </div>
        </header>

        <dl className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border px-4 py-3" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
              <dt className="text-xs" style={{ color: TEXT_SUBTLE }}>{stat.label}</dt>
              <dd className="text-2xl tabular-nums mt-1" style={{ color: '#FFFFFF' }}>{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div aria-live="polite" className="min-h-6 text-sm">
          {actionError && <p role="alert" style={{ color: ERROR_TEXT }}>{actionError}</p>}
          {notice && !actionError && <p style={{ color: GOLD }}>{notice}</p>}
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <form
            onSubmit={(e) => { e.preventDefault(); run('capacity', () => supabase.from('event_settings').update({ global_capacity: Number(capacityDraft) }).eq('id', true), 'Capacidad actualizada.'); }}
            className="rounded-2xl border p-5 flex items-end gap-3" style={{ backgroundColor: SURFACE, borderColor: RULE }}
          >
            <div className="flex-1"><TextField label="Capacidad total del evento" name="capacidad" type="number" inputMode="numeric" value={capacityDraft} onChange={setCapacityDraft} /></div>
            <button type="submit" disabled={busyKey === 'capacity'} className={secondaryButton} style={{ borderColor: '#333333', color: TEXT_MUTED }}>Guardar</button>
          </form>

          <form onSubmit={addCompany} className="rounded-2xl border p-5 grid grid-cols-[1fr_6rem] gap-3 items-end" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
            <TextField label="Nueva empresa o agencia" name="empresa" autoComplete="off" value={newName} onChange={setNewName} />
            <TextField label="Cupo" name="cupo" type="number" inputMode="numeric" value={newQuota} onChange={setNewQuota} />
            <button type="submit" disabled={busyKey === 'add' || !newName.trim() || Number(newQuota) < 1} className={`col-span-2 ${primaryButton}`} style={{ backgroundColor: GOLD, color: '#000000' }}>
              Agregar empresa
            </button>
          </form>

          <div className="md:col-span-2">
            <BulkCompanies
              onDone={(message) => {
                setActionError('');
                setNotice(message);
                load();
              }}
            />
          </div>
        </section>

        <section aria-labelledby="companies-title" className="rounded-2xl border overflow-hidden" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
          <h2 id="companies-title" className="px-5 py-4 border-b text-lg" style={{ color: GOLD, borderColor: RULE, fontWeight: 450 }}>Empresas y cupos</h2>
          {data.companies.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm" style={{ color: TEXT_MUTED }}>Todavía no hay empresas. Agregá la primera con su cupo para generar códigos.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead style={{ color: TEXT_SUBTLE }}>
                  <tr className="border-b" style={{ borderColor: RULE }}>
                    <th scope="col" className="px-5 py-3 font-medium">Empresa</th>
                    <th scope="col" className="px-3 py-3 font-medium">Cupo</th>
                    <th scope="col" className="px-3 py-3 font-medium">Códigos</th>
                    <th scope="col" className="px-3 py-3 font-medium">Inscriptos</th>
                    <th scope="col" className="px-5 py-3 font-medium"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  {data.companies.map((company) => (
                    <CompanyRow
                      key={company.id}
                      company={company}
                      issued={data.codes.filter((c) => c.company_id === company.id).length}
                      registered={data.attendees.filter((a) => a.company_id === company.id).length}
                      busyKey={busyKey}
                      onSaveQuota={(quota) => run(`quota-${company.id}`, () => supabase.from('companies').update({ quota }).eq('id', company.id), `Cupo de ${company.name} actualizado.`)}
                      onGenerate={(count) => run(`gen-${company.id}`, () => supabase.rpc('generate_codes', { p_company_id: company.id, p_count: count }), `${count} códigos generados para ${company.name}.`)}
                      onExport={() => exportCodes(company)}
                      onDelete={() => {
                        if (window.confirm(`¿Eliminar ${company.name} y sus códigos sin usar? No se puede deshacer.`)) {
                          run(`del-${company.id}`, () => supabase.from('companies').delete().eq('id', company.id), `${company.name} eliminada.`);
                        }
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <AttendeesTable attendees={data.attendees} />
      </div>
    </TicketShell>
  );
}

type CompanyRowProps = {
  company: Company;
  issued: number;
  registered: number;
  busyKey: string;
  onSaveQuota: (quota: number) => void;
  onGenerate: (count: number) => void;
  onExport: () => void;
  onDelete: () => void;
};

function CompanyRow({ company, issued, registered, busyKey, onSaveQuota, onGenerate, onExport, onDelete }: CompanyRowProps) {
  const [quota, setQuota] = useState(String(company.quota));
  const pending = company.quota - issued;
  const quotaChanged = Number(quota) !== company.quota;

  return (
    <tr className="border-b last:border-b-0 align-middle" style={{ borderColor: '#222222' }}>
      <th scope="row" className="px-5 py-3 font-normal" style={{ color: '#FFFFFF' }}>{company.name}</th>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            type="number" min={Math.max(issued, 1)} value={quota} onChange={(e) => setQuota(e.target.value)}
            aria-label={`Cupo de ${company.name}`} name={`cupo-${company.id}`}
            className={`w-20 min-h-11 rounded-lg border px-2 bg-transparent tabular-nums ${focusRing}`} style={{ borderColor: '#333333', color: '#FFFFFF' }}
          />
          {quotaChanged && (
            <button type="button" onClick={() => onSaveQuota(Number(quota))} disabled={busyKey === `quota-${company.id}`} className={`min-h-11 px-2 rounded text-sm ${focusRing}`} style={{ color: GOLD }}>Guardar</button>
          )}
        </div>
      </td>
      <td className="px-3 py-3 tabular-nums" style={{ color: TEXT_MUTED }}>{issued} / {company.quota}</td>
      <td className="px-3 py-3 tabular-nums" style={{ color: TEXT_MUTED }}>{registered}</td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-2 whitespace-nowrap">
          {pending > 0 && (
            <button type="button" onClick={() => onGenerate(pending)} disabled={busyKey === `gen-${company.id}`} className={`inline-flex items-center gap-1.5 ${secondaryButton}`} style={{ borderColor: GOLD, color: GOLD }}>
              <KeyRound className="w-4 h-4" aria-hidden="true" />Generar {pending}
            </button>
          )}
          {issued > 0 && (
            <button type="button" onClick={onExport} className={`inline-flex items-center gap-1.5 ${secondaryButton}`} style={{ borderColor: '#333333', color: TEXT_MUTED }}>
              <Download className="w-4 h-4" aria-hidden="true" />CSV
            </button>
          )}
          {registered === 0 && (
            <button type="button" onClick={onDelete} aria-label={`Eliminar ${company.name}`} className={`inline-flex items-center justify-center w-11 ${secondaryButton} px-0`} style={{ borderColor: '#333333', color: TEXT_SUBTLE }}>
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
