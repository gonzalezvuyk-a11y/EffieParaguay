create function public.delete_attendee(p_attendee_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text;
begin
  if not public.is_staff() then
    raise exception 'FORBIDDEN' using errcode = '42501';
  end if;

  delete from public.attendees where id = p_attendee_id returning code into v_code;
  if v_code is null then
    raise exception 'TICKET_NOT_FOUND';
  end if;

  update public.invitation_codes set redeemed_at = null where code = v_code;
end;
$$;

grant execute on function public.delete_attendee(uuid) to authenticated;
