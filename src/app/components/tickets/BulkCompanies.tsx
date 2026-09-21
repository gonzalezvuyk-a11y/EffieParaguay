import { useId, useState, type FormEvent } from 'react';
import { errorMessage, supabase } from '../../lib/tickets';
import { ERROR_TEXT, GOLD, RULE, SURFACE, TEXT_MUTED, TEXT_SUBTLE, focusRing, primaryButton } from './ticketUi';

type ParsedRow = { name: string; quota: number };

/** Parses "Empresa, cupo" lines (comma, semicolon or tab separated). */
const parseRows = (text: string) => {
  const rows: ParsedRow[] = [];
  const invalid: string[] = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = line.match(/^(.*?)[\t,;]\s*(\d+)$/);
    const name = match?.[1].trim().replace(/^["']|["']$/g, '');
    const quota = match ? Number(match[2]) : NaN;
    if (!name || !Number.isInteger(quota) || quota < 1) {
      invalid.push(line);
      continue;
    }
    rows.push({ name, quota });
  }
  return { rows, invalid };
};

type BulkCompaniesProps = {
  onDone: (message: string) => void;
};

/** Bulk-loads companies with their quotas from a pasted list. */
export function BulkCompanies({ onDone }: BulkCompaniesProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const fieldId = useId();
  const hintId = useId();

  const { rows, invalid } = parseRows(text);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (rows.length === 0) {
      setError('No encontramos ninguna línea con el formato "Empresa, cupo".');
      return;
    }
    setIsBusy(true);
    const { error: upsertError } = await supabase
      .from('companies')
      .upsert(rows, { onConflict: 'name' });
    setIsBusy(false);
    if (upsertError) {
      setError(errorMessage(upsertError));
      return;
    }
    setText('');
    onDone(`${rows.length === 1 ? '1 empresa cargada' : `${rows.length} empresas cargadas`}.`);
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border p-5" style={{ backgroundColor: SURFACE, borderColor: RULE }}>
      <label htmlFor={fieldId} className="block text-sm mb-2" style={{ color: TEXT_MUTED }}>
        Cargar varias empresas de una
      </label>
      <textarea
        id={fieldId}
        name="empresas"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        spellCheck={false}
        aria-describedby={hintId}
        placeholder={'Wild Fi, 8\nOniria TBWA, 6\nBiedermann, 5'}
        className={`w-full rounded-lg border px-3 py-2 text-base bg-transparent placeholder:text-[#777777] ${focusRing}`}
        style={{ borderColor: '#333333', color: '#FFFFFF' }}
      />
      <p id={hintId} className="mt-2 text-xs" style={{ color: TEXT_SUBTLE }}>
        Una empresa por línea, con su cupo al final. Si la empresa ya existe, se actualiza su cupo.
      </p>

      <div className="mt-3 text-sm" aria-live="polite">
        {rows.length > 0 && (
          <p style={{ color: GOLD }} className="tabular-nums">
            {rows.length} {rows.length === 1 ? 'empresa' : 'empresas'} · {rows.reduce((total, row) => total + row.quota, 0)} cupos
          </p>
        )}
        {invalid.length > 0 && (
          <p style={{ color: ERROR_TEXT }}>
            {invalid.length === 1 ? 'Una línea no se entiende' : `${invalid.length} líneas no se entienden`}: {invalid.slice(0, 2).join(' / ')}
          </p>
        )}
        {error && <p role="alert" style={{ color: ERROR_TEXT }}>{error}</p>}
      </div>

      <button
        type="submit"
        disabled={isBusy || rows.length === 0}
        aria-busy={isBusy}
        className={`mt-4 w-full ${primaryButton}`}
        style={{ backgroundColor: GOLD, color: '#000000' }}
      >
        {isBusy ? 'Cargando…' : 'Cargar empresas'}
      </button>
    </form>
  );
}
