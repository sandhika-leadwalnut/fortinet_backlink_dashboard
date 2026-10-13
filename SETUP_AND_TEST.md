# Fortinet Backlink Dashboard: how the monthly update works

Repo: **https://github.com/sandhika-leadwalnut/fortinet_backlink_dashboard** (one repo for every month)

## The flow

1. **Attach the month's Word doc** in a new Claude chat and type: *Update the Fortinet dashboard with this doc*.
2. **Claude checks the doc** and builds the data and the 13 screenshots. You get a short summary plus anything to double-check.
3. **Claude shows you the dashboard in the chat** as a private preview page, exactly as it will look when published (charts, tables, screenshots, links). Nothing is public yet.
4. **Ask for corrections, if any.** Tell Claude what to change, e.g. *"Key finding 2 should say 26%"*, *"the SASE insight has a typo"*, *"use this screenshot for Cyber Attack"* (attach it). Claude applies the changes and refreshes the same preview. Repeat until it looks right.
   For number changes, also fix the Word doc so the records match.
5. **Claude asks for a link name (optional).**
   - Type a name, e.g. `fortinet-backlinking-dashboard-september2026-copy`, or
   - say **skip** to use the default monthly link: `fortinet-backlinking-dashboard-<month><year>`, e.g. `...-october2026`.
6. **Say "yes" to publish.** Claude pushes to GitHub itself. GitHub Actions deploys to Vercel and attaches the link.
7. **Claude waits for the deploy (about 1 to 2 minutes) and gives you the final link in the chat**:
   `https://<link name>.vercel.app`

The preview page is private to the person who ran the update. To let a colleague review it before publishing, use the page's **Share** menu.

Each deployment is a frozen copy. Publishing October never changes September's link. Re-publishing the same month with the same link name replaces only that link (use this for corrections).

Link name rules: lowercase letters, numbers and `-` only (no `_` or spaces), up to 63 characters. Claude fixes small mistakes and warns you if the name looks like another month's link, because publishing would replace that month.

---

## One-time setup (status)

| Step | Status |
|---|---|
| Repo created, code and automation pushed | Done |
| Claude GitHub App installed on the repo | Done |
| Vercel project `fortinet-backlink-dashboard` created | Done |
| GitHub secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` | Done. The token must be **team-scoped (Leadwalnut)**, not project-scoped, or attaching the link fails with "User not found". |
| `LINK_SUFFIX` repo variable | No longer used. If you created it, delete it: repo **Settings** > **Secrets and variables** > **Actions** > **Variables**. |
| Each person who runs updates | Needs GitHub linked in Claude (**Settings** > **Connectors** > **GitHub**) and Write access to the repo (Sandhika adds them under repo **Settings** > **Collaborators**). |
| Public access to the links | Vercel project **Settings** > **Deployment Protection** > turn **Vercel Authentication** off, otherwise the links ask for a Vercel login. |
| Repo visibility | Currently public. Recommended: make it private (repo **Settings** > General > Danger Zone). |

---

## Test it with the September doc

1. Save the latest `fortinet-dashboard-monthly-update` skill (from the card in the chat).
2. Open a **new** Claude chat, attach the September 2026 doc, and type *Update the Fortinet dashboard with this doc*.
3. Check the preview Claude shows you. Ask for a small correction to try it (you can change it back).
4. When Claude asks for the link name, type **`fortinet-backlinking-dashboard-september2026-copy`**.
   Do **not** skip for September: the default `...-september2026` belongs to the old September dashboard and would be replaced.
5. Say **yes** to publish.
6. Claude replies with: `https://fortinet-backlinking-dashboard-september2026-copy.vercel.app`
7. Open it next to the live dashboard (https://fortinet-backlinking-dashboard-september2026.vercel.app) and check:

- [ ] KPI cards: 45 / 82 / 1,220 / 993
- [ ] Business impact: 6 to 18, 35 to 44; bars 41683/46105, 6085/7172, 10662/12459
- [ ] DA split: 124 / 698 / 171
- [ ] Monthly acquisition trend: Jan '26 to Sep '26, ending at 993
- [ ] Keyword lists: 18 in Top 3, 44 on First Page
- [ ] Performance summary: 45 rows (click **Read More**)
- [ ] Key findings: 5 points
- [ ] Key highlights: 6 SERP screenshots, 4 LLM charts, 3 guest posts, each with the right text and link

Known differences (the new version follows the Word doc; the live site had hand-typed errors):

| Where | Live site | New version |
|---|---|---|
| Cyber Attack highlight link | what-is-secops page | what-is-cyber-attack page |
| 3rd guest post | helpinus.net link and screenshot | techslassh.com.co link and screenshot from the doc |
| Summary table: Cloud Data Protection, PAM, Cyber Risk, Post-Quantum Cryptography, SIEM | Best/Worst move typed by hand | Calculated with the same rule as every other row |
| Small text | "Jul'26", 'single quotes' | "Jul '26", "double quotes" as in the doc |

From October onwards you can simply say **skip** at the link question and get `...-october2026`.

**Testing with another month's doc:** same steps. If you skip the link name, it publishes to that month's default link (e.g. `...-august2026`). If that is only a test, give a test name instead (e.g. `...-august2026-test`) so the real link stays free for the real report.

---

## Troubleshooting

| What you see | What to do |
|---|---|
| Claude says it cannot push / "no GitHub access" | Link GitHub in Claude and make sure you are a collaborator with Write access. |
| Deploy fails at **Deploy to Vercel** | A Vercel secret is wrong or missing. |
| Deploy fails at **Attach the monthly link**: "User not found" | `VERCEL_TOKEN` is project-scoped. Create a token with scope **Leadwalnut** (team) and replace the secret. |
| Deploy fails at **Attach the monthly link**: domain in use | That link name belongs to another Vercel project (e.g. the old September one). Publish again with a different link name. |
| Deploy fails at **Check the build works** | Tell Claude; it will re-check the doc and say what to fix. |
| A month's link shows wrong data | Send Claude the corrected doc and use the same link name. Only that link changes. |
| Need an old month's data | `data/history/<YYYY-MM>.json` and `monthly-docs/` in the repo keep every month. |

Manual fallback (no Claude): GitHub > **Actions** > **Deploy monthly dashboard** > **Run workflow**, optionally with a link name. This redeploys whatever month is currently in the repo.
