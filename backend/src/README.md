# Backend (Node/Express) - Guía rápida

Este `src/` está organizado por módulos para que cada persona pueda trabajar en paralelo.

## 📁 Estructura

```
src/
  app.js
  server.js
  config/
    env.js
    db.js
  middleware/
    auth.js
    errorHandler.js
  modules/
    alm/
      routes.js
      projectsController.js
      tasksController.js
      timesController.js
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

2) Configurar `.env`

```bash
cp .env.example .env
```

3) Crear la base de datos y tablas

Ejecuta `backend/db/schema.sql` en tu Postgres.

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

curl -X GET "http://localhost:3001/api/v1/alm/proyectos?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

Crear proyecto:

```bash
curl -X POST "http://localhost:3001/api/v1/alm/proyectos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"empresaId":"emp_1","nombre":"Proyecto Atlas","descripcion":"Migracion de CRM","fechaInicio":"2026-01-10","fechaFin":"2026-03-30","responsableId":"usr_10","estado":"planificacion","presupuesto":25000,"clienteId":"cli_5"}'
```

## 📌 Dónde añadir nuevos endpoints

1) Crear un `routes.js` en el módulo si no existe.
2) Crear el controlador en el mismo módulo.
3) Montar el módulo en `src/app.js` si no está.

## ✅ Salud del módulo

Cada módulo tiene un endpoint base de salud:
- `/api/v1/core/health`
- `/api/v1/rrhh/health`
- `/api/v1/crm/health`
- `/api/v1/bpm/health`
- `/api/v1/erp/health`
- `/api/v1/soporte/health`
- `/api/v1/bi/health`
