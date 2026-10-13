# Fortinet Backlink Dashboard: setup and September test

From now on, one repo holds every month:
**https://github.com/sandhika-leadwalnut/fortinet_backlink_dashboard**

Every push to `main` builds the dashboard from that month's data, deploys it to Vercel and gives it its own link:

```
https://fortinet-backlinking-dashboard-<month><year>.vercel.app
e.g. https://fortinet-backlinking-dashboard-september2026.vercel.app
     https://fortinet-backlinking-dashboard-october2026.vercel.app
```

Each deployment is a frozen copy. When October goes live, the September link keeps showing September data. Pushing a correction for the same month only moves that month's link.

This guide is in four parts:

1. Push the code with September data
2. Connect Vercel (one time, about 15 minutes)
3. Test the September deployment
4. How every month works after that

---

## Part 1: Push the code with September data

### 1.1 Make the repo private (recommended)
The repo is currently **public**. It will contain client numbers, the monthly Word docs and the backlinks sheet link.
GitHub > repo > **Settings** > General > scroll to *Danger Zone* > **Change visibility** > Private.

### 1.2 Push
Your local folder `C:\LeadWalnut\fortinet-dashboard` already has everything:
- the automation (`scripts/update_dashboard.py`)
- the new deploy workflow (`.github/workflows/deploy.yaml`)
- September data (`data/report.json`, `public/reports/2026-09/`, `monthly-docs/`)

In a terminal in that folder, first put the new deploy workflow in place (Claude could not write into `.github/` remotely, so it is waiting in `setup/`):

```
copy /Y setup\deploy.yaml .github\workflows\deploy.yaml
```

(On Mac or Git Bash: `cp setup/deploy.yaml .github/workflows/deploy.yaml`.) Then:

```
git remote rename origin september-repo
git remote add origin https://github.com/sandhika-leadwalnut/fortinet_backlink_dashboard.git
git add -A
git commit -m "Monthly dashboard automation + September 2026 data"
git push -u origin main
```

The old September repo stays as it is on GitHub (only renamed to `september-repo` in your local folder).

> **Expected:** the push starts the workflow, and it fails at **Deploy to Vercel** because Vercel is not connected yet. That is fine. Part 2 fixes it.

---

## Part 2: Connect Vercel (one time)

### 2.1 Create a new Vercel project for this repo
Use a **new** project. Do not reuse the September project, so the live September link is never touched by tests.

1. Go to vercel.com and open the same team the September dashboard is in.
2. **Add New** > **Project** > import `sandhika-leadwalnut/fortinet_backlink_dashboard`.
3. Project name: `fortinet-backlink-dashboard`. Framework preset: **Vite** (auto-detected). Click **Deploy**.

The repo includes `vercel.json`, which switches off Vercel's own auto-deploy on later pushes. GitHub Actions does the deploying, so you never get two deployments per push.

### 2.2 Collect three values

| Value | Where to find it |
|---|---|
| `VERCEL_TOKEN` | Vercel > your avatar > **Account Settings** > **Tokens** > Create. Scope: the team. Copy it right away. |
| `VERCEL_ORG_ID` | Vercel > team > **Settings** > General > **Team ID** |
| `VERCEL_PROJECT_ID` | Vercel > `fortinet-backlink-dashboard` project > **Settings** > General > **Project ID** |

### 2.3 Add them to GitHub
GitHub > repo > **Settings** > **Secrets and variables** > **Actions** > **New repository secret**. Add all three with exactly those names.

---

## Part 3: Test the September deployment

### 3.1 Run a test deployment
GitHub > repo > **Actions** > **Deploy monthly dashboard** > **Run workflow** > in *link_name* type:

```
fortinet-backlinking-dashboard-september2026-test
```

Then **Run workflow**. It takes about 2 minutes.

Why a `-test` name: `fortinet-backlinking-dashboard-september2026` already belongs to the old September project, so the test uses its own link and the live one is never touched. When it is green, open the run: the summary shows the link.

### 3.2 Compare it with the live September dashboard
Open both side by side:
- Test: https://fortinet-backlinking-dashboard-september2026-test.vercel.app
- Live: https://fortinet-backlinking-dashboard-september2026.vercel.app

Checklist:

- [ ] Header: "October 8 2026" and "December 2025 - September 2026"
- [ ] KPI cards: 45 / 82 / 1,220 / 993
- [ ] Business impact charts: 6 to 18, 35 to 44, and the three bar groups (41683/46105, 6085/7172, 10662/12459)
- [ ] DA split: 124 / 698 / 171
- [ ] Monthly acquisition trend: Jan '26 to Sep '26, ending at 993
- [ ] Keyword lists: 18 in Top 3, 44 on First Page
- [ ] Performance summary: 45 rows (click **Read More**)
- [ ] Key findings: 5 points
- [ ] Key highlights: 6 SERP screenshots, 4 LLM charts, 3 guest posts, each with the right text and link

Known differences (the test follows the Word doc, the live site had hand-typed errors):

| Where | Live site | Test site (from the doc) |
|---|---|---|
| Cyber Attack highlight link | what-is-secops page | what-is-cyber-attack page |
| 3rd guest post | helpinus.net link and screenshot | techslassh.com.co link and screenshot from the doc |
| Summary table: Cloud Data Protection, PAM, Cyber Risk, Post-Quantum Cryptography, SIEM | Best/Worst move typed by hand | Calculated with the same rule as all other rows |
| Small text | e.g. "Jul'26", 'single quotes' | "Jul '26", "double quotes" as written in the doc |

### 3.3 Optional: move the real September link to the new project
Only if you want `...-september2026` to be served from the new repo too (the content is the same):

1. Vercel > old September project > **Settings** > **Domains** > remove `fortinet-backlinking-dashboard-september2026.vercel.app`.
2. GitHub > Actions > **Deploy monthly dashboard** > **Run workflow** with *link_name* empty.

If you skip this, nothing breaks: September stays on the old project, and October onwards uses the new one.

### 3.4 Clean up the test link
Vercel > `fortinet-backlink-dashboard` project > **Settings** > **Domains**, or **Deployments** > the test deployment > remove the `-test` alias. Or just leave it.

---

## Part 4: Every month after this

1. Marketing prepares the Word doc in the same format as September (see `MONTHLY_UPDATE.md`, with screenshots pasted under each highlight).
2. In Claude, with the dashboard folder connected: attach the doc and ask to *"update the Fortinet dashboard"*. The skill checks the doc, generates the data and images, builds, and shows a summary.
3. After you say yes, it commits and pushes to `fortinet_backlink_dashboard`.
4. GitHub Actions deploys and attaches `fortinet-backlinking-dashboard-<month><year>.vercel.app` automatically. Earlier months' links do not change.

Without Claude, the same steps by hand:

```
python scripts/update_dashboard.py "monthly-docs/2026-10 Backlink Performance Dashboard data.docx" --report-date "November 6 2026"
npm run build
git add -A
git commit -m "Fortinet dashboard: October 2026 update"
git push
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Workflow fails at **Deploy to Vercel** with an auth or "project not found" error | One of the three secrets is wrong or missing (Part 2.2 and 2.3). The token must have access to the team. |
| Workflow fails at **Attach the monthly link** saying the domain is in use | That link name belongs to another Vercel project (the old September one). Use a different *link_name*, or remove the domain from the old project (Part 3.3). |
| Workflow fails at **Check the build works** | The data has a problem. Run `python scripts/update_dashboard.py "<doc>" --dry-run` and fix what it lists under PROBLEMS. |
| A month's link shows the wrong data | Re-run the update for that month and push. Only that month's link moves. |
| Need an old month's data | `data/history/<YYYY-MM>.json` and `monthly-docs/` keep every month. |
