# Database Implementation Summary

The project has been consolidated onto Prisma ORM.

Current database implementation:

- Prisma schema: `../prisma/schema.prisma`
- Prisma migrations: `../prisma/migrations`
- Prisma client bootstrap: `../src/app/lib/prisma.ts`
- Prisma repository layer: `../src/app/lib/db-repository.ts`
- Prisma Studio command: `npm run db:studio`

Legacy SQL artifacts in `database/` remain available as historical references and backup material, but they are not the active implementation path.

See [../PRISMA_MIGRATION_GUIDE.md](../PRISMA_MIGRATION_GUIDE.md) for setup, migration, backup, rollback, and validation instructions.
