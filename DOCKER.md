# Docker setup for Tetris

The app runs as a single container (Node server + built React frontend) with MariaDB in a separate container.

## Prerequisites

- Docker and Docker Compose installed

## Quick start

1. **Create env file (optional)**  
   Copy `.env.example` to `.env` and set at least:
   - `DB_PASSWORD` – password for DB user `tetris`
   - `DB_ROOT_PASSWORD` – root password for MariaDB
   - `JWT_SECRET` – secret for JWT (use a strong value in production)

2. **Build and run**

   ```bash
   docker compose up --build
   ```

3. **Open the app**  
   http://localhost:3001

## Commands

| Command | Description |
|--------|-------------|
| `docker compose up --build` | Build images and start app + DB |
| `docker compose up -d` | Start in background |
| `docker compose down` | Stop and remove containers |
| `docker compose down -v` | Stop and remove containers + DB volume |
| `docker compose logs -f app` | Follow app logs |

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_PASSWORD` | tetris | MariaDB user `tetris` password |
| `DB_ROOT_PASSWORD` | root | MariaDB root password |
| `JWT_SECRET` | change-me-in-production | Secret for JWT signing |

Set them in `.env` in the project root or in the shell before running `docker compose`.

## Production notes

- Set strong `DB_PASSWORD`, `DB_ROOT_PASSWORD`, and `JWT_SECRET`.
- Prefer secrets or a secret manager instead of `.env` for production.
- The DB data is stored in the volume `tetris_db`; back it up if you need to keep data.
- To run the app on another port, change the host port in `docker-compose.yml`, e.g. `"8080:3001"`.
