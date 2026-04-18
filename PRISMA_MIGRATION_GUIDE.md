# Prisma Migration Guide

## Source of truth

The application now uses Prisma as the only supported database access layer.

- Prisma schema: `prisma/schema.prisma`
- Prisma migrations: `prisma/migrations`
- Prisma client bootstrap: `src/app/lib/prisma.ts`
- Prisma repository layer: `src/app/lib/db-repository.ts`
- Prisma Studio entrypoint: `npm run db:studio`

Legacy SQL files under `database/` are archival references only. They are no longer the setup path for the running application.

## Environment

Copy `.env.example` to `.env.local` and point both Prisma URLs at the same shared PostgreSQL database unless you use a separate direct connection for migrations.

```env
DATABASE_URL=postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?schema=public&sslmode=require
DIRECT_URL=postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?schema=public&sslmode=require
PRISMA_STUDIO_PORT=5555
JWT_SECRET=replace-this-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=https://app.example.com
```

Notes:

- `DATABASE_URL` is used by the application and Prisma client.
- `DIRECT_URL` is used by Prisma CLI tasks such as migrations.
- Do not hardcode `localhost` or `127.0.0.1` in committed configuration.

## Initial setup

```bash
npm install
npm run db:generate
npm run db:validate
npm run db:migrate
npm run db:seed
```

## Prisma Studio

Prisma Studio is the primary management interface for this project.

```bash
npm run db:studio -- --port 5555
```

Use Prisma Studio to:

- inspect every model in the Prisma schema
- query records with relation-aware filters
- edit and delete records safely
- verify seeded data and post-migration integrity

## Operational workflow

Schema changes:

```bash
npm run db:migrate:dev -- --name your_change_name
npm run db:generate
```

Deploy migrations:

```bash
npm run db:migrate
```

Check migration state:

```bash
npm run db:status
```

Validate database connectivity and runtime objects:

```bash
npm run db:test
```

## Backup and rollback

Create a backup before applying migrations:

```bash
pg_dump --format=custom --file=backups/pre_prisma_change.dump "postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?sslmode=require"
```

Restore from backup:

```bash
pg_restore --clean --if-exists --no-owner --dbname="postgresql://DB_USER:DB_PASSWORD@DB_HOST:5432/lbrs_db?sslmode=require" backups/pre_prisma_change.dump
```

Rollback plan:

1. Stop application writes.
2. Restore the latest verified backup.
3. Re-run `npm run db:generate`.
4. Re-run `npm run db:test` before reopening traffic.

## Validation checklist

Run these checks after every database change:

```bash
npm run db:validate
npm run db:test
npm run lint
npm run build
```

Manual verification:

1. Open Prisma Studio.
2. Confirm `users`, `books`, `borrow_records`, `account_requests`, `notifications`, `reviews`, and `wishlist_items` load correctly.
3. Create and edit a record in Studio, then verify the corresponding UI/API flow still works.
4. Confirm the librarian inventory flow and admin request review flow persist changes to PostgreSQL.

## Migration notes

The Prisma migration history now includes:

- core relational schema creation
- wishlist support
- runtime views restored from the legacy SQL schema

The application-level borrow and return flows now manage stock counts through Prisma transactions, and timestamp updates are handled by Prisma model metadata where supported.
