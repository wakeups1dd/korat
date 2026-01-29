# KORAT Backend Deployment Guide

Follow these step instructions to deploy your fully functional backend.

---

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Git installed
- Access to your Supabase project dashboard

---

## Step 1: Create Database Tables

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/iqntegqrnqjwgchhppmf)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press `Ctrl+Enter`)

###Expected Output
```
Success. No rows returned.
```

### Verify Tables Were Created
Run this query:
```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

You should see:
- `profiles`
- `audits`

---

## Step 2: Backfill Profiles for Existing Users (Optional)

If you already have users who signed up before creating these tables:

1. In SQL Editor, create a new query
2. Copy contents of `supabase/migrations/backfill_profiles.sql`
3. Run the query

### Verify
```sql
SELECT COUNT(*) FROM profiles;
```

Should match the number of users in your system.

---

## Step 3: Install Supabase CLI

```powershell
# Install Supabase CLI using npm
npm install -g supabase

# Verify installation
supabase --version
```

---

## Step 4: Login to Supabase CLI

```powershell
supabase login
```

This will open a browser window. Authorize the CLI.

---

## Step 5: Link Your Project

```powershell
cd c:\Users\DELL\korat
supabase link --project-ref iqntegqrnqjwgchhppmf
```

When prompted for the database password, enter your Supabase database password.

---

## Step 6: Deploy the Edge Function

```powershell
# Deploy the analyze-url function
supabase functions deploy analyze-url

# If you get SSL errors, add --no-verify-jwt flag
supabase functions deploy analyze-url --no-verify-jwt
```

### Expected Output
```
Deploying function analyze-url...
Function URL: https://iqntegqrnqjwgchhppmf.supabase.co/functions/v1/analyze-url
```

---

## Step 7: Test the Edge Function Locally (Optional)

Before deploying frontend, test the function:

```powershell
# Serve the function locally
supabase functions serve analyze-url
```

Then in another terminal:
```powershell
# Get a user access token
# 1. Login to your app
# 2. Open browser DevTools > Application > Local Storage
# 3. Find the Supabase auth token

# Test the function
curl -X POST http://localhost:54321/functions/v1/analyze-url `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" `
  -H "Content-Type: application/json" `
  -d '{"url":"https://example.com"}'
```

You should get a JSON response with audit data.

---

##Step 8: Deploy Frontend to Vercel

```powershell
git add .
git commit -m "feat: Add fully functional backend with real SEO analysis"
git push origin main
```

Vercel will automatically deploy the changes.

---

## Step 9: Verify End-to-End Flow

### Test on Production

1. Go to https://korat-jet.vercel.app
2. Login with your account
3. Enter a URL (e.g., `google.com`)
4. Click "SCAN"
5. Wait for loading screen
6. View Dashboard with **REAL DATA** (not mock scores!)

###⚠️ Troubleshooting

**"Function returned 401 Unauthorized"**
- Make sure you're logged in
- Check browser console for auth errors
- Verify Edge Function was deployed successfully

**"This site can't be reached" after scan**
- Check that Supabase Site URL is set to `https://korat-jet.vercel.app`
- Verify Redirect URLs include `https://korat-jet.vercel.app/**`

**"No audit found" on Dashboard**
- Open browser DevTools > Console
- Look for errors during scan
- Check if `lastAuditId` is in localStorage

**Scores are all 0**
- Check Supabase > Table Editor > `audits` table
- Verify the row was created
- Check Edge Function logs in Supabase Dashboard

---

## Step 10: Verify Database

1. Go to Supabase Dashboard > **Table Editor**
2. Select `audits` table
3. You should see your scan results!

Click on a row to see:
- `url`: The URL you scanned
- `overall_score`: Calculated score
- `seo_issues`: Array of SEO problems found

---

## Next Steps

### Add More Features

1. **History Page** - Show all past audits
   - Already have API function `getUserAudits()`
   - Create new route `/history`
   - List all audits with links to view details

2. **Improved Analysis** - Add more checks
   - Meta keywords
   - Open Graph tags
   - Schema.org markup
   - Page speed metrics via Google PageSpeed API

3. **PDF Export** - Generate downloadable reports
   - Use libraries like `jsPDF` or `pdfmake`
   - Create printable audit reports

4. **Scheduled Rescans** - Track changes over time
   - Use Supabase Edge Functions with cron
   - Email users when scores change

---

## File Structure Reference

```
korat/
├── supabase/
│   ├── schema.sql              # Database tables
│   ├── migrations/
│   │   └── backfill_profiles.sql
│   └── functions/
│       ├── analyze-url/
│       │   └── index.ts        # SEO analysis logic
│       ├── deno.json
│       └── import_map.json
├── src/
│   ├── lib/
│   │   ├── api.ts              # API service layer
│   │   └── supabase.ts
│   └── pages/
│       ├── Index.tsx           # Updated to call API
│       └── Dashboard.tsx       # Updated to show real data
└── .env                        # Contains Supabase keys
```

---

## Important Commands Reference

```powershell
# Deploy Edge Function
supabase functions deploy analyze-url

# View Edge Function logs (helpful for debugging)
supabase functions logs analyze-url

# List all functions
supabase functions list

# Delete a function (if needed)
supabase functions delete analyze-url
```

---

## Cost Monitoring

### Free Tier Limits (Supabase)
- **Database**: 500MB storage
- **Edge Functions**: 500,000 invocations/month
- **Bandwidth**: 2GB egress/month

### When You'll Need to Upgrade
- If you get >16,000 scans/month
- If database grows beyond 500MB (unlikely for audits)

---

## Support

If you encounter issues:

1. Check Supabase **Logs** tab for errors
2. Open browser DevTools > Console for frontend errors
3. Verify all environment variables are set in Vercel
4. Ensure database tables were created correctly

---

**Congratulations! Your KORAT SEO Audit Tool is now fully functional! 🎉**
