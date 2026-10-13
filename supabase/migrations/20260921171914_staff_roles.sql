alter table public.staff add column role text not null default 'admin' check (role in ('admin', 'door'));

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff where email = lower(coalesce(auth.jwt() ->> 'email', '')) and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;

-- Company/code management and other-user management are admin-only; check-in stays open to any staff.
drop policy "staff read companies" on public.companies;
create policy "admin read companies" on public.companies
  for select to authenticated using ((select public.is_admin()));

drop policy "staff insert companies" on public.companies;
create policy "admin insert companies" on public.companies
  for insert to authenticated with check ((select public.is_admin()));

drop policy "staff update companies" on public.companies;
create policy "admin update companies" on public.companies
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy "staff delete companies without registrations" on public.companies;
create policy "admin delete companies without registrations" on public.companies
  for delete to authenticated using (
    (select public.is_admin())
    and not exists (select 1 from public.attendees a where a.company_id = companies.id)
  );

drop policy "staff read codes" on public.invitation_codes;
create policy "admin read codes" on public.invitation_codes
  for select to authenticated using ((select public.is_admin()));

drop policy "staff delete unused codes" on public.invitation_codes;
create policy "admin delete unused codes" on public.invitation_codes
  for delete to authenticated using ((select public.is_admin()) and redeemed_at is null);

drop policy "staff read attendees" on public.attendees;
create policy "staff read attendees" on public.attendees
  for select to authenticated using ((select public.is_staff()));

drop policy "staff read settings" on public.event_settings;
create policy "admin read settings" on public.event_settings
  for select to authenticated using ((select public.is_admin()));

drop policy "staff update settings" on public.event_settings;
create policy "admin update settings" on public.event_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Admins can see and manage the staff roster itself.
create policy "admin read staff" on public.staff
  for select to authenticated using ((select public.is_admin()));
create policy "admin delete staff" on public.staff
  for delete to authenticated using ((select public.is_admin()) and email <> lower(coalesce(auth.jwt() ->> 'email', '')));

-- generate_codes and delete_attendee move from is_staff() to is_admin().
create or replace function public.generate_codes(p_company_id uuid, p_count integer)
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
  if not public.is_admin() then
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

create or replace function public.delete_attendee(p_attendee_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text;
begin
  if not public.is_admin() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  delete from public.attendees where id = p_attendee_id returning code into v_code;
  if v_code is null then
    raise exception 'TICKET_NOT_FOUND';
  end if;

  update public.invitation_codes set redeemed_at = null where code = v_code;
end;
$$;

-- Staff roster: current signed-in staff member's own row (email + role), for gating the UI.
create function public.my_staff_role()
returns table (role text)
language sql
stable
security definer
set search_path = ''
as $$
  select s.role from public.staff s where s.email = lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

grant execute on function public.my_staff_role() to authenticated;
