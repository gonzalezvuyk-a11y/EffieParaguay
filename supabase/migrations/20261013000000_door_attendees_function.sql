-- Door devices only need to find a guest and check them in. This returns just
-- the columns required for that, so email, phone, job title and ticket_token
-- stay out of reach of door accounts once attendees is restricted to admins.
create function public.door_attendees()
returns table (
  id uuid,
  first_name text,
  last_name text,
  company text,
  checked_in_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select a.id, a.first_name, a.last_name, a.company, a.checked_in_at
  from public.attendees a
  where public.is_staff()
  order by a.last_name;
$$;

revoke execute on function public.door_attendees() from public, anon;
grant execute on function public.door_attendees() to authenticated;
