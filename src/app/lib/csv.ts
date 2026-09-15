const escapeCell = (value: string | number | null | undefined) => {
  const text = value === null || value === undefined ? '' : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** Builds a UTF-8 CSV (with BOM so Excel keeps accents) and triggers a download. */
export const downloadCsv = (filename: string, header: string[], rows: (string | number | null)[][]) => {
  const content = [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');
  const blob = new Blob([`﻿${content}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const formatDateTime = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat('es-PY', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
    : '';
