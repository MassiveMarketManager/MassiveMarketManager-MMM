# AGENTS.md

Instructions for AI coding agents working on this repository. Human-oriented details are in [`CONTRIBUTING.md`](CONTRIBUTING.md); the rules below are the ones agents most often get wrong.

## 1. Choose the base branch by the files you change

| You change files in | Base branch and PR target |
|---------------------|---------------------------|
| `frontend/`         | `feature/frontend`        |
| `backend/`, `ml/`, `docs/` | `feature/backend`  |
| `frontend/` and anything else | two separate PRs |

- **Never** branch from `dev` or `main`, and never open a PR into them. `dev` is filled only by maintainers.
- `feature/frontend` and `feature/backend` contain **only their part of the tree** (see the table) plus `.github/` and `README.md`. Do not add the other half of the tree to them. If your diff against the target branch contains files outside your directory, the base is wrong — stop and rebase:

```bash
git rebase --onto upstream/feature/frontend upstream/dev <your-branch>   # or feature/backend
```

Check before opening the PR:

```bash
git diff --stat upstream/feature/frontend...HEAD    # must list only frontend/ files
```

## 2. Keep the diff minimal

- Change only what the issue asks for.
- Do not reformat, re-indent or reorder code you do not change. Keep the file's existing indentation.
- Do not regenerate `frontend/package-lock.json` unless dependencies change.
- Do not touch `.github/`, `pom.xml` dependency versions or `compose.yaml` unless the issue is about them.

## 3. Verify before opening the PR

Backend (`backend/`):

```bash
./mvnw test
```

Frontend (`frontend/`):

```bash
npm ci
npm run lint     # must not add new errors; existing ones in other files are known
npm run build
```

For UI changes, check the result in both the light and the dark theme and attach screenshots of both.

## 4. Project conventions

- Backend: Spring Boot 4, Hibernate 7, Java 25. Repository tests use `@DataJpaTest` and must call `entityManager.clear()` before reading back. Compare `BigDecimal` by value (`compareTo` / `isEqualByComparingTo`), not `equals`.
- Frontend: use theme tokens (`bg-card`, `text-foreground`, `bg-accent`, `border-destructive`, …), not fixed colors like `bg-white` or `gray-*`, so both themes work.
- Schema changes: `ddl-auto=update` only adds columns and constraints, it never changes or drops them. If your change alters an existing column or constraint, say so in the PR description.
- Commit messages: Conventional Commits (`fix:`, `feat:`, `test:`, `ci:`, `chore:`, `docs:`).

## 5. Pull request description

- `Closes #<issue>`.
- What changed and why, in a few bullets.
- What you ran to verify it (commands and results), screenshots for UI.
- State that the PR was prepared by an AI agent.

## 6. Never

- Commit secrets: `.env`, keys, tokens, database dumps.
- Pick an issue that is not labeled `good first issue` or `help wanted` without asking on the issue first.
