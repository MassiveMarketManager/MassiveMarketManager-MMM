# MassiveMarketManager - MMM

An advanced AI-driven trading system designed for decentralized finance (DeFi).  
TradingBro integrates **machine learning algorithms**, **deep learning models**, and **audited smart contracts** to enable fully automated spot trading on leading L2 networks (Arbitrum, Base, Optimism).  

The platform combines three core layers:  
- **Data & Analytics** — continuous ingestion of on-chain market data, calculation of technical indicators, and generation of trading signals.  
- **Decision & Execution** — ML/DL models for short-term market prediction, integrated with a robust risk-management engine and secure smart-contract execution.  
- **User Experience** — a modular backend powering a responsive frontend dashboard that provides transparency, performance metrics, and strategy customization.  

This architecture allows MMM to operate as a scalable, modular DeFi instrument capable of supporting multiple strategies, adapting to volatile markets, and ensuring security through strict key management and contract audits.

---

## 🔎 What It Does

- Collects and analyzes on-chain market data (via The Graph).
- Uses ML/DL models to predict short-term market movements.
- Executes trades automatically through audited smart contracts.
- Applies risk management rules to protect funds.
- Provides a web dashboard for strategy settings, monitoring, and reporting.

---

## 🛠 Tech Stack

- **Backend:** Java 21, Spring Boot 4, PostgreSQL 16 + TimescaleDB extension, Maven 3.9.x, Lombok, MapStruct, Docker Compose, JUnit 5, GitLab CI/CD / GitHub Actions
- **Frontend:** React (dashboard for monitoring & control)  
- **Smart Contracts:** Solidity (execution on Uniswap/DEX)  
- **ML/AI Core:** Python (ML/DL models, indicators)

---

## 📂 Architecture Overview

- **Data Module** — collects and stores candles, indicators.  
- **ML/AI Module** — trains and runs models for predictions.  
- **Execution Module** — places and tracks trades via Uniswap adapters.  
- **Backend API** — REST endpoints for portfolio, strategies, and reporting.  
- **Frontend Dashboard** — user interface for monitoring and control.  
- **Database** — stores users, strategies, trades, logs.

---

## 🚀 Quick Start

**Requirements:** Docker & Docker Compose  

1. Clone the repo and create a `.env` file (see example below).  
2. Start services:  
   ```bash
   docker compose up -d --build
   ```  
3. Access:
   - API: [http://localhost:8080](http://localhost:8080)  
   - Dashboard: [http://localhost:3000](http://localhost:3000)  
   - Database: `localhost:5432`  

**Example `.env`:**
```env
POSTGRES_USER=mmm
POSTGRES_PASSWORD=mmm_password
POSTGRES_DB=mmm
POSTGRES_PORT=5432
APP_PORT=8080
FRONTEND_PORT=3000
SPRING_PROFILES_ACTIVE=dev
SPRING_JPA_HIBERNATE_DDL_AUTO=update
TZ=UTC
```

---

## 🧭 Roadmap (Indicative)

- **Phase 1:** Core architecture, DB schema, Docker setup  
- **Phase 2:** Data ingestion + technical indicators  
- **Phase 3:** ML/DL research & integration  
- **Phase 4:** Trade execution with risk rules  
- **Phase 5:** Dashboard & API for monitoring  
- **Phase 6:** Security, audits, performance tuning  

---

## 👥 Team

- **Smart Contracts Developer** — Artem Zagorskyi/Nikolai Milenko - Solidity, Ethers.js/Hardhat  
- **ML/AI Engineer** - Artem Zagorskyi — market data modeling, training pipelines  
- **Backend Developer** - Nikolai Milenko — Spring Boot, API, persistence  
- **Frontend Developer** - Artem Zagorskyi/Nikolai Milenko — dashboard, UX/UI  

---

## 🔐 Security Notes

- No private keys or secrets are stored in Git.  
- API keys, seed phrases, and sensitive configs must be provided via environment variables or secret managers.  
- Smart contracts undergo audits and use trusted libraries.
