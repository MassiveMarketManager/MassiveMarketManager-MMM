# MassiveMarketManager (MMM)

A clean, opinionated backend for crypto spot trading (Uniswap L2 first).
Built for reliability, simple ops, and clear reporting.

---

## 👀 What it does

- Pulls on-chain market data (via The Graph) and stores candles.
- Calculates indicators (e.g., RSI/EMA/ATR/OBV).
- Runs strategies with risk checks before execution.
- Tracks orders, trades, balances and PnL.
- Exposes REST APIs for a dashboard.

> Scope today: stable backend foundation + data/strategy/exec pipeline.
> Frontend and advanced analytics can be added on top.

---

## ⚙️ Tech Stack

- **Language/Runtime:** Java 21
- **Framework:** Spring Boot 4 (Web, Data JPA, Validation, Actuator)
- **Database:** PostgreSQL 16 (ACID, JSONB, window functions)
- **Build:** Maven 3.9.x
- **Containers:** Docker & Docker Compose
- **CI/CD:** GitHub Actions → JAR build, coverage (JaCoCo), Docker image → GHCR
- **Config:** `.env` for local dev; Spring profiles (`dev`, `docker`)
- **Later (optional):** TimescaleDB (time‑series), ClickHouse (heavy offline analytics)

---

## 📁 Repo Layout

```
/
├─ backend/                 # Spring Boot app
│  ├─ src/…
│  ├─ pom.xml
│  ├─ Dockerfile
│  └─ application.yml
├─ .github/workflows/       # CI workflows
├─ docker-compose.yml
└─ .env                     # local only (ignored by git)
```

---

## 🚀 Quick Start (Local)

**Requirements:** Docker, Docker Compose (and optionally JDK 21 + Maven for local runs).

1. Build and start:
   ```bash
   docker compose build
   docker compose up -d
   ```

2. Default ports:
   - App: `http://localhost:8080`
   - Postgres: `localhost:5432` (DB: `mmm`, user: `mmm`, password: `mmm_password`)

3. Example `.env` (keep out of git):
   ```env
   POSTGRES_USER=mmm
   POSTGRES_PASSWORD=mmm_password
   POSTGRES_DB=mmm
   POSTGRES_PORT=5432
   APP_PORT=8080
   SPRING_PROFILES_ACTIVE=dev
   SPRING_JPA_HIBERNATE_DDL_AUTO=update
   TZ=UTC
   ```

---

## 🧪 Tests & Coverage

- Maven runs `clean verify`. If there are no tests yet, the build still succeeds.
- JaCoCo report appears at `backend/target/site/jacoco/jacoco.xml` when tests exist.
- Coverage badge & summary are posted to the GitHub job summary automatically when the report is present.

---

## 🔁 CI/CD (GitHub Actions)

Workflow: `.github/workflows/backend-ci.yml`

- Triggers:
  - Pushes to `feature/backend`.
  - Pull requests targeting `main`.
- Jobs:
  1) **Build/Test/Coverage** — JDK 21, `mvn clean verify`, upload reports & coverage.
  2) **Docker Build & Push** — builds the backend image from `backend/Dockerfile` and pushes to GHCR.

**Image tags:**
- `ghcr.io/<owner>/massivemarketmanager-backend:<commit_sha>`
- `ghcr.io/<owner>/massivemarketmanager-backend:feature-backend`

**One-time GitHub setup:**
- Repository → **Settings → Actions → General → Workflow permissions** → enable **Read and write permissions** (so `GITHUB_TOKEN` can push to GHCR).

---

## 🧠 Domain (Initial)

- Users, Portfolios, Accounts
- Instruments/Pairs, Candles (1h baseline)
- StrategyConfig, RiskRules
- Orders, Trades, Positions
- Audit & RunLogs

---

## 🗺️ Roadmap & Timeline (indicative)

- **Phase 0 — Infra & CI (Week 1)**  
  Dockerfile, docker-compose, Postgres schema bootstrap, CI to GHCR.

- **Phase 1 — Domain & Persistence (Weeks 2–3)**  
  Entities, repositories, Flyway migrations, CRUD for core objects.

- **Phase 2 — Ingestion & Indicators (Weeks 3–4)**  
  The Graph puller + schedulers, compute & persist indicators.

- **Phase 3 — Strategy & Risk (Weeks 5–6)**  
  Strategy SPI, sample momentum strategy, risk checks (exposure/slippage/cooldowns).

- **Phase 4 — Execution (Weeks 6–7)**  
  Uniswap adapter, order lifecycle, settlement tracking.

- **Phase 5 — API & Dashboard hooks (Weeks 7–8)**  
  REST endpoints for metrics, PnL, runs; basic auth.

- **Phase 6 — Ops & Observability (Week 9)**  
  Actuator, structured logs, retention policies.

- **Phase 7 — Hardening (Week 10)**  
  Retries/backoff, circuit breakers, E2E smoke.

---

## 🔐 Security Notes

- No secrets in git. Use GitHub secrets / env-specific configs.
- Keys/seed phrases stored outside DB (KMS/Vault). DB holds only references.
