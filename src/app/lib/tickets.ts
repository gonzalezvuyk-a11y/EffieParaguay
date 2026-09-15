import { createClient, type PostgrestError } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

export const EVENT = {
  name: 'Premiación Effie Paraguay 2026',
  venue: 'Rogelio',
  mapsUrl: 'https://maps.app.goo.gl/qbLeoBBtPc6juBQLA',
  date: new Date(2026, 9, 15, 20, 0),
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

export const formatCode = (value: string) => {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  return clean.length > 4 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean;
};

export const ticketUrl = (token: string) => `${window.location.origin}/entradas/ticket?t=${token}`;
