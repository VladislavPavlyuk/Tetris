# Tetris API

Сервер аутентификации и рейтинга для Tetris.

## Требования

- Node.js 18+
- MariaDB

## Настройка БД

```sql
CREATE DATABASE tetris;
CREATE USER 'tetris'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL ON tetris.* TO 'tetris'@'localhost';
```

## Запуск

```bash
cd server
npm install
# Создайте .env или задайте переменные:
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, PORT
npm run dev
```

Сервер: http://localhost:3001

- `POST /auth/register` — регистрация (email, password, displayName?)
- `POST /auth/login` — вход (email, password)
- `POST /scores` — сохранить счёт (Authorization: Bearer &lt;token&gt;)
- `GET /scores/leaderboard` — топ-10 лучших результатов по пользователям
