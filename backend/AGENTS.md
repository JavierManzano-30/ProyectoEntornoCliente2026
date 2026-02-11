# Backend Development Guidelines

## Commands

- **Start dev**: `npm run dev` (nodemon, port 3001)
- **Start prod**: `npm start`
- **Test ALM module**: `npm run alm:smoke`

## Architecture

- **Express.js** API with 8 modules: ALM, CORE, RRHH, CRM, BPM, ERP, SOPORTE, BI
- **API Version**: `/api/v1/{module}` structure
- **Database**: PostgreSQL (schema in `db/syneraDb.sql`) + Supabase for ALM
- **Key middleware**: Helmet (security), CORS, Morgan (logging), JWT auth, error handling

## Code Style & Conventions

- **Node.js CommonJS**: `require()` / `module.exports`
- **Response format**: Standard envelope with `{ success, data, meta }` or `{ success: false, error: { code, message, details } }`
- **Auth**: Bearer token JWT validation via `requireAuth()` middleware
- **Module structure**: `index.js` exports `{ routes }`, separate `*Controller.js` files for logic
- **Error handling**: Centralized `errorHandler.js` middleware, use `envelopeError(code, message)` utils
- **Naming**: camelCase for functions/variables, PascalCase for classes, lowercase with dashes for filenames
- **Environment**: Load via `src/config/env.js`, required keys: `PORT`, `JWT_SECRET`, `DATABASE_URL`

## Target Monorepo Structure

```
/synera-platform
├── .env, package.json, .gitignore    # Single files for entire project
├── src/app.js                         # Single entry point
├── src/config/                        # Shared config (supabase client)
├── src/middlewares/                   # Shared middlewares (auth, errorHandler)
├── src/utils/                         # Shared utilities
└── src/modules/{core,rrhh,crm,bpm,erp,alm,soporte,bi}/
    ├── controllers/
    ├── routes/                        # Define routes (no server startup)
    └── services/
```

## Refactoring Notes

- **Monorepo consolidation**: Consolidate 8 separate modules into unified monorepo structure. Unify package.json, .gitignore, config files, and shared middleware/utils across modules
- **Frontend stability**: Parent directory contains frontend codebase; minimize changes to frontend to reduce risk and maintain stability
