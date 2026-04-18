# Legacy Database Artifacts

This directory is kept for archival reference during the Prisma migration.

The live application no longer uses `database/schema.sql` or `database/seed.sql` as its setup path.

Use Prisma instead:

- schema: `../prisma/schema.prisma`
- migrations: `../prisma/migrations`
- Studio: `npm run db:studio`
- migration guide: [../PRISMA_MIGRATION_GUIDE.md](../PRISMA_MIGRATION_GUIDE.md)

Files in this directory should be treated as historical snapshots, backup helpers, or one-off migration aids.
