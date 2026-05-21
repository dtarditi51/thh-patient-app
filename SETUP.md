# GitHub + Vercel Setup, Step by Step

15-20 minutes total. You'll need a GitHub account and (later) a Vercel account.

## Part 1: Push code to GitHub (10 min)

### 1. Create the GitHub account / org

If you don't have GitHub yet: https://github.com/join

Decide where the repo lives:
- **Personal**: `github.com/danieltarditi/thh-patient-app` — fine for now, easy to move later
- **Practice org** (recommended for long-term): `github.com/hearthousenj/thh-patient-app` — create an org at https://github.com/organizations/new ($0 for public, $4/user/mo for private with team features)

For HIPAA peace of mind, make the repo **private**. There's no PHI in it, but no reason to publish provider photos and bios publicly.

### 2. Create the repo

1. Go to https://github.com/new
2. Repository name: `thh-patient-app`
3. Description: "Patient-facing web app for The Heart House and Vascular Care"
4. Visibility: **Private**
5. Do NOT initialize with README, .gitignore, or license (the scaffold has these)
6. Click "Create repository"

GitHub shows you a page with setup instructions. Keep that tab open.

### 3. Push the scaffold

On your laptop:

```bash
# Unpack the scaffold
tar -xzf thh-patient-app.tar.gz
cd thh-app

# Initialize git
git init
git add .
git commit -m "Initial scaffold: Week 1 complete"

# Connect to your GitHub repo (use YOUR username or org)
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/thh-patient-app.git
git push -u origin main
```

Done. Refresh the GitHub page — your code is there.

## Part 2: Connect Vercel (5 min)

### 1. Create Vercel account

https://vercel.com/signup — sign in with your GitHub account. This auto-links them.

Pricing:
- **Hobby (free)**: fine for staging and personal projects. 100 GB bandwidth/mo. No team features.
- **Pro ($20/mo per member)**: needed for analytics, password-protected previews, and SLA. Worth it once you go live.

Start with Hobby. Upgrade when you flip to production.

### 2. Import the repo

1. From the Vercel dashboard, click "Add New" → "Project"
2. Find your `thh-patient-app` repo, click "Import"
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave as `./`
5. Click "Deploy"

90 seconds later you have a live URL like `thh-patient-app-abc123.vercel.app`. The app is on the internet.

### 3. Add environment variables

Vercel dashboard → your project → Settings → Environment Variables.

Add the same keys from `.env.example`. For week 1 testing, you can leave most empty — the API routes have graceful fallbacks. Bare minimum to populate:

```
NEXT_PUBLIC_MAIN_PHONE=856-546-3003
NEXT_PUBLIC_MAIN_FAX=856-547-5337
NEXT_PUBLIC_PORTAL_URL=https://portal.hearthousenj.com
```

Trigger a redeploy: Vercel dashboard → Deployments → click the latest → "Redeploy."

## Part 3: Custom domain (week 4, after IT)

When you're ready to go live at `app.hearthousenj.com`:

1. Vercel dashboard → your project → Settings → Domains
2. Add `app.hearthousenj.com`
3. Vercel shows you a CNAME record to add
4. Send that record to IT, ask them to add it to your DNS provider
5. Vercel auto-issues an SSL certificate once DNS propagates (usually under an hour)

## Daily workflow after this

You don't have to think about Vercel again. Just push to GitHub:

```bash
git add .
git commit -m "Add provider photos"
git push
```

Vercel detects the push and redeploys automatically. Every PR you open also gets its own preview URL, so you can review changes in a browser before merging.

## Recommended next steps in order

1. Push to GitHub (today, 10 min)
2. Deploy to Vercel staging (today, 5 min)
3. Run `pnpm run scrape:providers` locally, commit the photos and bios, push (this week)
4. Send Vercel CNAME to IT (this week)
5. Schedule Rater8 vendor call (this week)
6. Generate Firebase project for push notifications (week 3)
7. Fetch Google Place IDs for all 6 offices (week 4)
8. Hire medical Spanish translator (week 3, ~$500-1000)

## If you get stuck

GitHub docs: https://docs.github.com/en/get-started
Vercel docs: https://vercel.com/docs

Or paste the error into our next chat and I'll walk you through it.
