Create or replace this file:



C:\\Projects\\VroomVroom\\docs\\01\_PROJECT\_SPECIFICATION.md



Use the content below exactly.



\# VroomVroom Project Specification



\## Product Name



VroomVroom



\## Product Summary



VroomVroom is a web application that helps parents coordinate rides for children attending the same event, activity, practice, game, class, school function, or team event.



The main purpose is to reduce confusion around who is driving, who is riding, where pickup happens, when pickup happens, how many passenger seats are available, and whether parents have confirmed.



\## Core Concept



The top-level entity is the Event.



This is intentional.



Parents think in terms of calendar events first:



Practice on Monday.

Game on Saturday.

School activity next week.

Tournament this weekend.



VroomVroom should feel like a lightweight event calendar with transportation coordination attached to each event.



\## Main Users



\### Parent



A parent can:



Register.

Log in.

Add their address.

Add children.

View upcoming events.

Select events their child will attend.

Offer to drive.

Join another parent's ride.

Confirm transportation details.

Receive reminders or confirmations.



\### Driver Parent



A driver parent can:



Offer available seats.

See who is riding.

Manage pickup details.

Confirm the trip.

Share location when appropriate.

Control whether live tracking is enabled.



\### Admin / Organizer



An admin or organizer can:



Create future calendar events.

Manage events.

Eventually manage organizations, teams, and visibility rules.



For MVP, keep admin functionality simple.



\## MVP Direction



The MVP should focus on the skeleton first.



Do not overbuild.



The first useful version should allow:



1\. Parent authentication.

2\. Parent profile.

3\. Child profile.

4\. Event list or event calendar.

5\. Admin-created events.

6\. Parent selection of an event.

7\. Basic ride coordination for an event.

8\. Driver assignment or driver offer.

9\. Passenger count.

10\. Basic confirmation state.



\## Important Product Decisions Already Made



\### Event as Top-Level Entity



The Event is the main object.



Organizations and teams may exist, but they should not dominate the first UX.



\### Visibility Rules Deferred



Complex organization/team visibility rules are deferred.



Do not overcomplicate the MVP with advanced permissions unless explicitly requested.



\### Pilot First



The product should start with a pilot use case before expanding.



Build in a way that can support more organizations and teams later, but do not overbuild too early.



\### UX Should Be Light



The user experience should be simple, intuitive, and calendar-like.



Parents should not need training.



Avoid complex dashboards unless necessary.



\### Event-Day Indicators



The calendar or event list should show urgency or status on the event day so parents can plan ahead.



Examples:



Needs driver

Driver confirmed

Seats available

Ride full

Pickup pending

Confirmed



\## Transportation Model



Each event can have ride coordination.



A ride should eventually include:



Driver

Vehicle capacity

Available seats

Passengers

Pickup locations

Pickup times

Confirmation status

Notes

Optional route/map

Optional live location sharing



Passenger count excludes the driver.



Confirmed passengers must not exceed vehicle capacity.



\## Mapping Direction



Use a free or low-cost mapping option where possible.



Avoid Google Maps as the default if there is a free alternative.



Possible future options may include:



OpenStreetMap

Leaflet

MapLibre

OSRM

Other free routing APIs



Do not implement paid map services unless Nicolas explicitly asks.



\## Live GPS Direction



Live GPS tracking is a future feature.



It should be opt-in by the driver.



Location sharing should only start when a ride assignment is active or when the driver explicitly enables it.



Do not add live GPS tracking to the MVP unless Nicolas explicitly asks.



\## Notification Direction



The product should eventually support:



Email confirmations.

Text/SMS confirmations.

Configurable reminders before an event.

Driver/passenger confirmation messages.



For MVP, notifications can be planned but do not need to be fully built unless requested.



\## Technical Stack



Frontend:



React

Vite

TypeScript

Tailwind CSS

TanStack Query

Zustand

@supabase/supabase-js



Backend / Data:



Supabase

PostgreSQL

Supabase Auth

Supabase Row Level Security



\## Expected Frontend Folder Direction



Use or preserve this general direction:



src/components

src/components/ui

src/components/Auth

src/features/auth

src/features/organizations

src/features/teams

src/features/children

src/features/events

src/features/transportation

src/features/gps

src/features/messaging

src/features/notifications

src/features/safety

src/features/admin

src/lib

src/services

src/stores

src/types

src/utils



Do not reorganize these folders unless Nicolas explicitly asks.



\## Authentication Requirements



The app should support:



Email/password sign in.

User registration.

Google sign in.

Session persistence.

Protected routes.

A clean login page.

A clean register page.



Google OAuth must redirect back to the correct local Vite app URL.



Use window.location.origin for local OAuth redirects when appropriate.



Do not hardcode plain localhost without a port.



\## Register Page Requirements



The register page should eventually include:



Password visibility eye icon.

Confirm password field below the first password field.

Turnstile captcha.

Supabase-aligned password rules.

Minimum password length of 8.

Generate Strong Password button.

The button text may be shortened to "Strong".

Missing password rules become bold red after a failed signup.

Met password rules stay bold black.

Signup success message tells the user to check email for confirmation.

Google button uses Google colours.



\## Current Known Authentication Issue



Google sign-in opens the Google account picker correctly.



After account selection, the app may return to localhost but fail to progress into the logged-in app.



Likely causes to investigate:



1\. Supabase redirect URL mismatch.

2\. Google OAuth redirect mismatch.

3\. authService Google redirectTo issue.

4\. authStore not loading the Supabase session after OAuth.

5\. ProtectedRoute redirecting to /login before session loading completes.



Relevant files:



C:\\Projects\\VroomVroom\\frontend\\src\\services\\authService.ts

C:\\Projects\\VroomVroom\\frontend\\src\\stores\\authStore.ts

C:\\Projects\\VroomVroom\\frontend\\src\\components\\Auth\\Login.tsx

C:\\Projects\\VroomVroom\\frontend\\src\\components\\Auth\\ProtectedRoute.tsx



\## Build Approach



Build in small, safe steps.



Each change should be testable.



Prefer one working feature at a time.



Do not create large rewrites unless Nicolas explicitly asks.



\## Quality Bar



The app should be:



Simple.

Readable.

Maintainable.

Parent-friendly.

Safe with personal and child-related data.

Clear about confirmations and responsibilities.



Security and privacy matter because the app handles parents, children, addresses, event attendance, and transportation details.



\## What Not To Do Without Permission





Do not modify any other files.

Do not run database changes.

Do not change authentication code.

Do not commit.

Do not push.

Do not add payment features.

Do not add complex enterprise organization logic.

Do not add live GPS tracking.

Do not add paid map APIs.

Do not change Supabase schema.

Do not change RLS policies.

Do not redesign the full app.

Do not replace the stack.

Do not add backend services outside Supabase.

