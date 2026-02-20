# 🚀 Setup & Deployment Instructions

## ⚠️ Important - Before Running the App

The application is **fully implemented and ready to deploy**, but requires configuration of external services to function. Follow these steps to get it running.

## Prerequisites

1. **Supabase Account** (Free tier): https://supabase.com
2. **GitHub Account** with Models API access: https://github.com/marketplace/models
3. **Vercel Account** (Free tier): https://vercel.com

## Quick Start (3 Steps)

### Step 1: Configure Supabase (5 minutes)

1. **Create Project**:
   - Go to https://supabase.com and sign in
   - Click "New Project"
   - Name: `ai-summary-app`
   - Set database password (save it!)
   - Choose region closest to you
   - Wait ~2 minutes for setup

2. **Create Storage Bucket**:
   - Navigate to **Storage** in left sidebar
   - Click "New bucket"
   - Name: `documents`
   - ✓ Enable "Public bucket"
   - Click "Create bucket"

3. **Create Database Table**:
   - Navigate to **SQL Editor**
   - Click "New query"
   - Copy contents from `my-app/database/schema.sql`
   - Click "Run"
   - Verify in **Table Editor** that `documents` table exists

4. **Get API Credentials**:
   - Go to **Settings** → **API**
   - Copy:
     - Project URL (e.g., `https://xxxxx.supabase.co`)
     - `anon` `public` key (long string starting with `eyJ...`)

### Step 2: Configure Environment Variables (2 minutes)

1. **Update `.env.local` in `my-app` folder**:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   GITHUB_TOKEN=your-github-token-here
   ```

2. **Get GitHub Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Or use GitHub Models specific token
   - Paste in `.env.local`

### Step 3: Run or Deploy (3 minutes)

**Option A: Run Locally**
```bash
cd my-app
npm install  # Already done if you followed setup
npm run dev
```
Open http://localhost:3000

**Option B: Deploy to Vercel**
```bash
cd my-app
npx vercel
```
Follow prompts, then configure environment variables in Vercel Dashboard.

## Verification Checklist

After setup, test these features:

- [ ] Upload a `.txt` file → Should appear in file list
- [ ] Click on file → Content displays in middle panel
- [ ] Click "Generate AI Summary" → Summary appears in ~5-10 seconds
- [ ] Delete file → File removed from list
- [ ] Check Supabase Storage → File should be visible
- [ ] Check Supabase Table Editor → Metadata should be stored

## Troubleshooting

### "Invalid supabaseUrl" error
→ Check that `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`

### Files upload but 403 Forbidden
→ Ensure storage bucket is set to "Public" in Supabase

### AI Summary fails
→ Verify `GITHUB_TOKEN` is valid and has Models API access

### Database insert fails
→ Check that database table was created successfully
→ Verify RLS policies allow inserts (check schema.sql was run)

## Next Steps

Once the app is running:

1. **Test with sample document**:
   ```bash
   # Use the provided sample-document.txt in the root folder
   ```

2. **Review documentation**:
   - `README.md` - Project overview
   - `task1.md` - Tutorial Sections 1-5
   - `task2.md` - Tutorial Sections 6-8
   - `DEPLOYMENT.md` - Full deployment guide
   - `PROJECT-SUMMARY.md` - Complete feature list

3. **Customize**:
   - Modify UI in `my-app/app/page.tsx`
   - Add features as described in Section 9 of task2.md
   - Implement user authentication
   - Add PDF/DOCX parsing

## Support

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Models: https://github.com/marketplace/models

## Time Estimates

- Supabase setup: 5 minutes
- Environment config: 2 minutes
- Local testing: 3 minutes
- Vercel deployment: 5 minutes
- **Total: ~15 minutes**

---

**Ready to proceed?** Start with Step 1: Configure Supabase ☝️
