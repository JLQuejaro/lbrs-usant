# USANT LBRS

USANT LBRS is a Next.js 16 application backed by Prisma ORM and PostgreSQL.

## Database stack

- Prisma schema: `prisma/schema.prisma`
- Prisma migrations: `prisma/migrations`
- Prisma Studio: `npm run db:studio`
- Repository layer: `src/app/lib/db-repository.ts`

## Getting started

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and `NEXT_PUBLIC_APP_URL`.
3. Install dependencies and initialize Prisma:

```bash
npm install
npm run db:generate
npm run db:validate
npm run db:migrate
npm run db:seed
```

4. Start the application:

```bash
npm run dev
```

5. Open the URL printed by Next.js in your terminal.

## Prisma Studio

Use Prisma Studio as the primary database management interface:

```bash
npm run db:studio -- --port 5555
```

## Validation

```bash
npm run db:test
npm run lint
npm run build
```

## Documentation

- [Prisma Migration Guide](./PRISMA_MIGRATION_GUIDE.md)
- [Quickstart](./QUICKSTART.md)
- [Authentication Guide](./AUTHENTICATION_GUIDE.md)

Legacy SQL setup files remain in `database/` for archival reference only and are no longer the recommended setup path.
