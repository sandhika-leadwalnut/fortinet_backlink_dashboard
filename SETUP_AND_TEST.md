# Fortinet Backlink Dashboard: setup and September test

One repo holds every month: **https://github.com/sandhika-leadwalnut/fortinet_backlink_dashboard**

How a monthly update works:

1. Someone attaches the month's Word doc in Claude and asks to update the Fortinet dashboard.
2. The skill checks the doc, builds the data and screenshots, and shows a summary.
3. After a "yes", **Claude pushes to GitHub itself**. No terminal, no local folder.
4. GitHub Actions deploys to Vercel and gives that month its own link:
   `https://fortinet-backlinking-dashboard-<month><year>.vercel.app`

Each deployment is a frozen copy, so earlier months' links keep showing their own data.

**Already done:** repo created, dashboard code and automation pushed, Claude GitHub App installed.

---

## Part 1: Connect Vercel (one time, about 10 minutes)

### 1.1 Create a Vercel project for this repo
Use a **new** project, so the live September dashboard is never touched by tests.

1. vercel.com > the team the September dashboard is in > **Add New** > **Project**.
2. Import `sandhika-leadwalnut/fortinet_backlink_dashboard`.
3. Project name `fortinet-backlink-dashboard`, framework **Vite** (auto-detected) > **Deploy**.
   This first deploy will fail because the repo has no month's data yet. That is expected; ignore it.

The repo's `vercel.json` switches off Vercel's own deploy-on-push. GitHub Actions does the deploying.

### 1.2 Collect three values

| Secret name | Where to find it |
|---|---|
| `VERCEL_TOKEN` | Vercel > avatar > **Account Settings** > **Tokens** > Create (scope: the team). Copy it right away. |
| `VERCEL_ORG_ID` | Vercel > team > **Settings** > General > **Team ID** |
| `VERCEL_PROJECT_ID` | Vercel > `fortinet-backlink-dashboard` > **Settings** > General > **Project ID** |

### 1.3 Add them to GitHub
GitHub repo > **Settings** > **Secrets and variables** > **Actions** > **Secrets** tab > **New repository secret**. Add all three with exactly those names.

### 1.4 Turn on test mode
The real name `fortinet-backlinking-dashboard-september2026` already belongs to the old September project. For the test, add a suffix:

Same page > **Variables** tab > **New repository variable**:
- Name: `LINK_SUFFIX`
- Value: `-test`

While this variable exists, every deployment goes to `...-<month><year>-test.vercel.app`. Delete it after testing (Part 3).

### 1.5 Check repo access
- Sandhika: repo **Settings** > **Collaborators** > add each person who will run updates (Write access).
- Each of those people: link GitHub in Claude (**Settings** > **Connectors** > **GitHub**).

---

## Part 2: Run the September test

### 2.1 Run the skill
1. Save the latest version of the `fortinet-dashboard-monthly-update` skill (from the card in the chat).
2. Open a **new** Claude chat, attach `Backlink_Performance_Dashboard_data.docx` (September 2026) and type:
   > Update the Fortinet dashboard with this doc
3. Claude will:
   - get access to the repo and check the doc;
   - show a summary (September 2026, 45 URLs, 993 of 1,220 backlinks, 82 keywords, 13 screenshots) and any warnings. Expect one: Dec'25 Page 1 count, 35 in the doc vs 34 in the ranking table;
   - tell you which link it will create and ask before pushing.
4. Say **yes**. Claude pushes and gives you the link to the GitHub Actions run.

### 2.2 Watch the deploy
GitHub repo > **Actions** > **Deploy monthly dashboard**. It takes about 2 minutes. When it is green, the run summary shows:
`https://fortinet-backlinking-dashboard-september2026-test.vercel.app`

### 2.3 Compare with the live September dashboard
Open both side by side:
- Test: https://fortinet-backlinking-dashboard-september2026-test.vercel.app
- Live: https://fortinet-backlinking-dashboard-september2026.vercel.app

- [ ] Header: "December 2025 - September 2026" (the date at the top is the day you ran it, unless you gave Claude a date)
- [ ] KPI cards: 45 / 82 / 1,220 / 993
- [ ] Business impact: 6 to 18, 35 to 44; bars 41683/46105, 6085/7172, 10662/12459
- [ ] DA split: 124 / 698 / 171
- [ ] Monthly acquisition trend: Jan '26 to Sep '26, ending at 993
- [ ] Keyword lists: 18 in Top 3, 44 on First Page
- [ ] Performance summary: 45 rows (click **Read More**)
- [ ] Key findings: 5 points
- [ ] Key highlights: 6 SERP screenshots, 4 LLM charts, 3 guest posts, each with the right text and link

Known differences (the test follows the Word doc; the live site had hand-typed errors):

| Where | Live site | Test site |
|---|---|---|
| Cyber Attack highlight link | what-is-secops page | what-is-cyber-attack page |
| 3rd guest post | helpinus.net link and screenshot | techslassh.com.co link and screenshot from the doc |
| Summary table: Cloud Data Protection, PAM, Cyber Risk, Post-Quantum Cryptography, SIEM | Best/Worst move typed by hand | Calculated with the same rule as every other row |
| Small text | "Jul'26", 'single quotes' | "Jul '26", "double quotes" as in the doc |

---

## Part 3: After the test

1. **Remove test mode:** GitHub > Settings > Secrets and variables > Actions > Variables > delete `LINK_SUFFIX`.
2. **September's real link (optional):** to serve `...-september2026` from the new project too, go to the old September project in Vercel > **Settings** > **Domains** and remove that domain. Then GitHub > **Actions** > **Deploy monthly dashboard** > **Run workflow** (leave *link_name* empty). Skip this and September simply stays on the old project.
3. **Remove the test link (optional):** Vercel > `fortinet-backlink-dashboard` > **Settings** > **Domains** > remove the `-test` domain.
4. From October onwards: attach the doc in Claude, say yes, and the new month gets `...-october2026.vercel.app` automatically.

---

## Troubleshooting

| What you see | What to do |
|---|---|
| Claude says it cannot push / "no GitHub access" | That person has not linked GitHub in Claude, or is not a collaborator on the repo (Part 1.5). |
| Actions run fails at **Deploy to Vercel** | A Vercel secret is wrong or missing (Part 1.2 and 1.3). The token must have access to the team. |
| Actions run fails at **Attach the monthly link**: domain in use | That link name belongs to another Vercel project, usually the old September one. Use test mode (Part 1.4) or remove the domain from the old project (Part 3, step 2). |
| Actions run fails at **Check the build works** | Tell Claude; it will run the doc check and say what to fix. |
| A month's link shows wrong data | Send Claude the corrected doc for that month. Only that month's link changes. |
| Need an old month's data | `data/history/<YYYY-MM>.json` and `monthly-docs/` in the repo keep every month. |
