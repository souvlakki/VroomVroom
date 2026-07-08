Create or replace this file:



C:\\Projects\\VroomVroom\\AGENTS.md



Use the content below exactly.



\# VroomVroom Codex Guardrails



\## Project Identity



This project is VroomVroom.



VroomVroom is a parent-focused carpool / ride-sharing web application for parents and children attending the same event, practice, activity, school function, or team event.



The project root is:



C:\\Projects\\VroomVroom



The frontend is usually here:



C:\\Projects\\VroomVroom\\frontend



\## Primary Rule



Do only the task Nicolas explicitly asks for.



Do not expand the task.

Do not redesign unrelated areas.

Do not refactor unrelated files.

Do not rename files, folders, components, routes, or database fields unless Nicolas explicitly asks.

Do not delete code unless Nicolas explicitly asks or the code is clearly dead and you explain it first.



\## Ask Before Acting



Ask Nicolas before doing anything that would:



1\. Modify database schema or Supabase SQL.

2\. Change authentication logic.

3\. Change route protection.

4\. Change environment variables.

5\. Add a new dependency.

6\. Remove a dependency.

7\. Delete a file.

8\. Rename a file.

9\. Move a folder.

10\. Change project structure.

11\. Commit to git.

12\. Push to GitHub.

13\. Change UI behaviour outside the requested area.



\## Honesty Rule



Do not pretend to have checked a file if you did not read it.



Do not say something is fixed unless you actually changed the relevant file.



Do not guess silently.



If unsure, say:



"I am not sure yet. I need to inspect the relevant file first."



\## File Inspection Rule



Before changing a file, inspect the current file first.



Before fixing a bug, inspect all directly related files.



For authentication work, inspect at minimum:



C:\\Projects\\VroomVroom\\frontend\\src\\services\\authService.ts

C:\\Projects\\VroomVroom\\frontend\\src\\stores\\authStore.ts

C:\\Projects\\VroomVroom\\frontend\\src\\components\\Auth\\Login.tsx

C:\\Projects\\VroomVroom\\frontend\\src\\components\\Auth\\ProtectedRoute.tsx



\## Output Style for Nicolas



Use simple step-by-step language.



When giving Nicolas commands, include the full working directory.



Prefer one-line commands.



Prefer copy-paste blocks.



Do not make Nicolas manually edit long files if you can update the file yourself.



When giving a task instruction, start with the actor name.



Example:



Nicolas: run this in PowerShell from C:\\Projects\\VroomVroom\\frontend



\## Coding Style



Use TypeScript.



Keep code readable and boring.



Prefer small, focused changes.



Avoid clever abstractions unless they clearly reduce complexity.



Preserve existing styling patterns.



Preserve existing folder structure.



Preserve VroomVroom UI icons when they are functional. Do not remove functional UI icons just because of a general no-icons preference.



\## Frontend Stack



The intended frontend stack is:



React

Vite

TypeScript

Tailwind CSS

TanStack Query

Zustand

@supabase/supabase-js



\## Supabase Rules



Do not run or generate destructive SQL unless Nicolas explicitly asks.



Do not modify RLS policies unless Nicolas explicitly asks.



Do not change Supabase project URL or anon key unless Nicolas explicitly asks.



The Supabase URL must use the base project URL, not the REST endpoint.



Correct format:



https://PROJECT.supabase.co



Wrong format:



https://PROJECT.supabase.co/rest/v1/



\## Authentication Rules



Google OAuth must redirect back to the running local Vite app.



Use window.location.origin when possible for local redirects.



Example:



const redirectTo = `${window.location.origin}/profile`;



Do not hardcode plain http://localhost without a port.



Do not assume the port is always 5173. Vite may use 5174 if 5173 is busy.



Authentication state must be loaded before protected routes decide whether to redirect to /login.



Do not modify any other files.
Do not run database changes.
Do not change authentication code.
Do not commit.
Do not push.

\## Testing Rule



After frontend changes, run the appropriate check from:



C:\\Projects\\VroomVroom\\frontend



Preferred commands:



npm run build



If available:



npm run lint

npm run typecheck



If a command fails, report the exact error and the file causing it.



\## Git Rule



Do not commit automatically.



Do not push automatically.



If Nicolas asks to save work, first show the changed files and suggest a commit message.



\## Response After Changes



After changing files, report:



1\. Files changed.

2\. What changed.

3\. Why it changed.

4\. What Nicolas should run next.

5\. Any risk or thing to verify.



Keep it short.

