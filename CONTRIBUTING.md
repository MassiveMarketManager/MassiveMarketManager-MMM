# Contributing to MassiveMarketManager (MMM)

Thanks for your interest! This document explains where to base your work and how a pull request gets merged. Please read the **Branches** section before opening a PR — it is the most common reason a PR cannot be merged as is.

## Repository layout

| Path        | What                                                        |
|-------------|-------------------------------------------------------------|
| `backend/`  | Spring Boot 4 / Hibernate 7 on Java 25, Maven               |
| `frontend/` | React + Vite + Tailwind + shadcn/ui                         |
| `ml/`       | ML models and datasets                                      |
| `docs/`     | Documentation                                               |

## Branches

Backend and frontend are developed on separate, long-lived branches that contain **only their own part of the tree**:

| Branch             | Contains                 | Base your work on it when you change… |
|--------------------|--------------------------|---------------------------------------|
| `feature/backend`  | `backend/`, `ml/`, `docs/` | anything in `backend/`, `ml/`, `docs/` |
| `feature/frontend` | `frontend/`                | anything in `frontend/`                |
| `dev`              | everything                 | **never** — see below                  |
| `main`             | repository meta files      | **never**                              |

Both feature branches also carry `.github/` (CI workflows) and `README.md`. Do not change them unless the issue is about them.

`dev` is the integration branch. It only receives merges from `feature/backend` and `feature/frontend`, done by maintainers when a release is prepared. **Pull requests into `dev` or `main` are not accepted.**

Because `dev` contains the whole tree and the feature branches do not, a branch created from `dev` cannot simply be retargeted: its PR against a feature branch would contain the entire other half of the repository. Start from the right feature branch:

```bash
# frontend change
git fetch upstream
git switch -c my-fix upstream/feature/frontend

# backend change
git fetch upstream
git switch -c my-fix upstream/feature/backend
```

(`upstream` = this repository, `origin` = your fork.)

If you already based your branch on `dev`, move your commits over:

```bash
git rebase --onto upstream/feature/frontend upstream/dev my-fix   # or feature/backend
git push --force-with-lease
```

A change that touches both `backend/` and `frontend/` needs **two PRs**, one per feature branch.

## Picking an issue

- Issues labeled `good first issue` or `help wanted` are open for contributors.
- For any other issue, comment on it first and wait for a maintainer before you start. Some issues are deliberately kept for the maintainers.
- One issue per PR. Put `Closes #<number>` in the PR description.

## Running the project locally

### Backend

Requirements: JDK 25, Docker.

```bash
cd backend
./mvnw test                      # repository tests on H2, no Docker needed
cp env.example .env              # then fill in the values
docker compose --profile dev up -d --build
```

The app is served on `http://localhost:9000`. For local runs set `APP_FRONTEND_BASE_URL=http://localhost:9000` in `.env`, otherwise links in emails point to production.

### Frontend

Requirements: Node.js 20.19+ or 22.12+ (required by Vite 7).

```bash
cd frontend
npm ci
echo "VITE_API_BASE_URL=http://localhost:9000" > .env.local   # backend from above
npm run dev
```

Before opening a PR:

```bash
npm run lint
npm run build
```

`npm run lint` currently reports errors in files unrelated to most changes. Make sure your PR does not add new ones.

## Pull requests

- **Keep the diff minimal.** No reformatting of lines you did not change, no unrelated renames, no drive-by refactoring. Reformatting a whole file hides the real change from review.
- **Do not regenerate `package-lock.json`** unless your change adds, removes or updates a dependency.
- **UI changes:** add screenshots in both the light and the dark theme.
- **Backend changes:** add or update tests. Repository tests use `@DataJpaTest`; clear the persistence context (`entityManager.clear()`) before reading back, otherwise the test reads from the cache instead of the database.
- **Commit messages** follow Conventional Commits: `fix: …`, `feat: …`, `test: …`, `ci: …`, `chore: …`, `docs: …`.
- **Never commit secrets** — `.env`, keys, tokens, database dumps.

CI runs backend tests on PRs into `feature/backend`. For first-time contributors GitHub asks a maintainer to approve the workflow run, so checks may show as pending for a while.

## AI-assisted contributions

AI-assisted PRs are fine, the same rules apply. You are responsible for every line in the diff: read it, run it, and make sure the PR targets the right branch. Agents should also read [`AGENTS.md`](AGENTS.md).

## Security

Do not open a public issue for security problems (authentication, wallet keys, secrets). Contact the maintainers privately instead.
