create extension if not exists pgcrypto with schema extensions;

create table public.event_settings (
  id boolean primary key default true check (id),
  global_capacity integer not null check (global_capacity > 0),
  updated_at timestamptz not null default now()
);

insert into public.event_settings (global_capacity) values (300);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (length(trim(name)) between 1 and 120),
  quota integer not null check (quota > 0),
  created_at timestamptz not null default now()
);

create table public.invitation_codes (
  code text primary key,
  company_id uuid not null references public.companies (id) on delete cascade,
  created_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create index invitation_codes_company_id_idx on public.invitation_codes (company_id);

create table public.attendees (
  id uuid primary key default gen_random_uuid(),
  code text not null unique references public.invitation_codes (code),
  company_id uuid not null references public.companies (id),
  first_name text not null,
  last_name text not null,
  email text not null,
  company text not null,
  job_title text not null,
  phone text not null,
  ticket_token uuid not null unique default gen_random_uuid(),
  email_sent_at timestamptz,
  checked_in_at timestamptz,
  checked_in_by text,
  created_at timestamptz not null default now()
);

create index attendees_company_id_idx on public.attendees (company_id);

create table public.staff (
  email text primary key check (email = lower(email))
);

alter table public.event_settings enable row level security;
alter table public.companies enable row level security;
alter table public.invitation_codes enable row level security;
alter table public.attendees enable row level security;
alter table public.staff enable row level security;

create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

create function public.normalize_code(p_code text)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when length(regexp_replace(upper(coalesce(p_code, '')), '[^A-Z0-9]', '', 'g')) = 8
      then substr(regexp_replace(upper(p_code), '[^A-Z0-9]', '', 'g'), 1, 4) || '-' ||
           substr(regexp_replace(upper(p_code), '[^A-Z0-9]', '', 'g'), 5, 4)
    else regexp_replace(upper(coalesce(p_code, '')), '[^A-Z0-9-]', '', 'g')
  end;
$$;

-- Sum of company quotas can never exceed the venue capacity.
create function public.enforce_capacity()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_total integer;
  v_capacity integer;
begin
  select global_capacity into v_capacity from public.event_settings;
  select coalesce(sum(quota), 0) into v_total from public.companies;
  if v_total > v_capacity then
    raise exception 'CAPACITY_EXCEEDED: los cupos asignados (%) superan la capacidad total (%)', v_total, v_capacity
      using errcode = 'check_violation';
  end if;
  return null;
end;
$$;

create trigger companies_enforce_capacity
after insert or update of quota on public.companies
for each statement execute function public.enforce_capacity();

create trigger event_settings_enforce_capacity
after update of global_capacity on public.event_settings
for each statement execute function public.enforce_capacity();

create function public.enforce_quota_not_below_codes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.quota < (select count(*) from public.invitation_codes where company_id = new.id) then
    raise exception 'QUOTA_BELOW_CODES: ya hay más códigos generados que el nuevo cupo'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger companies_quota_not_below_codes
before update of quota on public.companies
for each row execute function public.enforce_quota_not_below_codes();

create policy "staff read settings" on public.event_settings
  for select to authenticated using ((select public.is_staff()));
create policy "staff update settings" on public.event_settings
  for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));

create policy "staff read companies" on public.companies
  for select to authenticated using ((select public.is_staff()));
create policy "staff insert companies" on public.companies
  for insert to authenticated with check ((select public.is_staff()));
create policy "staff update companies" on public.companies
  for update to authenticated using ((select public.is_staff())) with check ((select public.is_staff()));
create policy "staff delete companies without registrations" on public.companies
  for delete to authenticated using (
    (select public.is_staff())
    and not exists (select 1 from public.attendees a where a.company_id = companies.id)
  );

create policy "staff read codes" on public.invitation_codes
  for select to authenticated using ((select public.is_staff()));
create policy "staff delete unused codes" on public.invitation_codes
  for delete to authenticated using ((select public.is_staff()) and redeemed_at is null);

create policy "staff read attendees" on public.attendees
  for select to authenticated using ((select public.is_staff()));

create function public.generate_codes(p_company_id uuid, p_count integer)
returns setof text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_quota integer;
  v_issued integer;
  v_raw text;
  v_code text;
  v_created integer := 0;
begin
  if not public.is_staff() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  if p_count is null or p_count < 1 then
    raise exception 'INVALID_COUNT';
  end if;

  select quota into v_quota from public.companies where id = p_company_id for update;
  if not found then
    raise exception 'COMPANY_NOT_FOUND';
  end if;

  select count(*) into v_issued from public.invitation_codes where company_id = p_company_id;
  if v_issued + p_count > v_quota then
    raise exception 'QUOTA_EXCEEDED: quedan % códigos disponibles para esta empresa', v_quota - v_issued;
  end if;

  while v_created < p_count loop
    v_raw := '';
    for i in 1..8 loop
      v_raw := v_raw || substr(v_alphabet, 1 + (get_byte(extensions.gen_random_bytes(1), 0) % 32), 1);
    end loop;
    v_code := substr(v_raw, 1, 4) || '-' || substr(v_raw, 5, 4);
    insert into public.invitation_codes (code, company_id) values (v_code, p_company_id)
      on conflict (code) do nothing;
    if found then
      v_created := v_created + 1;
      return next v_code;
    end if;
  end loop;
end;
$$;

create function public.check_code(p_code text)
returns table (company_name text)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_redeemed timestamptz;
  v_company text;
begin
  select ic.redeemed_at, c.name into v_redeemed, v_company
  from public.invitation_codes ic
  join public.companies c on c.id = ic.company_id
  where ic.code = public.normalize_code(p_code);

  if v_company is null then
    raise exception 'CODE_NOT_FOUND';
  end if;
  if v_redeemed is not null then
    raise exception 'CODE_USED';
  end if;

  company_name := v_company;
  return next;
end;
$$;

create function public.register_attendee(
  p_code text,
  p_first_name text,
  p_last_name text,
  p_email text,
  p_company text,
  p_job_title text,
  p_phone text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text := public.normalize_code(p_code);
  v_company_id uuid;
  v_redeemed timestamptz;
  v_token uuid;
begin
  if length(trim(coalesce(p_first_name, ''))) not between 1 and 80
    or length(trim(coalesce(p_last_name, ''))) not between 1 and 80
    or length(trim(coalesce(p_company, ''))) not between 1 and 120
    or length(trim(coalesce(p_job_title, ''))) not between 1 and 120
    or trim(coalesce(p_email, '')) !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    or length(trim(p_email)) > 254
    or length(regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g')) not between 6 and 15
  then
    raise exception 'INVALID_DATA';
  end if;

  select company_id, redeemed_at into v_company_id, v_redeemed
  from public.invitation_codes
  where code = v_code
  for update;

  if v_company_id is null then
    raise exception 'CODE_NOT_FOUND';
  end if;
  if v_redeemed is not null then
    raise exception 'CODE_USED';
  end if;

  insert into public.attendees (code, company_id, first_name, last_name, email, company, job_title, phone)
  values (
    v_code, v_company_id, trim(p_first_name), trim(p_last_name), lower(trim(p_email)),
    trim(p_company), trim(p_job_title), trim(p_phone)
  )
  returning ticket_token into v_token;

  update public.invitation_codes set redeemed_at = now() where code = v_code;

  return v_token;
end;
$$;

create function public.get_ticket(p_token uuid)
returns table (
  first_name text,
  last_name text,
  company text,
  job_title text,
  code text,
  checked_in_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select a.first_name, a.last_name, a.company, a.job_title, a.code, a.checked_in_at
  from public.attendees a
  where a.ticket_token = p_token;
$$;

create function public.check_in(p_attendee_id uuid default null, p_token uuid default null)
returns table (
  attendee_id uuid,
  first_name text,
  last_name text,
  company text,
  checked_in_at timestamptz,
  already_checked_in boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.attendees%rowtype;
begin
  if not public.is_staff() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  select * into v_row from public.attendees a
  where (p_attendee_id is not null and a.id = p_attendee_id)
     or (p_token is not null and a.ticket_token = p_token)
  for update;

  if not found then
    raise exception 'TICKET_NOT_FOUND';
  end if;

  already_checked_in := v_row.checked_in_at is not null;
  if not already_checked_in then
    update public.attendees
    set checked_in_at = now(), checked_in_by = lower(auth.jwt() ->> 'email')
    where id = v_row.id
    returning attendees.checked_in_at into v_row.checked_in_at;
  end if;

  attendee_id := v_row.id;
  first_name := v_row.first_name;
  last_name := v_row.last_name;
  company := v_row.company;
  checked_in_at := v_row.checked_in_at;
  return next;
end;
$$;

create function public.undo_check_in(p_attendee_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_staff() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;
  update public.attendees set checked_in_at = null, checked_in_by = null where id = p_attendee_id;
end;
$$;

revoke all on all tables in schema public from anon;
revoke execute on all functions in schema public from public, anon, authenticated;

grant execute on function public.check_code(text) to anon, authenticated;
grant execute on function public.register_attendee(text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.get_ticket(uuid) to anon, authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.generate_codes(uuid, integer) to authenticated;
grant execute on function public.check_in(uuid, uuid) to authenticated;
grant execute on function public.undo_check_in(uuid) to authenticated;
