#!/usr/bin/env python3
"""Turn the monthly "Backlink Performance Dashboard data" Word doc into data/report.json.

Usage (run from the dashboard folder):
    python3 scripts/update_dashboard.py "path/to/Backlink_Performance_Dashboard_data.docx" [--report-date "October 8 2026"] [--dry-run]

What it does:
  1. Reads the Word doc (standard library only, nothing to install).
  2. Pulls every number the dashboard needs and calculates the derived values
     (backlink growth, PA change, best/worst keyword move, Top 3 / Page 1 keyword lists).
  3. Extracts the highlight screenshots embedded in the doc into public/reports/<YYYY-MM>/.
  4. Archives the previous data/report.json into data/history/ and writes the new one.
  5. Prints a validation report. Anything under "PROBLEMS" must be fixed before publishing.

Exit code 0 = no problems, 2 = problems found (report.json is still written unless --dry-run).
"""
import argparse
import datetime as dt
import json
import os
import re
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from docx_blocks import read_blocks, read_media  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")
PUBLIC = os.path.join(ROOT, "public")

MONTHS = ["january", "february", "march", "april", "may", "june", "july",
          "august", "september", "october", "november", "december"]
MONTH_RE = r"(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*"
MONTH_YY = re.compile(MONTH_RE + r"\s*['’`]\s*(\d{2})", re.I)

problems, warnings, notes = [], [], []


def month_index(token):
    return [m[:3] for m in MONTHS].index(token[:3].lower())


def month_short_label(idx, yy):
    return f"{MONTHS[idx][:3].title()} '{yy}"


def norm(s):
    return re.sub(r"\s+", " ", (s or "").replace(" ", " ")).strip()


def slugify(s, n=40):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:n].strip("-") or "image"


def find(blocks, pred, start=0):
    for i in range(start, len(blocks)):
        if pred(norm(blocks[i]["text"])):
            return i
    return -1


def starts(prefix):
    p = prefix.lower()
    return lambda t: t.lower().startswith(p)


def num(s):
    s = (s or "").strip().replace(",", "")
    return int(s) if re.fullmatch(r"-?\d+", s) else None


# ---------------------------------------------------------------- sections

def parse_report_month(blocks):
    for b in blocks[:5]:
        m = re.fullmatch(MONTH_RE + r"\s+(\d{4})", norm(b["text"]), re.I)
        if m:
            return month_index(m.group(1)), int(m.group(2))
    problems.append("Could not find the report month at the top of the doc (expected a line like 'Sep 2026').")
    return None, None


def parse_kpis(blocks):
    pats = {
        "urlsTracked": r"^urls tracked\s*[-–:]\s*([\d,]+)",
        "planTotalBacklinks": r"^plan total backlinks.*?[-–:]\s*([\d,]+)\s*$",
        "totalBacklinks": r"^actual total backlinks.*?[-–:]\s*([\d,]+)\s*$",
        "keywordsTracked": r"^keywords tracked\s*[-–:]\s*([\d,]+)",
    }
    out = {}
    for key, pat in pats.items():
        for b in blocks:
            m = re.search(pat, norm(b["text"]), re.I)
            if m:
                out[key] = num(m.group(1))
                break
        if key not in out:
            problems.append(f"KPI missing in doc: {key}")
    return out


def parse_da(blocks):
    found = {}
    for b in blocks:
        for m in re.finditer(r"DA\s*(\d+)\s*[–-]\s*(\d+)\s*:\s*([\d,]+)", b["text"]):
            found[(int(m.group(1)), int(m.group(2)))] = num(m.group(3))
    if not found:
        problems.append("Referring domain DA split not found (expected lines like 'DA 41–70: 698').")
    return [{"name": f"DA {lo}-{hi}", "value": v} for (lo, hi), v in sorted(found.items())]


def parse_two_point(blocks, heading):
    i = find(blocks, starts(heading))
    if i < 0:
        problems.append(f"Section '{heading}' not found.")
        return None
    vals = []
    for b in blocks[i + 1:i + 6]:
        t = norm(b["text"])
        m = re.match(MONTH_RE + r"\s*['’`]\s*(\d{2})\s*[-–:]\s*(\d+)", t, re.I)
        if m:
            vals.append({"label": f"{m.group(1)[:3].title()}'{m.group(2)}", "monthIdx": month_index(m.group(1)),
                         "yy": m.group(2), "value": int(m.group(3))})
        if len(vals) == 2:
            break
    if len(vals) != 2:
        problems.append(f"'{heading}' needs two lines like \"Dec'25 - 6\" and \"Sep'26 - 18\".")
        return None
    return vals


def parse_overall(blocks):
    names = [("page 1", "Page 1\n(Positions 1-10)"), ("position 1 ", "Position 1"),
             ("position 2", "Positions 2 & 3")]
    out = []
    for key, label in names:
        hit = None
        for b in blocks:
            t = norm(b["text"])
            if t.lower().startswith(key) and "baseline" in t.lower():
                hit = re.findall(r"[-–:]\s*([\d,]+)", t)
                break
        if not hit or len(hit) < 2:
            problems.append(f"Overall rankings line for '{label.splitlines()[0]}' not found "
                            "(expected 'Page 1 Baseline - 41683  Sep - 46105').")
            continue
        out.append({"name": label, "baseline": num(hit[0]), "current": num(hit[1])})
    return out


def parse_growth(blocks):
    i = find(blocks, lambda t: "months they are tracked" in t.lower())
    if i < 0:
        problems.append("Monthly backlink growth section not found ('Here are the Months they are tracked for').")
        return []
    months = MONTH_YY.findall(blocks[i]["text"])
    j = i + 1
    if not months:  # month labels on the next line
        months = MONTH_YY.findall(blocks[j]["text"])
        j += 1
    values = []
    for b in blocks[j:]:
        t = norm(b["text"])
        if not t or "total backlinks added" in t.lower():
            continue
        parts = re.findall(r"[\d,]+", t)
        if re.fullmatch(r"[\d,\s\t]+", t):
            values.extend(num(p) for p in parts)
        else:
            break
    if len(values) != len(months):
        problems.append(f"Backlink growth: {len(months)} months but {len(values)} values.")
    out = [{"month": month_short_label(month_index(m), yy), "totalBacklinks": v}
           for (m, yy), v in zip(months, values)]
    for a, b in zip(out, out[1:]):
        if b["totalBacklinks"] < a["totalBacklinks"]:
            warnings.append(f"Backlink growth goes down from {a['month']} ({a['totalBacklinks']}) to "
                            f"{b['month']} ({b['totalBacklinks']}). These are cumulative totals; please check.")
    return out


def parse_tracked_urls(blocks):
    i = find(blocks, starts("page urls"))
    if i < 0:
        i = find(blocks, lambda t: "page urls tracked" in t.lower())
    if i < 0:
        problems.append("Tracked URL list not found ('Page URLs (..)').")
        return []
    urls = []
    for b in blocks[i + 1:]:
        t = norm(b["text"])
        if re.match(r"https?://", t):
            urls.append(t.split()[0])
        elif urls:
            break
    return urls


def parse_rank_table(blocks):
    i = find(blocks, lambda t: "total backlinks, ranking" in t.lower() or "ranking & page authority" in t.lower())
    if i < 0:
        problems.append("Per-URL ranking table not found ('For the given URLs above, here are the Total Backlinks, Ranking ...').")
        return [], []
    months = MONTH_YY.findall(blocks[i + 1]["text"])
    start = i + 2
    if not months:
        months = MONTH_YY.findall(blocks[i]["text"])
        start = i + 1
    labels = [f"{m[:3].title()}'{yy}" for m, yy in months]
    rows = []
    for b in blocks[start:]:
        if "\t" not in b["text"]:
            if rows:
                break
            continue
        cells = b["text"].split("\t")
        name = norm(cells[0])
        vals = []
        for c in cells[1:]:
            c = c.strip()
            vals.append(None if c.upper() in ("", "N/A", "NA", "-") else num(c))
        if len(vals) != len(labels):
            warnings.append(f"Row '{name}' has {len(vals)} values but there are {len(labels)} months.")
            vals = (vals + [None] * len(labels))[:len(labels)]
        rows.append((name, vals))

    groups, cur = [], None
    for name, vals in rows:
        low = name.lower()
        kind = ("total" if low.startswith("total ba") else
                "added" if low.startswith("backlink added") else
                "pa" if low.startswith("page authority") else "keyword")
        if cur is None or (cur.get("pa") is not None and kind != "pa"):
            cur = {"total": None, "added": None, "keywords": [], "pa": None}
            groups.append(cur)
        if kind == "keyword":
            cur["keywords"].append({"name": name, "ranks": vals})
        else:
            cur[kind] = vals
    return labels, groups


def keyword_moves(keywords):
    """first-month rank minus last-month rank. Positive = moved up."""
    moves = []
    for kw in keywords:
        nums = [v for v in kw["ranks"] if v is not None]
        last = kw["ranks"][-1]
        if not nums or last is None:
            continue
        moves.append({"name": kw["name"], "change": nums[0] - last, "rank": last, "first": nums[0]})
    return moves


def best_worst(moves):
    """Rules used on the dashboard:
    Best  = keyword with the biggest improvement, shown as (+N). '-' if nothing improved.
    Worst = among the remaining keywords, the one with the smallest movement, always shown as (-N).
            '-' if it did not move at all or there is no other keyword.
    """
    best, worst = "-", "-"
    rest = list(moves)
    if rest:
        top = max(rest, key=lambda m: m["change"])
        if top["change"] > 0:
            best = f"{top['name']} (+{top['change']})"
            rest = [m for m in rest if m is not top]
    if rest:
        low = min(rest, key=lambda m: m["change"])
        if low["change"] != 0:
            worst = f"{low['name']} (-{abs(low['change'])})"
    return best, worst


def section(blocks, start_pred, end_pred):
    s = find(blocks, start_pred)
    if s < 0:
        return []
    e = find(blocks, end_pred, s + 1)
    return blocks[s + 1:(e if e >= 0 else len(blocks))]


def parse_key_findings(blocks):
    # use the last "Key Findings" heading (the first one is an instruction heading)
    idxs = [i for i, b in enumerate(blocks) if norm(b["text"]).lower() == "key findings"]
    if not idxs:
        problems.append("'Key Findings' section not found.")
        return []
    out = []
    for b in blocks[idxs[-1] + 1:]:
        t = norm(b["text"])
        if t.lower().startswith("backlink acquisition details") or t.lower().startswith("serp key"):
            break
        m = re.match(r"^([^:]{3,90}):\s*(.+)$", t)
        if m:
            out.append({"title": m.group(1).strip(), "description": m.group(2).strip()})
        elif t and out:
            out[-1]["description"] += " " + t
    if not out:
        problems.append("No key findings found. Each one should be written as 'Title: description'.")
    return out


def parse_sheet_link(blocks):
    sec = section(blocks, starts("backlink acquisition details"), starts("serp key"))
    for b in sec:
        for ln in b["links"]:
            return ln["url"]
    warnings.append("No link found under 'Backlink Acquisition Details'; keeping the previous sheet link.")
    return None


def strip_label(t, label):
    return re.sub(rf"^{label}\s*[-–:]\s*", "", t, flags=re.I).strip()


def parse_serp(blocks, images_out):
    sec = section(blocks, starts("serp key highlights"), starts("llm key highlights"))
    if not sec:
        problems.append("'SERP Key Highlights' section not found.")
        return []
    groups, item, pending_imgs = [], None, []
    for b in sec:
        t = norm(b["text"])
        low = t.lower()
        for img in b["images"]:
            if item is not None and item.get("image") is None:
                item["image"] = img
            else:
                pending_imgs.append(img)
        if not t:
            continue
        if low.startswith("keyword"):
            item = {"keyword": strip_label(t, "keyword"), "link": None, "position": None,
                    "image": pending_imgs.pop(0) if pending_imgs else None, "insight": ""}
            if not groups:
                groups.append({"title": "Highlights", "description": "", "items": []})
            groups[-1]["items"].append(item)
        elif low.startswith("link") and item is not None:
            item["link"] = (b["links"][0]["url"] if b["links"] else strip_label(t, "link")).strip()
        elif low.startswith("position") and item is not None:
            item["position"] = num(strip_label(t, "position"))
        elif low.startswith("insight") and item is not None:
            item["insight"] = strip_label(t, "insight")
        elif " - " in t:
            title, desc = t.split(" - ", 1)
            groups.append({"title": title.strip().title(), "description": desc.strip(), "items": []})
            item = None
        elif item is not None and item["insight"]:
            item["insight"] += " " + t
    for g in groups:
        for it in g["items"]:
            if it["image"] is None:
                problems.append(f"SERP highlight '{it['keyword']}' has no screenshot under it.")
            if it["position"] is None:
                warnings.append(f"SERP highlight '{it['keyword']}' has no position.")
            if not it["link"]:
                warnings.append(f"SERP highlight '{it['keyword']}' has no link.")
            if not it["insight"]:
                warnings.append(f"SERP highlight '{it['keyword']}' has no insight.")
            it["image"] = images_out(it["image"], "serp-" + slugify(it["keyword"]))
    return groups


def parse_llm(blocks, images_out):
    sec = section(blocks, starts("llm key highlights"), lambda t: t.lower().startswith("listicle"))
    if not sec:
        problems.append("'LLM Key Highlights' section not found.")
        return []
    items, imgs, cur = [], [], None
    for b in sec:
        imgs.extend(b["images"])
        t = norm(b["text"])
        if not t:
            continue
        low = t.lower()
        if low.startswith("insight"):
            if cur is None:
                continue
            cur["insight"] = [strip_label(t, "insight")]
        elif cur is not None and "insight" in cur and (cur["insight"] == [""] or t.startswith(("-", "•"))):
            line = t.lstrip("-• ").strip()
            if cur["insight"] == [""]:
                cur["insight"] = [line]
            else:
                cur["insight"].append(line)
        else:
            cur = {"title": t}
            items.append(cur)
    if len(imgs) != len(items):
        problems.append(f"LLM highlights: found {len(items)} charts but {len(imgs)} images. "
                        "Each LLM chart needs exactly one screenshot.")
    for it, img in zip(items, imgs):
        it["image"] = images_out(img, "llm-" + slugify(it["title"]))
    for it in items:
        it.setdefault("image", None)
        ins = [s for s in it.get("insight", []) if s]
        if not ins:
            warnings.append(f"LLM highlight '{it['title']}' has no insight.")
        it["insight"] = ins[0] if len(ins) == 1 else ins
    return items


def parse_guest_posts(blocks, images_out):
    i = find(blocks, lambda t: t.lower().startswith("listicle"))
    if i < 0:
        warnings.append("Listicle guest posts section not found; it will be empty.")
        return {"title": "", "items": [], "insight": ""}
    title = norm(blocks[i]["text"])
    posts, imgs, insight = [], [], ""
    for b in blocks[i + 1:]:
        imgs.extend(b["images"])
        t = norm(b["text"])
        if t.lower().startswith("insight"):
            insight = strip_label(t, "insight")
            continue
        if insight and t:
            insight += " " + t
            continue
        if b["links"]:
            ln = b["links"][0]
            posts.append({"title": ln["text"] or re.sub(r"^full article\s*[-–:]\s*", "", t, flags=re.I),
                          "link": ln["url"]})
        elif t and re.search(r"full article\s*[-–:]\s*\S", t, re.I):
            posts.append({"title": re.sub(r"^full article\s*[-–:]\s*", "", t, flags=re.I), "link": None})
            warnings.append(f"Guest post '{t[:60]}' has no hyperlink.")
    if len(imgs) != len(posts):
        problems.append(f"Guest posts: found {len(posts)} articles but {len(imgs)} images.")
    for n, (p, img) in enumerate(zip(posts, imgs), 1):
        p["image"] = images_out(img, f"listicle-{n}-" + slugify(p["title"], 30))
    for p in posts:
        p.setdefault("image", None)
    return {"title": title, "items": posts, "insight": insight}


# ---------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docx")
    ap.add_argument("--report-date", help='Date shown at the top, e.g. "October 8 2026". Default: today.')
    ap.add_argument("--dry-run", action="store_true", help="Validate only; write nothing.")
    ap.add_argument("--link-name", help="Optional custom Vercel link name, e.g. fortinet-backlinking-dashboard-september2026-copy. "
                                        "Default: fortinet-backlinking-dashboard-<month><year>.")
    args = ap.parse_args()

    blocks = read_blocks(args.docx)
    m_idx, year = parse_report_month(blocks)
    if m_idx is None:
        report(None)
        sys.exit(2)
    month_key = f"{year}-{m_idx + 1:02d}"
    img_dir = os.path.join(PUBLIC, "reports", month_key)
    extracted = []

    def images_out(member, name):
        if not member:
            return None
        ext = os.path.splitext(member)[1].lower() or ".png"
        fname = f"{name}{ext}"
        extracted.append((member, fname))
        return f"/reports/{month_key}/{fname}"

    kpis = parse_kpis(blocks)
    da = parse_da(blocks)
    top3_pts = parse_two_point(blocks, "keywords in top 3 positions")
    page1_pts = parse_two_point(blocks, "keywords on first page")
    overall = parse_overall(blocks)
    growth = parse_growth(blocks)
    urls = parse_tracked_urls(blocks)
    rank_months, groups = parse_rank_table(blocks)
    key_findings = parse_key_findings(blocks)
    sheet = parse_sheet_link(blocks)
    serp = parse_serp(blocks, images_out)
    llm = parse_llm(blocks, images_out)
    guests = parse_guest_posts(blocks, images_out)

    # ---- labels for URLs
    labels_path = os.path.join(DATA, "url-labels.json")
    labels = json.load(open(labels_path, encoding="utf-8")) if os.path.exists(labels_path) else {}
    new_labels = {}
    for u in urls:
        if u not in labels:
            slug = [p for p in u.rstrip("/").split("/") if p][-1]
            slug = re.sub(r"^what-is-", "", slug)
            new_labels[u] = slug.replace("-", " ").title()
            warnings.append(f"New URL with no short name: {u} -> using '{new_labels[u]}'. "
                            "Edit data/url-labels.json if you want a different name.")

    # ---- performance summary
    if len(groups) != len(urls):
        problems.append(f"The ranking table has {len(groups)} URL blocks but the doc lists {len(urls)} URLs. "
                        "Each URL needs its own block ending with a 'Page Authority' row.")
    summary, all_moves, mismatched = [], [], []
    for u, g in zip(urls, groups):
        moves = keyword_moves(g["keywords"])
        all_moves.extend(moves)
        best, worst = best_worst(moves)
        added_sum = sum(v or 0 for v in (g["added"] or []))
        total_last = next((v for v in reversed(g["total"] or []) if v is not None), None)
        growth_val = total_last if total_last is not None else added_sum
        if g["total"] and g["added"] and total_last != added_sum:
            mismatched.append(f"{labels.get(u) or new_labels.get(u)} ({total_last} vs {added_sum})")
        pa = [v for v in (g["pa"] or []) if v is not None]
        if not pa:
            problems.append(f"{u}: no Page Authority row.")
        summary.append({
            "url": labels.get(u) or new_labels.get(u),
            "urlLink": u,
            "backlinkGrowth": growth_val,
            "paChange": (pa[-1] - pa[0]) if pa else 0,
            "bestKeywordMove": best,
            "worstKeywordMove": worst,
        })

    if mismatched:
        notes.append("Total Backlinks used for growth; it differs from the sum of monthly 'Backlink Added' for: "
                     + ", ".join(mismatched))
    top3 = [{"name": m["name"], "change": m["change"], "rank": m["rank"]} for m in all_moves if m["rank"] <= 3]
    page1 = [{"name": m["name"], "change": m["change"], "rank": m["rank"]} for m in all_moves if m["rank"] <= 10]
    base_top3 = sum(1 for m in all_moves if m["first"] <= 3)
    base_page1 = sum(1 for m in all_moves if m["first"] <= 10)

    # ---- cross checks against numbers typed in the doc
    def check(label, stated, computed):
        if stated is not None and stated != computed:
            warnings.append(f"{label}: doc says {stated}, ranking table gives {computed}. "
                            "The dashboard uses the doc's number; please confirm which is right.")
    if top3_pts:
        check("Keywords in Top 3 (current)", top3_pts[1]["value"], len(top3))
        check("Keywords in Top 3 (baseline)", top3_pts[0]["value"], base_top3)
    if page1_pts:
        check("Keywords on Page 1 (current)", page1_pts[1]["value"], len(page1))
        check("Keywords on Page 1 (baseline)", page1_pts[0]["value"], base_page1)
    n_kw = sum(len(g["keywords"]) for g in groups)
    check("Keywords tracked", kpis.get("keywordsTracked"), n_kw)
    check("URLs tracked", kpis.get("urlsTracked"), len(urls))
    if growth:
        check("Actual total backlinks vs last month in growth chart", kpis.get("totalBacklinks"),
              growth[-1]["totalBacklinks"])
        if growth[-1]["month"] != month_short_label(m_idx, str(year)[2:]):
            warnings.append(f"Growth chart ends at {growth[-1]['month']} but the report month is "
                            f"{month_short_label(m_idx, str(year)[2:])}.")
    if da and kpis.get("totalBacklinks"):
        check("DA split total vs actual total backlinks", kpis["totalBacklinks"], sum(d["value"] for d in da))

    # ---- meta
    base = top3_pts[0] if top3_pts else None
    base_name = f"{MONTHS[base['monthIdx']].title()} 20{base['yy']}" if base else ""
    cur_name = f"{MONTHS[m_idx].title()} {year}"
    default_link = f"fortinet-backlinking-dashboard-{MONTHS[m_idx]}{year}"
    link_name = default_link
    if args.link_name:
        raw = args.link_name.strip().lower()
        raw = re.sub(r"^https?://", "", raw).split("/")[0]
        raw = re.sub(r"\.vercel\.app$", "", raw)
        clean = re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9-]", "-", raw)).strip("-")[:63].strip("-")
        if not clean:
            problems.append(f"Link name '{args.link_name}' has no usable characters.")
        else:
            if clean != raw:
                warnings.append(f"Link name changed to '{clean}' (web addresses can only use a-z, 0-9 and '-').")
            other = re.fullmatch(r"fortinet-backlinking-dashboard-([a-z]+)(\d{4})(.*)", clean)
            if other and (other.group(1), other.group(2)) != (MONTHS[m_idx], str(year)):
                warnings.append(f"Link name '{clean}' looks like another month's link. Publishing would replace "
                                "that month's dashboard. Double-check before publishing.")
            link_name = clean
    report_date = args.report_date or (lambda d: f"{d:%B} {d.day} {d.year}")(dt.date.today())
    meta = {
        "client": "Fortinet",
        "reportMonth": month_key,
        "reportDate": report_date,
        "periodStart": base_name,
        "periodEnd": cur_name,
        "baselineLabel": base["label"] if base else "",
        "currentLabel": f"{MONTHS[m_idx][:3].title()}'{str(year)[2:]}",
        "baselineMonthAbbr": MONTHS[base["monthIdx"]][:3].title() if base else "",
        "currentMonthName": MONTHS[m_idx].title(),
        "linkName": link_name,
        "rankTableMonths": rank_months,
        "sourceFile": os.path.basename(args.docx),
        "generatedAt": dt.datetime.now().isoformat(timespec="seconds"),
    }

    report_json = {
        "meta": meta,
        "kpis": kpis,
        "daDistribution": da,
        "keywordRanking": {
            "top3": {"baseline": top3_pts[0]["value"], "current": top3_pts[1]["value"]} if top3_pts else None,
            "firstPage": {"baseline": page1_pts[0]["value"], "current": page1_pts[1]["value"]} if page1_pts else None,
        },
        "overallRankings": overall,
        "backlinkGrowth": growth,
        "top3Keywords": top3,
        "firstPageKeywords": page1,
        "performanceSummary": summary,
        "keyFindings": key_findings,
        "acquisitionSheetUrl": sheet,
        "highlights": {"serpGroups": serp, "llm": llm, "guestPosts": guests},
    }

    out_path = os.path.join(DATA, "report.json")
    if sheet is None and os.path.exists(out_path):
        report_json["acquisitionSheetUrl"] = json.load(open(out_path, encoding="utf-8")).get("acquisitionSheetUrl")

    if not args.dry_run:
        # archive the previous month
        if os.path.exists(out_path):
            prev = json.load(open(out_path, encoding="utf-8"))
            pm = prev.get("meta", {}).get("reportMonth")
            if pm and pm != month_key:
                os.makedirs(os.path.join(DATA, "history"), exist_ok=True)
                shutil.copy(out_path, os.path.join(DATA, "history", f"{pm}.json"))
                notes.append(f"Archived previous report to data/history/{pm}.json")
        os.makedirs(img_dir, exist_ok=True)
        for member, fname in extracted:
            with open(os.path.join(img_dir, fname), "wb") as f:
                f.write(read_media(args.docx, member))
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(report_json, f, ensure_ascii=False, indent=2)
            f.write("\n")
        if new_labels:
            labels.update(new_labels)
            with open(labels_path, "w", encoding="utf-8") as f:
                json.dump(labels, f, ensure_ascii=False, indent=2)
                f.write("\n")
        notes.append(f"Wrote data/report.json and {len(extracted)} images to public/reports/{month_key}/")

    notes.insert(0, f"Link: https://{link_name}.vercel.app")
    notes.insert(0, f"Report month: {cur_name} | URLs: {len(urls)} | keywords: {n_kw} | "
                    f"Top 3 now: {len(top3)} | Page 1 now: {len(page1)} | images: {len(extracted)}")
    report(report_json)
    sys.exit(2 if problems else 0)


def report(_):
    print("=" * 70)
    for n in notes:
        print("OK  ", n)
    if warnings:
        print("\nWARNINGS (check these, publishing is allowed):")
        for w in warnings:
            print("  -", w)
    if problems:
        print("\nPROBLEMS (fix the Word doc and run again before publishing):")
        for p in problems:
            print("  -", p)
    if not warnings and not problems:
        print("No warnings.")
    print("=" * 70)


if __name__ == "__main__":
    main()
