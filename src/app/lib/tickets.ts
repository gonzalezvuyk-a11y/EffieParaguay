import { createClient, type PostgrestError } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const EVENT = {
  name: 'Premiación Effie Paraguay 2026',
  venue: 'Rogelio',
  mapsUrl: 'https://maps.app.goo.gl/qbLeoBBtPc6juBQLA',
  date: new Date(2026, 9, 15, 19, 30),
  dressCode: 'Business casual',
  priceUsd: 100,
};

export const eventDateLabel = new Intl.DateTimeFormat('es-PY', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(EVENT.date);

export const eventTimeLabel = new Intl.DateTimeFormat('es-PY', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
}).format(EVENT.date);

export const priceLabel = new Intl.NumberFormat('es-PY', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(EVENT.priceUsd);

export type AttendeeInput = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone: string;
};

export type Ticket = {
  first_name: string;
  last_name: string;
  company: string;
  job_title: string;
  code: string;
  checked_in_at: string | null;
};

const ERROR_MESSAGES: Record<string, string> = {
  CODE_NOT_FOUND: 'Ese código no existe. Revisá que esté bien escrito, por ejemplo ABCD-2345.',
  CODE_USED: 'Ese código ya se usó. Cada código sirve para una sola entrada; pedile uno nuevo a tu empresa.',
  INVALID_DATA: 'Revisá los datos: todos los campos son obligatorios y el correo y el celular tienen que ser válidos.',
  QUOTA_EXCEEDED: 'No quedan códigos disponibles en el cupo de esta empresa.',
  CAPACITY_EXCEEDED: 'Los cupos asignados superan la capacidad total del evento.',
  QUOTA_BELOW_CODES: 'El cupo no puede ser menor que la cantidad de códigos ya generados.',
  TICKET_NOT_FOUND: 'No encontramos esa entrada.',
  FORBIDDEN: 'Tu usuario no tiene permiso para esta acción.',
  NOT_DELETED: 'No se pudo eliminar: ya cambió (alguien lo usó o lo borró). Actualizamos la lista.',
};

export const errorMessage = (error: PostgrestError | Error | null | undefined) => {
  if (!error) return '';
  const key = Object.keys(ERROR_MESSAGES).find((code) => error.message.includes(code));
  if (key) return ERROR_MESSAGES[key];
  if (error.message.includes('duplicate key') && error.message.includes('companies_name')) {
    return 'Ya existe una empresa con ese nombre.';
  }
  return 'Algo falló al conectar. Revisá tu conexión e intentá de nuevo.';
};

export const FIELD_LABELS: Record<keyof AttendeeInput, string> = {
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'Correo',
  phone: 'Celular',
  company: 'Empresa',
  jobTitle: 'Cargo',
};

// Mirrors the checks in the register_attendee RPC so people see which field to fix.
export const findInvalidFields = (attendee: AttendeeInput) => {
  const phoneDigits = attendee.phone.replace(/\D/g, '').length;
  const checks: Array<[keyof AttendeeInput, boolean]> = [
    ['firstName', attendee.firstName.trim() !== ''],
    ['lastName', attendee.lastName.trim() !== ''],
    ['email', /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(attendee.email.trim())],
    ['phone', phoneDigits >= 6 && phoneDigits <= 15],
    ['company', attendee.company.trim() !== ''],
    ['jobTitle', attendee.jobTitle.trim() !== ''],
  ];
  return checks.filter(([, isValid]) => !isValid).map(([field]) => field);
};

// A delete blocked by RLS returns no error and zero rows; treat that as a failure.
export const deleteExpectingRows = async (
  query: PromiseLike<{ data: unknown[] | null; error: { message: string } | null }>
) => {
  const { data, error } = await query;
  if (error) return { error };
  if (!data || data.length === 0) return { error: { message: 'NOT_DELETED' } };
  return { error: null };
};

export const formatCode = (value: string) => {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  return clean.length > 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean;
};

export const ticketUrl = (token: string) => `${window.location.origin}/entradas/ticket?t=${token}`;
