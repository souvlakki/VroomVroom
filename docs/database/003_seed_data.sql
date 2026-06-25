-- Vroom Vroom Optional Development Seed Data v1.3
-- Run only in development/test Supabase projects.
-- Do not run in production.

insert into public.organizations (name, description, contact_email)
values ('West Island FC', 'Demo youth soccer organization for Vroom Vroom.', 'demo@westislandfc.local')
on conflict (name) do nothing;