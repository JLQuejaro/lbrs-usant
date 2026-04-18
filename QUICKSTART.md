# Quickstart

## 1. Configure Prisma

Copy `.env.example` to `.env.local` and set:

```env
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?schema=public&sslmode=require
DIRECT_URL=postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?schema=public&sslmode=require
JWT_SECRET=replace-this-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=https://app.example.com
PRISMA_STUDIO_PORT=5555
```

## 2. Install and migrate

```bash
npm install
npm run db:generate
npm run db:validate
npm run db:migrate
npm run db:seed
```

## 3. Validate the database

```bash
npm run db:test
```

This verifies:

- Prisma can connect to PostgreSQL
- core models are queryable
- runtime database views are present
- seeded data is readable

## 4. Start the app

```bash
npm run dev
```

Open the URL printed by Next.js.

## 5. Manage data in Prisma Studio

```bash
npm run db:studio -- --port 5555
```

## Common commands

```bash
npm run db:status
npm run db:migrate:dev -- --name your_change_name
npm run lint
npm run build
```

## Backups

Before schema changes:

```bash
pg_dump --format=custom --file=backups/pre_change.dump "postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?sslmode=require"
```

Restore:

```bash
pg_restore --clean --if-exists --no-owner --dbname="postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?sslmode=require" backups/pre_change.dump
```

See [PRISMA_MIGRATION_GUIDE.md](./PRISMA_MIGRATION_GUIDE.md) for the full migration workflow and rollback plan.
