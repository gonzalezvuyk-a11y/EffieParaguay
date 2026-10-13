-- Full attendee rows (email, phone, ticket_token) are for admins only; door
-- accounts use public.door_attendees() instead.
drop policy "staff read attendees" on public.attendees;
create policy "admin read attendees" on public.attendees
  for select to authenticated using ((select public.is_admin()));
