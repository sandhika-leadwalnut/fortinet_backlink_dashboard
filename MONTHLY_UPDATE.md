# Monthly dashboard update

Every monthly number, text and screenshot on the dashboard comes from one file: `data/report.json`.
That file is generated from the monthly Word doc. Nobody edits components or `mockData.ts` by hand.

## How to update (the short version)

1. Save the month's Word doc into `monthly-docs/` (for example `monthly-docs/2026-10 Backlink Performance Dashboard data.docx`).
2. Run:
   ```
   python3 scripts/update_dashboard.py "monthly-docs/2026-10 Backlink Performance Dashboard data.docx" --report-date "November 6 2026"
   ```
   Use `--dry-run` first to only check the doc.
3. Read the report it prints.
   - **PROBLEMS**: fix the Word doc and run again. Do not publish.
   - **WARNINGS**: check them; publishing is allowed.
4. `npm run build` must succeed. `npm run dev` shows the page locally.
5. Commit and push to `main` of `sandhika-leadwalnut/fortinet_backlink_dashboard`. GitHub Actions deploys to Vercel and attaches `https://fortinet-backlinking-dashboard-<month><year>.vercel.app` (month taken from the doc). Earlier months' links keep their own data. First-time setup: see `SETUP_AND_TEST.md`.

The Claude skill `fortinet-dashboard-monthly-update` does all of this for you, including the push: just attach the doc in Claude.

## What the script does

- Reads the Word doc (Python standard library only, nothing to install).
- Calculates the derived columns:
  - **Backlink growth** per URL = last value of the "Total Backlinks" row (or the sum of "Backlink Added" if there is no total row).
  - **PA change** = last month PA minus first month PA.
  - **Best keyword move** = the keyword with the biggest rank improvement (first month rank minus last month rank), shown as `(+N)`. `-` if nothing improved.
  - **Worst keyword move** = among the other keywords, the one with the smallest movement, shown as `(-N)`. `-` if it did not move.
  - **Keywords in Top 3 / on First Page lists** = every tracked keyword whose current rank is 1 to 3 / 1 to 10. Position change = first month rank minus current rank (101 means not ranking).
- Copies the screenshots out of the doc into `public/reports/<YYYY-MM>/`.
- Archives last month's `report.json` into `data/history/<YYYY-MM>.json`.
- Cross-checks the doc: URL count, keyword count, Top 3 / Page 1 counts, growth chart vs actual total, DA split total.

Short URL names in the summary table come from `data/url-labels.json`. A new URL gets a name from its slug and a warning; edit the file if you want a nicer name.

## Rules for the Word doc

Keep the same layout as the September 2026 doc. The script looks for these labels:

| Section | What it needs |
|---|---|
| Top line | The report month, e.g. `Oct 2026` |
| KPIs | `URLs Tracked - 45`, `PLAN TOTAL BACKLINKS (Oct) - 1300`, `Actual Total Backlinks (Oct) - 1050`, `Keywords Tracked - 82` |
| DA split | Lines like `DA 71–100: 124` |
| Keyword impact | Under `Keywords in Top 3 Positions` and `Keywords on First Page`: two lines each, `Dec’25 - 6` and `Oct’26 - 20` |
| Overall rankings | `Page 1 Baseline - 41683  Oct - 47000`, same for `Position 1` and `Position 2 & 3` |
| Growth chart | `Here are the Months they are tracked for` with the month list, then one total per line |
| URL list | `Page URLs (45 Page URLs)` followed by one URL per line, in the same order as the ranking table |
| Ranking table | `For the given URLs above, here are the Total Backlinks, Ranking & Page Authority ...`, a month header line, then tab-separated rows. Each URL block is `Total Backlinks`, `Backlink Added`, one row per keyword, and ends with `Page Authority` |
| Key findings | Under `Key Findings`, one line per finding written as `Title: description` |
| Sheet link | Under `Backlink Acquisition Details`, a hyperlink to the monthly backlinks sheet |
| SERP highlights | A group line like `Priority Category pages - <description>`, then per keyword: `Keyword - ...`, `Link - ...`, `Position - ...`, **the screenshot pasted right there**, `Insight: ...` |
| LLM highlights | Chart title line, its screenshot, `Insight: ...` (extra lines starting with `-` become bullet lines). One screenshot per chart, in the same order |
| Guest posts | `Listicle-type Guest Posts - ...`, then each article as a hyperlinked title with its screenshot, then one `Insight: ...` |

Screenshots must be pasted into the doc as images (not links). For LLM charts and guest posts they are matched to titles by order, so keep one image per item.
