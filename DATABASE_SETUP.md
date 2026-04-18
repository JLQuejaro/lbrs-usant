# Database Setup

The supported database setup for this project is now Prisma-first.

Use these documents:

- [Quickstart](./QUICKSTART.md)
- [Prisma Migration Guide](./PRISMA_MIGRATION_GUIDE.md)

Current setup flow:

```bash
npm install
npm run db:generate
npm run db:validate
npm run db:migrate
npm run db:seed
npm run db:studio -- --port 5555
```

Notes:

- `prisma/schema.prisma` is the canonical schema definition.
- `prisma/migrations` is the canonical migration history.
- Legacy SQL files under `database/` are archival only.
