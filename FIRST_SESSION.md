# First Claude Code Session — Kickoff Prompt

Copy everything between the lines below and paste it as your first message in Claude Code, after you `cd` into the cloned repo and run `claude`.

---

Read CLAUDE.md first. That's the full project context, decisions, and roadmap for The Heart House patient app. I'm Dr. Daniel Tarditi, the project lead.

Week 1 (the scaffold) is done. We're starting Week 2 today. Here's what I want to accomplish this session, in order:

**1. Verify the scaffold runs locally.**
- Run `pnpm install` (or npm install if pnpm isn't available)
- Run `pnpm dev` and confirm http://localhost:3000 loads without errors
- Hit `/en` and `/es` to verify the locale toggle works
- Click through to /doctors, /locations, /education, /portal to confirm all routes render
- If anything's broken, fix it before moving on

**2. Run the provider scraper.**
- `pnpm run scrape:providers`
- This pulls real photos and bios from hearthousenj.com for all 34 cardiologists
- Watch for any providers that fail to scrape (HubSpot sometimes blocks or has odd HTML)
- For any failures, show me the URL and we'll handle them manually
- The script writes photos to `public/providers/{slug}.jpg` and bio data to `data/providers-scraped.json`

**3. Merge scraped data into providers.ts.**
- Read `data/providers-scraped.json`
- For each provider, update `data/providers.ts` to add the real `bio`, `education`, `languages`, and confirm `photoUrl` matches what landed on disk
- Keep all my hand-curated fields (subspecialties, locations, acceptingNew) untouched
- Show me a diff before writing the file

**4. Verify a provider detail page renders with real data.**
- Open http://localhost:3000/en/doctors/daniel-tarditi-do-facc in a way you can describe (curl the page, check for my photo path and bio text)
- Spot-check 2-3 other providers
- Fix any layout issues that pop up with real bio lengths (some bios will be longer than my placeholder)

**5. Commit and push.**
- `git add .`
- `git commit -m "Week 2: real provider photos and bios from hearthousenj.com"`
- `git push`
- Vercel will redeploy automatically. Tell me the expected staging URL once it's live.

**Ground rules for this session and every future session**:
- Execute directly. Don't ask permission for each step.
- No em dashes anywhere.
- No padding phrases ("highlights the importance of," "plays a crucial role in," etc.).
- Show me what you're about to do, do it, show me the result. Move on.
- If you hit a real blocker (API failure, missing credential, ambiguous decision), stop and ask. Otherwise keep going.
- If you write code or content, follow the style guide in CLAUDE.md under "Communication preferences."

When step 5 is done, give me a short status update with: what worked, what didn't, what I need to do before the next session, and what we're tackling next.

Start with step 1.

---

## After this session: subsequent kickoff prompts

You don't need a long prompt every time. Once Claude Code knows the project, future sessions can start as simple as:

> Read CLAUDE.md. We're picking up week 2. The scraper failed for 3 providers last time. Let's fix those manually, then start on the locations detail pages.

Or:

> Read CLAUDE.md. The Rater8 vendor call gave us their API endpoint and a per-provider ID mapping. Wire it up in `app/api/reviews/rater8/route.ts`. The docs are at [URL].

Or just:

> Read CLAUDE.md. What were we working on?

Claude Code reads the file, sees the roadmap checkboxes, and tells you where you left off.

## What to do if something breaks

If `pnpm install` fails: most common cause is Node version. Run `node --version`. If it's below 18, install Node 18+ via nvm or download from nodejs.org. Then retry.

If the dev server starts but a page errors: paste the error into Claude Code and ask it to fix. The CLAUDE.md context plus the actual stack trace is usually enough.

If the scraper fails for most providers: hearthousenj.com may have changed their HTML structure or blocked the user agent. Tell Claude Code to inspect one profile page manually and update the cheerio selectors in `scripts/scrape-providers.ts`.

If git push asks for credentials: GitHub now requires a personal access token instead of password. Create one at https://github.com/settings/tokens, scope it to `repo`, paste it when prompted. Or set up SSH keys (better long-term): https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## What to expect time-wise

- Step 1 (install + verify): 5-10 min
- Step 2 (scraper): 5-10 min runtime, maybe 5-15 min fixing edge cases
- Step 3 (merge data): 10-15 min, mostly Claude Code reading and writing
- Step 4 (verify): 10 min
- Step 5 (commit + push): 2 min

Total session: 45-60 minutes for a clean run, up to 2 hours if the scraper needs babysitting. Plan accordingly.

Good luck. Come back here (claude.ai) when you want to talk through the next strategic decision, content review, or any non-coding question.
