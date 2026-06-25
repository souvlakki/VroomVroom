-- Vroom Vroom MVP Initial Supabase Schema v1.3
-- Includes: Live GPS Tracking (Automatic when assignment becomes active)
-- Run in Supabase Dashboard > SQL Editor > New query.
-- This script is safe to run once on a clean Supabase project.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone_number text,
  role text not null default 'parent' check (role in ('parent','driver','coach','manager','organization_admin','platform_admin','super_admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  contact_email text,
  contact_phone text,
  is_active boolean not null default true,
  created_by uuid references public.user_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('member','coach','manager','admin')),
  status text not null default 'active' check (status in ('invited','pending','active','suspended','removed')),
  joined_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  sport text,
  season text,
  age_group text,
  is_active boolean not null default true,
  created_by uuid references public.user_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  role text not null default 'parent' check (role in ('parent','driver','coach','manager','admin')),
  joined_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.user_profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  birth_year integer,
  emergency_notes text,
  medical_notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  contact_name text not null,
  relationship text not null,
  phone_number text not null,
  email text,
  priority_order integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.child_team_memberships (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (child_id, team_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  name text not null,
  description text,
  event_date date not null,
  start_time time not null,
  end_time time,
  location_name text,
  address text,
  latitude numeric,
  longitude numeric,
  status text not null default 'published' check (status in ('draft','published','open','ready','in_progress','completed','cancelled')),
  created_by uuid references public.user_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance_responses (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  attendance_status text not null default 'unknown' check (attendance_status in ('unknown','attending','not_attending')),
  transportation_status text not null default 'none' check (transportation_status in ('none','needs_ride','driving','assigned','completed')),
  pickup_note text,
  not_attending_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, child_id)
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.user_profiles(id) on delete cascade,
  make text not null,
  model text not null,
  year integer,
  color text,
  license_plate text,
  seat_capacity integer not null check (seat_capacity between 1 and 15),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ride_requests (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.user_profiles(id) on delete cascade,
  child_id uuid not null references public.children(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  pickup_address text not null,
  pickup_latitude numeric,
  pickup_longitude numeric,
  special_instructions text,
  status text not null default 'submitted' check (status in ('draft','submitted','searching','matched','accepted','confirmed','in_progress','completed','cancelled','expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ride_offers (
  id uuid primary key default gen_random_uuid(),
  ride_request_id uuid not null references public.ride_requests(id) on delete cascade,
  driver_id uuid not null references public.user_profiles(id) on delete cascade,
  vehicle_id uuid not null references public.vehicles(id),
  estimated_pickup_time timestamptz,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn','expired')),
  created_at timestamptz not null default now()
);

create table if not exists public.ride_assignments (
  id uuid primary key default gen_random_uuid(),
  ride_request_id uuid not null references public.ride_requests(id) on delete cascade,
  ride_offer_id uuid not null references public.ride_offers(id),
  driver_id uuid not null references public.user_profiles(id),
  vehicle_id uuid not null references public.vehicles(id),
  assignment_status text not null default 'confirmed' check (assignment_status in ('confirmed','en_route','arrived','verified','boarded','in_transit','completed','cancelled','expired')),
  pickup_code_hash text,
  pickup_code_expires_at timestamptz,
  gps_tracking_active boolean not null default false,
  gps_tracking_started_at timestamptz,
  gps_tracking_stopped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.driver_locations (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.user_profiles(id) on delete cascade,
  ride_assignment_id uuid not null references public.ride_assignments(id) on delete cascade,
  latitude numeric not null,
  longitude numeric not null,
  accuracy_meters numeric,
  heading_degrees numeric,
  speed_mps numeric,
  recorded_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  conversation_type text not null default 'direct' check (conversation_type in ('direct','ride','event','admin','system')),
  ride_assignment_id uuid references public.ride_assignments(id),
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.user_profiles(id),
  message_text text not null,
  attachment_url text,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  notification_type text not null,
  title text not null,
  body text not null,
  priority text not null default 'normal' check (priority in ('low','normal','high','critical')),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.safety_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.user_profiles(id),
  reported_user_id uuid references public.user_profiles(id),
  ride_assignment_id uuid references public.ride_assignments(id),
  severity text not null default 'medium' check (severity in ('low','medium','high','critical')),
  report_type text not null,
  description text not null,
  status text not null default 'open' check (status in ('open','investigating','resolved','dismissed','escalated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  ride_assignment_id uuid not null references public.ride_assignments(id) on delete cascade,
  reviewer_id uuid not null references public.user_profiles(id),
  reviewee_id uuid not null references public.user_profiles(id),
  score integer not null check (score between 1 and 5),
  comments text,
  created_at timestamptz not null default now(),
  unique (ride_assignment_id, reviewer_id, reviewee_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.user_profiles(id),
  action_type text not null,
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_profiles_auth_user_id on public.user_profiles(auth_user_id);
create index if not exists idx_children_parent_id on public.children(parent_id);
create index if not exists idx_events_team_date on public.events(team_id, event_date);
create index if not exists idx_attendance_event_child on public.attendance_responses(event_id, child_id);
create index if not exists idx_ride_requests_parent on public.ride_requests(parent_id);
create index if not exists idx_ride_requests_event on public.ride_requests(event_id);
create index if not exists idx_ride_offers_driver on public.ride_offers(driver_id);
create index if not exists idx_ride_assignments_driver on public.ride_assignments(driver_id);
create index if not exists idx_driver_locations_assignment on public.driver_locations(ride_assignment_id, recorded_at desc);
create index if not exists idx_driver_locations_driver_recorded on public.driver_locations(driver_id, recorded_at desc);
create index if not exists idx_messages_conversation_created on public.messages(conversation_id, created_at);
create index if not exists idx_notifications_user_read on public.notifications(user_id, is_read);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);

create trigger set_user_profiles_updated_at before update on public.user_profiles for each row execute function public.set_updated_at();
create trigger set_organizations_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger set_teams_updated_at before update on public.teams for each row execute function public.set_updated_at();
create trigger set_children_updated_at before update on public.children for each row execute function public.set_updated_at();
create trigger set_events_updated_at before update on public.events for each row execute function public.set_updated_at();
create trigger set_attendance_updated_at before update on public.attendance_responses for each row execute function public.set_updated_at();
create trigger set_vehicles_updated_at before update on public.vehicles for each row execute function public.set_updated_at();
create trigger set_ride_requests_updated_at before update on public.ride_requests for each row execute function public.set_updated_at();
create trigger set_ride_assignments_updated_at before update on public.ride_assignments for each row execute function public.set_updated_at();
create trigger set_safety_reports_updated_at before update on public.safety_reports for each row execute function public.set_updated_at();