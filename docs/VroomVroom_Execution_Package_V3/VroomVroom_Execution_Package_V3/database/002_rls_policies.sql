-- Vroom Vroom MVP RLS Policies v1.3
-- Run after 001_initial_schema.sql.
-- Location: Supabase Dashboard > SQL Editor > New query.

alter table public.user_profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.children enable row level security;
alter table public.emergency_contacts enable row level security;
alter table public.child_team_memberships enable row level security;
alter table public.events enable row level security;
alter table public.attendance_responses enable row level security;
alter table public.vehicles enable row level security;
alter table public.ride_requests enable row level security;
alter table public.ride_offers enable row level security;
alter table public.ride_assignments enable row level security;
alter table public.driver_locations enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.safety_reports enable row level security;
alter table public.ratings enable row level security;
alter table public.audit_logs enable row level security;

create policy "read own profile" on public.user_profiles for select using (auth_user_id = auth.uid());
create policy "update own profile" on public.user_profiles for update using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());

create policy "members view organizations" on public.organizations for select using (
  id in (select organization_id from public.organization_members om join public.user_profiles up on up.id = om.user_id where up.auth_user_id = auth.uid())
);

create policy "members view organization memberships" on public.organization_members for select using (
  user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  or organization_id in (select organization_id from public.organization_members om join public.user_profiles up on up.id = om.user_id where up.auth_user_id = auth.uid())
);

create policy "team members view teams" on public.teams for select using (
  id in (select team_id from public.team_members tm join public.user_profiles up on up.id = tm.user_id where up.auth_user_id = auth.uid())
);

create policy "team members view memberships" on public.team_members for select using (
  team_id in (select team_id from public.team_members tm join public.user_profiles up on up.id = tm.user_id where up.auth_user_id = auth.uid())
);

create policy "parents manage own children" on public.children for all using (
  parent_id in (select id from public.user_profiles where auth_user_id = auth.uid())
) with check (
  parent_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "parents manage own emergency contacts" on public.emergency_contacts for all using (
  child_id in (select c.id from public.children c join public.user_profiles up on up.id = c.parent_id where up.auth_user_id = auth.uid())
) with check (
  child_id in (select c.id from public.children c join public.user_profiles up on up.id = c.parent_id where up.auth_user_id = auth.uid())
);

create policy "parents view child team memberships" on public.child_team_memberships for select using (
  child_id in (select c.id from public.children c join public.user_profiles up on up.id = c.parent_id where up.auth_user_id = auth.uid())
);

create policy "team members view events" on public.events for select using (
  team_id in (select tm.team_id from public.team_members tm join public.user_profiles up on up.id = tm.user_id where up.auth_user_id = auth.uid())
);

create policy "parents manage own attendance" on public.attendance_responses for all using (
  child_id in (select c.id from public.children c join public.user_profiles up on up.id = c.parent_id where up.auth_user_id = auth.uid())
) with check (
  child_id in (select c.id from public.children c join public.user_profiles up on up.id = c.parent_id where up.auth_user_id = auth.uid())
);

create policy "drivers manage own vehicles" on public.vehicles for all using (
  driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
) with check (
  driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "parents manage own ride requests" on public.ride_requests for all using (
  parent_id in (select id from public.user_profiles where auth_user_id = auth.uid())
) with check (
  parent_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "drivers manage own offers" on public.ride_offers for all using (
  driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
) with check (
  driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "assigned parent or driver view ride assignments" on public.ride_assignments for select using (
  driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  or ride_request_id in (select rr.id from public.ride_requests rr join public.user_profiles up on up.id = rr.parent_id where up.auth_user_id = auth.uid())
);

create policy "assigned drivers insert own active gps locations" on public.driver_locations for insert with check (
  driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  and ride_assignment_id in (
    select ra.id from public.ride_assignments ra
    where ra.driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
      and ra.assignment_status in ('confirmed','en_route','arrived','verified','boarded','in_transit')
  )
);

create policy "assigned users view gps locations" on public.driver_locations for select using (
  ride_assignment_id in (
    select ra.id from public.ride_assignments ra
    where ra.driver_id in (select id from public.user_profiles where auth_user_id = auth.uid())
       or ra.ride_request_id in (select rr.id from public.ride_requests rr join public.user_profiles up on up.id = rr.parent_id where up.auth_user_id = auth.uid())
  )
);

create policy "conversation participants view conversations" on public.conversations for select using (
  id in (select cp.conversation_id from public.conversation_participants cp join public.user_profiles up on up.id = cp.user_id where up.auth_user_id = auth.uid())
);

create policy "conversation participants view participants" on public.conversation_participants for select using (
  conversation_id in (select cp.conversation_id from public.conversation_participants cp join public.user_profiles up on up.id = cp.user_id where up.auth_user_id = auth.uid())
);

create policy "conversation participants view messages" on public.messages for select using (
  conversation_id in (select cp.conversation_id from public.conversation_participants cp join public.user_profiles up on up.id = cp.user_id where up.auth_user_id = auth.uid())
);

create policy "conversation participants send messages" on public.messages for insert with check (
  sender_id in (select id from public.user_profiles where auth_user_id = auth.uid())
  and conversation_id in (select cp.conversation_id from public.conversation_participants cp join public.user_profiles up on up.id = cp.user_id where up.auth_user_id = auth.uid())
);

create policy "users view own notifications" on public.notifications for select using (
  user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "users update own notifications" on public.notifications for update using (
  user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
) with check (
  user_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "users create own safety reports" on public.safety_reports for insert with check (
  reporter_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "users view own safety reports" on public.safety_reports for select using (
  reporter_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

create policy "users create ratings they own" on public.ratings for insert with check (
  reviewer_id in (select id from public.user_profiles where auth_user_id = auth.uid())
);

-- Audit logs are not exposed to regular users in MVP.
-- Admin audit access should be implemented via admin-only Edge Functions.