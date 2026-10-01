-- Functions added after the initial migration inherited Postgres' default of
-- EXECUTE for PUBLIC, so anonymous visitors could call my_staff_role() and
-- is_admin(). They leak nothing, but staff-only helpers should not be reachable
-- without a session, and new functions should not become public by accident.
revoke execute on function public.my_staff_role() from public, anon;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.delete_attendee(uuid) from public, anon;

grant execute on function public.my_staff_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.delete_attendee(uuid) to authenticated;

alter default privileges in schema public revoke execute on functions from public;
