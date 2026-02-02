# Backend Setup (Express + Postgres)

## 1) Install deps

```bash
cd backend
npm install
```

## 2) Configure env

```bash
cp .env.example .env
```

Update DB and JWT values in `.env`.

## 3) Create schema

Run the SQL in `backend/db/syneraDb.sql` on your Postgres database.

## 4) Start server

```bash
npm run dev
```

API base: `http://localhost:3001/api/v1/alm`
