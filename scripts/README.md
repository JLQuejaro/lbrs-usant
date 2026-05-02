# Scheduled Tasks

## Mark Overdue Borrows

### Local Development (Windows)

Run manually:
```bash
npm run db:mark-overdue
```

**Schedule via Windows Task Scheduler:**

1. Open **Task Scheduler** (search in Start menu)
2. Click **Create Basic Task** (right panel)
3. Name: `Library - Mark Overdue Borrows`
4. Trigger: **Daily** at 2:00 AM
5. Action: **Start a program**
   - Program/script: `npm`
   - Arguments: `run db:mark-overdue`
   - Start in: `C:\Users\danke\Desktop\Next\lbrs-usant`
6. Finish and test with **Run** button

### Production (Vercel)

When deployed to Vercel, the cron job runs automatically via `/api/cron/mark-overdue`.

**Required Environment Variable:**
```
CRON_SECRET=your-secure-random-string-here
```

**Setup:**
1. Generate a secret: `openssl rand -hex 32`
2. Add to Vercel Environment Variables (Production)
3. Deploy with `vercel.json` configuration
4. Verify at: `https://your-app.vercel.app/api/cron/mark-overdue` (with Bearer token)

**Test the endpoint:**
```bash
curl -H "Authorization: Bearer your-cron-secret" \
  https://your-app.vercel.app/api/cron/mark-overdue
```
