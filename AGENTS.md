# Repository Guidelines

## Project Structure & Module Organization
- Root entry: `App.tsx` (Expo), bootstrap: `index.ts`.
- Assets: `assets/` (images, icons, fonts, screenshots).
- Docs: `docs/` (setup, security, dev guides).
- Tests: place under `__tests__/unit`, `__tests__/integration`, `e2e/` (create if missing).
- New code: group by layer — `screens/`, `components/`, `services/`, `stores/`, `types/`, `utils/` (create when needed). Keep UI free of business logic; use services/stores.

## Build, Test, and Development Commands
- `npm start`: run Expo Dev Server.
- `npm run ios` | `android` | `web`: launch platform targets.
- `npm run dev`: Expo with dev-client.
- `npm run build:ios` | `build:android` | `build:all`: EAS builds.
- `npm test` | `test:watch` | `test:coverage`: run Jest.
- `npm run lint` | `lint:fix`: ESLint checks/fixes.
- `npm run type-check`: TypeScript without emit.
- `npm run format` | `format:check`: Prettier write/check.
- Helpful: `env:setup` (copy `.env.example`), `doctor` (Expo diagnostics), `validate` (type+lint+test).

## Coding Style & Naming Conventions
- Language: TypeScript (strict). Prefer explicit types and pure functions.
- Style: ESLint (`eslint-config-expo`, React/React Native plugins) + Prettier. Run `npm run lint` before PRs.
- Indentation/formatting: enforced by Prettier; do not override per-file.
- Naming: `PascalCase` components/types, `camelCase` vars/functions, `UPPER_SNAKE_CASE` env constants, `kebab-case` filenames for non-components.
- Modules: one component per file; collocate tests as `Component.test.tsx` or in `__tests__` mirrors.

## Testing Guidelines
- Framework: Jest (via `jest-expo`); Detox reserved for e2e.
- Coverage: prioritize auth, storage, and analysis flows; aim ≥90% on core modules.
- Conventions: `*.test.ts(x)` names; group by feature. Avoid real PHI; use synthetic fixtures.
- Run locally: `npm test` then `npm run test:coverage` before pushing.

## Commit & Pull Request Guidelines
- Commits: Conventional Commits (e.g., `feat: add pdf analysis`, `fix: prevent PHI in logs`). Small, focused commits.
- Branches: `feature/*`, `fix/*`, `docs/*`, `chore/*`, `refactor/*`.
- PRs: use the template; include description, linked issues (`Fixes #123`), screenshots for UI, test plan, and healthcare compliance checklist. Ensure `validate` passes.

## Security & Configuration Tips
- Secrets: start with `npm run env:setup`; never commit `.env`. Use `npm run secrets:encrypt` for EAS secrets.
- Data protection: no real patient data in code/tests; prefer `expo-secure-store` and HTTPS-only services.
- Logging: never log sensitive fields; maintain audit-friendly messages.
