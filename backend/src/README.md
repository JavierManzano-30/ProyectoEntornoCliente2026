# Backend (Node/Express) - Guía rápida

Este `src/` está organizado por módulos para que cada persona pueda trabajar en paralelo.

## 📁 Estructura

```
src/
  app.js
  config/
    env.js
    db.js
    supabase.js
  middlewares/
    auth.js
    errorHandler.js
  modules/
    alm/
      controllers/
      routes/
      services/
    core/
    rrhh/
    crm/
    bpm/
    erp/
    soporte/
    bi/
  utils/
    envelope.js
    pagination.js
    validation.js
    id.js
```

## ✅ Qué hacer cada equipo

- Crear endpoints en su módulo dentro de `src/modules/<modulo>/`.
- Seguir las convenciones en `backend/docs/api/convenciones-api.md`.
- Mantener el formato de respuesta **Envelope**.
- Usar `config/db` para queries (Postgres).

## 🚀 Cómo levantar la API

1) Instalar dependencias

```bash
cd backend
npm install
```

2) Configurar `.env` (editar valores según tu entorno)

3) Crear la base de datos y tablas

Ejecuta `backend/db/syneraDb.sql` en tu Postgres.

4) Arrancar

```bash
npm run dev
```

API base: `http://localhost:3001/api/v1`

## 🔐 Autenticación

- Los endpoints que requieran auth usan JWT.
- Header: `Authorization: Bearer <token>`
- La clave está en `JWT_SECRET` del `.env`.

## 🧪 Pruebas rápidas (Git Bash)

```bash
TOKEN="<TU_TOKEN>"

curl -X GET "http://localhost:3001/api/v1/alm/projects?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Crear proyecto:

```bash
curl -X POST "http://localhost:3001/api/v1/alm/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"companyId":"11111111-1111-1111-1111-111111111111","name":"Project Atlas","description":"CRM migration","startDate":"2026-01-10","endDate":"2026-03-30","responsibleId":"usr_10","status":"planned","budget":25000,"clientId":"cli_5"}'
```

## 📌 Dónde añadir nuevos endpoints

1) Crear un `routes/index.js` en el módulo si no existe.
2) Crear el controlador dentro de `controllers/`.
3) Montar el módulo en `src/app.js` si no está.

## ✅ Salud del módulo

Cada módulo tiene un endpoint base de salud:
- `/api/v1/core/health`
- `/api/v1/hr/health`
- `/api/v1/crm/health`
- `/api/v1/bpm/health`
- `/api/v1/erp/health`
- `/api/v1/support/health`
- `/api/v1/bi/health`
