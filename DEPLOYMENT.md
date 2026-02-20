# Deployment Guide

This guide will help you deploy the AI Summary App to Vercel.

## Prerequisites

- Vercel account (free tier is sufficient)
- Supabase project set up (from Section 6)
- GitHub token for Models API (from Section 7)

## Deployment Steps

### 1. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### 3. Deploy from my-app directory

```bash
cd /workspaces/EX1-/my-app
vercel
```

When prompted:
- "Set up and deploy"? → **Y**
- "Which scope"? → Select your account
- "Link to existing project"? → **N**
- "What's your project's name"? → `ai-summary-app` (or your choice)
- "In which directory is your code located"? → `./` (current directory)
- "Want to override settings"? → **N** (use defaults)

### 4. Configure Environment Variables in Vercel

After initial deployment, add environment variables:

**Option A: Via CLI**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your Supabase anon key when prompted

vercel env add GITHUB_TOKEN production
# Paste your GitHub token when prompted
```

**Option B: Via Dashboard**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GITHUB_TOKEN`
5. Set scope to **Production**, **Preview**, and **Development**

### 5. Redeploy with Environment Variables

```bash
vercel --prod
```

This creates a production deployment with your environment variables.

### 6. Test Deployment

1. Open the deployment URL (shown in terminal)
2. Test all features:
   - ✓ File upload
   - ✓ File list display
   - ✓ Document viewing
   - ✓ AI summarization
   - ✓ File deletion

### 7. Configure Custom Domain (Optional)

1. In Vercel Dashboard → Your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Troubleshooting

### Issue: "Internal Server Error" on API routes

**Solution**: 
- Check Vercel deployment logs: Dashboard → Deployments → Your deployment → Runtime Logs
- Verify environment variables are set correctly
- Ensure Supabase policies allow external requests

### Issue: Supabase Storage 403 Forbidden

**Solution**:
- Verify bucket is set to **Public**
- Check RLS policies allow anonymous access (for development)
- Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

### Issue: AI Summarization fails

**Solution**:
- Verify `GITHUB_TOKEN` is valid and has correct permissions
- Check that token has access to GitHub Models API
- Review function logs in Vercel for specific error messages

### Issue: Files upload but don't appear in list

**Solution**:
- Check browser console for errors
- Verify `/api/files` endpoint is working
- Test API endpoints directly: `https://your-app.vercel.app/api/health`

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create/push to any other branch or PR

To trigger a new deployment:
```bash
git add .
git commit -m "Update app"
git push origin main
```

Vercel will automatically build and deploy within 1-2 minutes.

## Monitoring

- **Build Logs**: Dashboard → Deployments → Build logs
- **Runtime Logs**: Dashboard → Deployments → Runtime logs  
- **Analytics**: Dashboard → Analytics (view traffic and performance)

## Rollback

If a deployment has issues:
1. Go to Dashboard → Deployments
2. Find a previous working deployment
3. Click **⋯** menu → **Promote to Production**
