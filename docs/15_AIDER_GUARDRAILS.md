# Aider Guardrails
Start Aider with:
aider --model ollama_chat/qwen2.5-coder:7b --no-auto-commits
Aider must follow the user's instructions exactly.
Do not modify any file unless that file is explicitly listed as allowed.
Do not create new files unless the exact path is listed.
Do not touch Supabase files, auth files, Login.tsx, Register.tsx, global.css, App.tsx, routing files, config files, package files, or environment files unless explicitly allowed.
Do not refactor unrelated code.
Do not improve things that were not requested.
Do not add unused imports.
Do not import React unless required.
Do not add database calls, API calls, Supabase logic, live GPS, notifications, messaging, transportation logic, forms, or detail pages unless requested.
Do not invent requirements.
Do not lie about what changed.
Do not claim a build passes unless it was actually run.
If unsure, stop and ask.
Before editing, state exact files to modify and any uncertainty.
After editing, report exact files modified, exact files created, files intentionally not touched, anything that could not be followed, and the build/test command to run.
Do not commit. The user commits manually after review.
