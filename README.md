# ExDesign Grader

A shared web tool for grading Science Olympiad Experimental Design (Division B) reports
against the official 2026 checklist. Upload photos or a PDF of a team's report, step
through the rubric section by section with the report page right next to it, and get a
copy-pasteable score report at the end.

This is a plain static site (`index.html` + `style.css` + `app.js`) — no build step,
no framework. It uses:
- **Supabase (Postgres + Storage)** — free, shared database so every judge who opens
  the site sees the same invitational, roster, and grading progress. No credit card
  required for the free tier.
- **GitHub Pages** — free hosting for the site itself.

The best way to actually get this running is to open this whole folder in
**Claude Code** and work through the steps below with it — it can run the commands,
edit files, and troubleshoot errors with you as you go, rather than you copy-pasting
into a terminal by hand.

---

## 1. Create a Supabase project (free)

1. Go to https://supabase.com/dashboard → sign in (GitHub login is easiest) →
   **New project** → name it anything (e.g. "exdesign-grader") → generate/set a
   database password (you won't need it again — the app doesn't use it) → pick any
   region → Create project. Wait a minute or two for it to finish provisioning.
2. Left sidebar: **SQL Editor → New query** → paste in the entire contents of
   `supabase-schema.sql` from this folder → **Run**. This creates the two tables the
   app needs, opens them up with starter access policies, and creates the
   `report-photos` storage bucket.
3. Left sidebar: **Project Settings → API**. Copy the **Project URL** and the
   **anon public** key into `supabase-config.js` in this folder, replacing the
   `PASTE_...` placeholders.

   The starter policies in `supabase-schema.sql` are intentionally open (anyone with
   your anon key can read/write) so you can get grading immediately with a small
   trusted group of judges. The tradeoff is explained in the comments in that file —
   add Supabase Auth later if you want real access control.

## 2. Put it on GitHub Pages

1. Create a new repo on GitHub (public — GitHub Pages needs a public repo on the free
   plan).
2. Push this whole folder to it:
   ```
   git init
   git add .
   git commit -m "Initial ExDesign Grader"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
3. On GitHub: repo → **Settings → Pages** → Source: **Deploy from a branch** →
   Branch: `main`, folder `/ (root)` → Save.
4. GitHub gives you a live URL in a minute or two, usually
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`. That's the link you share with judges.

## 3. Using it

- Open the GitHub Pages URL in Chrome (or any browser).
- Create an invitational (e.g. "Rickards Invitational") — this is now shared: anyone
  who opens the same link and selects it sees the same roster and scores.
- Add teams to the roster as you get them, in any order, any time.
- Click **Grade** on a team, then upload photos or a PDF of their report — a PDF gets
  split into individual page images automatically.
- The report page is shown large on the left, with a thumbnail strip to jump to any
  page. Step through the rubric section by section (A, B, C, …) using the section tabs
  or the Next/Previous buttons — each section shows the exact wording of what's being
  checked, right next to the report.
- When you're done with a team, click **Finalize & Delete Photos** — this removes the
  uploaded images from Supabase Storage to keep it light, while keeping the scores and
  the copy-pasteable score report.
- Copy the **Score Report** box and send it straight to the team.

## Costs

Supabase and GitHub Pages both have generous free tiers that comfortably cover a single
invitational's worth of judging — this whole setup should cost nothing.

## File map

```
index.html            the page
style.css              styling
app.js                 all the app logic (rubric, Supabase, grading UI)
supabase-config.js     your Supabase project URL + anon key (safe to commit)
supabase-schema.sql    table + storage bucket setup to run once in Supabase's SQL Editor
```
