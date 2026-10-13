#!/usr/bin/env python3
"""Set (or reset) the Vercel link name in data/report.json without regenerating anything else.

Usage (from the repo root):
    python3 scripts/set_link_name.py fortinet-backlinking-dashboard-september2026-copy
    python3 scripts/set_link_name.py --default        # back to fortinet-backlinking-dashboard-<month><year>

Keeps any corrections already made to report.json. Prints the final link, plus a warning
if the name looks like another month's link (publishing would replace that month).
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PATH = os.path.join(ROOT, "data", "report.json")
MONTHS = ["january", "february", "march", "april", "may", "june", "july",
          "august", "september", "october", "november", "december"]


def clean(name):
    raw = name.strip().lower()
    raw = re.sub(r"^https?://", "", raw).split("/")[0]
    raw = re.sub(r"\.vercel\.app$", "", raw)
    out = re.sub(r"-{2,}", "-", re.sub(r"[^a-z0-9-]", "-", raw)).strip("-")[:63].strip("-")
    return raw, out


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    report = json.load(open(PATH, encoding="utf-8"))
    y, mo = report["meta"]["reportMonth"].split("-")
    month, year = MONTHS[int(mo) - 1], y
    default = f"fortinet-backlinking-dashboard-{month}{year}"

    if sys.argv[1] == "--default":
        name = default
    else:
        raw, name = clean(sys.argv[1])
        if not name:
            sys.exit(f"PROBLEM: '{sys.argv[1]}' has no usable characters for a web address.")
        if name != raw:
            print(f"WARNING: changed to '{name}' (web addresses can only use a-z, 0-9 and '-').")
        other = re.fullmatch(r"fortinet-backlinking-dashboard-([a-z]+)(\d{4})(.*)", name)
        if other and (other.group(1), other.group(2)) != (month, year):
            print(f"WARNING: '{name}' looks like another month's link. Publishing would replace "
                  "that month's dashboard.")

    report["meta"]["linkName"] = name
    with open(PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"Link: https://{name}.vercel.app")


if __name__ == "__main__":
    main()
