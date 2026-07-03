# Project Constitution

## Purpose

This constitution defines the mandatory engineering principles for the
VroomVroom project. Every developer, AI agent, and automation must
follow these rules.

## 1. Safety First

-   Never delete working functionality without explicit approval.
-   Never overwrite code when a safe incremental change is possible.
-   Preserve backward compatibility whenever practical.

## 2. Build Before Commit

-   Every change must compile successfully.
-   Resolve build errors before considering a task complete.

## 3. Small, Reviewable Changes

-   Keep changes focused on the requested task.
-   Avoid unrelated refactoring unless approved.

## 4. Documentation is Part of the Feature

Every completed feature must update: - Relevant documentation in /docs -
Roadmap (if scope changes) - Current Sprint (if applicable) - Decisions
(for significant technical choices)

## 5. Database Rules

-   Do not modify the production database without approval.
-   Keep Supabase migrations documented.
-   Never weaken or bypass Row Level Security (RLS).

## 6. Authentication Rules

-   Maintain secure authentication.
-   Never disable CAPTCHA, OAuth, or security protections without
    approval.
-   Follow the project's password policy.

## 7. Git Rules

-   Never commit broken code.
-   Use meaningful commit messages.
-   Keep commits small and logically grouped.

## 8. UI Standards

-   Maintain a consistent, professional UI.
-   Preserve accessibility where possible.
-   Avoid unnecessary visual changes.

## 9. AI Agent Workflow

Every AI agent must: 1. Read the project documentation. 2. Understand
the request. 3. Create a plan. 4. Make the smallest safe change. 5.
Build the project. 6. Update documentation. 7. Summarize the changes. 8.
Wait for approval before final commit or deployment.

## 10. Project Priorities

1.  Stability
2.  Security
3.  Maintainability
4.  User Experience
5.  Performance
6.  New Features

## 11. Preferred Technology Stack

-   Frontend: React + TypeScript + Vite
-   Backend: Supabase Cloud
-   Source Control: Git
-   Formatter: Prettier
-   Primary AI Architect: ChatGPT
-   Local AI tools: OpenCode/Ollama (when appropriate)

## Amendment Process

This constitution is a living document. Changes require explicit
approval and should be recorded in the project's Decisions document.
