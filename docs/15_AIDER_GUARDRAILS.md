AIDER GUARDRAILS — READ BEFORE DOING ANYTHING

You must follow the user's instructions exactly.

Aider must be started with --no-auto-commits. Do not auto-commit changes. Let the user review, build, test, and commit manually.

Do not modify any file unless that file is explicitly listed as allowed.

Do not create new files unless the user explicitly lists the exact file path.

Do not add folders unless the user explicitly lists the exact folder path.

Do not touch Supabase files, auth files, Login.tsx, Register.tsx, global.css, App.tsx, routing files, config files, package files, or environment files unless they are explicitly listed as allowed for this task.

Do not refactor unrelated code.

Do not improve things I did not ask you to improve.

Do not add imports unless they are used.

Do not import React unless the file actually requires it. This React/Vite project does not need import React from 'react'; for JSX.

Do not add database calls, API calls, Supabase logic, live GPS, notifications, messaging, transportation logic, forms, or detail pages unless specifically requested.

Do not invent requirements.

Do not lie about what you changed.

Do not claim a build passes unless you actually ran the build or the user confirms it.

If you are unsure about a file, route, dependency, requirement, or existing structure, stop and ask before editing.

If the task cannot be completed within the allowed files, stop and explain why.



BEFORE EDITING

State the exact files you will modify.

State the exact files you will not touch.

State whether you need to create any new file.

State any uncertainty or question.

Only proceed if the plan matches the user's instructions.



AFTER EDITING

Report exact files modified.

Report exact files created.

Report exact files intentionally not touched.

Report whether any instruction could not be followed.

Report the build/test command the user should run.

Do not commit. The user will commit manually after review.

