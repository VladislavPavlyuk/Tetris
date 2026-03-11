# Deploy to QNAP NAS (TS-233)

App will be available at **http://192.168.0.213:9090/** (or your NAS IP). Port 9090 is used to avoid clashes with QNAP services (8080, 8081, etc.).

**Note:** The compose file uses `network_mode: host` to avoid QNAP bridge/NAT errors. MariaDB runs on **port 3308** to avoid clashing with QNAP’s built-in MySQL/MariaDB on 3306. If the db container was unhealthy before, remove the volume and start again: `docker compose -f docker-compose.nas.yml down -v` then `up -d`. If you see "Access denied for user 'tetris'" in db logs, the volume was reused from an older run and the tetris user wasn’t created with the current password—either run `down -v` and `up -d` for a fresh DB, or fix the user: `docker exec -it tetris-db-1 mysql -h 127.0.0.1 -P 3308 -u root -p` then `CREATE USER IF NOT EXISTS 'tetris'@'%' IDENTIFIED BY 'tetris'; GRANT ALL ON tetris.* TO 'tetris'@'%'; FLUSH PRIVILEGES;`

## Prerequisites

- **Windows**: Docker Desktop with Buildx (for `linux/arm64`), OpenSSH client (`scp`, `ssh`).
- **QNAP**: SSH enabled (Control Panel → Terminal & SNMP → Enable SSH). Container Station (Docker) installed.

## One-shot deploy (build + push + run on NAS)

From project root (or from `scripts`):

```powershell
.\scripts\deploy-qnap.ps1
```

Optional parameters:

- `-NasHost 192.168.0.213` — NAS IP (default)
- `-NasUser admin` — SSH user (default: admin)
- `-NasPath /share/CACHEDEV1_DATA/Public/tetris` — path on NAS (create this folder; adjust volume name if yours differs, e.g. `HDD1`)
- `-BuildOnly` — only build and create `tetris-app.tar` (no copy/SSH)
- `-SkipBuild` — skip build, use existing `tetris-app.tar` (deploy only)

## Manual deploy (copy tar yourself)

1. Build the tar:

   ```powershell
   .\scripts\deploy-qnap.ps1 -BuildOnly
   ```

2. Copy `tetris-app.tar` and `docker-compose.nas.yml` to the NAS (e.g. via File Station or SCP).

3. On the NAS (SSH or Container Station terminal):

   ```bash
   cd /path/where/you/copied/files
   docker load -i tetris-app.tar
   docker compose -f docker-compose.nas.yml up -d
   ```

## Environment (optional)

On the NAS, in the same directory as `docker-compose.nas.yml`, create a `.env` file to override defaults:

- `DB_PASSWORD` — MariaDB app user password (default: tetris)
- `DB_ROOT_PASSWORD` — MariaDB root (default: root)
- `JWT_SECRET` — change in production

Then run:

```bash
docker compose -f docker-compose.nas.yml up -d
```

## Check / stop

- Logs: `docker compose -f docker-compose.nas.yml logs -f`
- Stop: `docker compose -f docker-compose.nas.yml down`
