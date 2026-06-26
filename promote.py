#!/usr/bin/env python3
"""
AppealMate promotion agent (local, runs daily via Task Scheduler).

Ban-safe by design: it does NOT auto-post (that gets accounts banned and breaks
the help-first strategy). Each morning it:
  1. Finds recent UK 'parking ticket / PCN' posts on Reddit (public JSON, no auth).
  2. Drafts a genuinely helpful, ground-aware reply for each (you paste it in).
  3. Writes a fresh TikTok/Reels script + a Facebook value post.
  4. Saves it all to promo/YYYY-MM-DD.md for a 5-minute daily posting routine.

Run:  python promote.py
Schedule: Windows Task Scheduler, daily ~08:00 (see setup_promote_task.ps1).
Pure stdlib. Degrades gracefully if Reddit is unreachable.
"""
import os, json, datetime, urllib.request, urllib.parse, random, pathlib

SITE = "https://appealmate-uk.netlify.app"
OUT = pathlib.Path(os.path.dirname(os.path.abspath(__file__))) / "promo"
SUBS = ["LegalAdviceUK", "UKPersonalFinance", "CarTalkUK"]
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 AppealMate-research/1.0"

# ground detection: keyword in post -> which appeal angle to lead the reply with
GROUNDS = [
    (["sign", "signage", "hidden", "couldn't see", "no sign"],
     "If the signs were unclear, hidden or too small, no contract was properly formed (for a private charge) - that's a strong appeal."),
    (["grace", "minutes over", "few minutes", "overstay", "10 min", "five min"],
     "There's a mandatory grace period (min 10 mins for private car parks) plus entry/exit time - a short 'overstay' often isn't a real one."),
    (["paid", "already paid", "ticket", "app", "machine"],
     "If you paid or the machine was broken, that's appealable - a keying error or a faulty machine isn't a real breach."),
    (["permit", "blue badge", "disabled"],
     "A valid permit/Blue Badge means you were entitled to park - appeal on that and include proof."),
    (["not the driver", "wasn't driving", "keeper", "registered keeper"],
     "As keeper for a PRIVATE charge, put them to strict proof they followed POFA (Schedule 4) - if the Notice to Keeper wording/timing is off, liability doesn't transfer."),
]

def search_link(sub):
    return (f"https://www.reddit.com/r/{sub}/search/?" +
            urllib.parse.urlencode({"q": "parking OR PCN", "restrict_sr": 1, "sort": "new", "t": "week"}))

def fetch_reddit(sub, limit=8):
    # Reddit blocks plain .json (403) without OAuth; try the .rss feed as a
    # lighter fallback. If both fail, the daily pack still gives clickable
    # search links so you find posts manually in one click.
    headers = {"User-Agent": UA, "Accept": "application/json, text/xml, */*"}
    q = urllib.parse.urlencode({"q": "parking OR PCN", "restrict_sr": 1, "sort": "new", "t": "week", "limit": limit})
    for url, kind in [(f"https://www.reddit.com/r/{sub}/search.rss?{q}", "rss"),
                      (f"https://www.reddit.com/r/{sub}/search.json?{q}", "json")]:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as r:
                raw = r.read().decode("utf-8", "ignore")
            out = []
            if kind == "json":
                for c in json.loads(raw).get("data", {}).get("children", []):
                    d = c.get("data", {})
                    out.append({"sub": sub, "title": d.get("title", ""),
                                "body": (d.get("selftext", "") or "")[:600],
                                "url": "https://www.reddit.com" + d.get("permalink", "")})
            else:  # crude rss parse, stdlib only
                import re
                for m in re.finditer(r"<entry>.*?<title>(.*?)</title>.*?<link href=\"(.*?)\".*?</entry>", raw, re.S):
                    out.append({"sub": sub, "title": _unescape(m.group(1)), "body": "", "url": m.group(2)})
            if out:
                return [o for o in out if any(k in (o["title"]+o["body"]).lower() for k in ["parking","pcn","ticket","charge"])]
        except Exception as e:
            last = f"{sub}: {e}"
    return [{"error": last}]

def _unescape(s):
    for a, b in [("&amp;","&"),("&lt;","<"),("&gt;",">"),("&#39;","'"),("&quot;",'"')]:
        s = s.replace(a, b)
    return s

def draft_reply(post):
    text = (post["title"] + " " + post["body"]).lower()
    lead = next((msg for kws, msg in GROUNDS if any(k in text for k in kws)),
                "Most parking charges are very appealable - the key is to state a clear ground and escalate free to POPLA/IAS (private) or the tribunal (council) if they reject you.")
    return (f"Sorry you're dealing with this. {lead}\n\n"
            f"Quick steps: 1) work out if it's a council PCN or a private charge - they appeal differently. "
            f"2) Appeal in writing stating your ground and ask them to cancel. 3) If rejected, escalate for FREE "
            f"(POPLA/IAS for private, the tribunal for council) - don't just pay it.\n\n"
            f"If you'd rather not write the letter yourself I built a little tool that does it in ~2 mins "
            f"(AppealMate, {SITE}) - £1.99 - but the DIY route above is free and works too.")

TIKTOK_HOOKS = [
    "How I got my £100 parking fine cancelled in 2 minutes",
    "6 reasons your parking ticket is probably invalid",
    "Don't pay that PCN until you've watched this",
    "Private parking companies don't want you to know this",
    "Got a parking ticket? Do THIS before you pay",
]

def tiktok_script():
    hook = random.choice(TIKTOK_HOOKS)
    return (f"HOOK (0-3s): \"{hook}\"\n"
            f"BODY (3-25s): Screen-record AppealMate. Say: most private parking charges are appealable - "
            f"unclear signs, grace period, broken machine, already paid, valid permit. The trick is stating the right "
            f"reason and escalating to POPLA for free if they say no.\n"
            f"CTA (25-30s): \"I built a tool that writes the appeal letter for you in 2 minutes - link in bio.\"\n"
            f"On-screen text: 'appeal in 2 mins' | Bio link: {SITE}")

def fb_post():
    return (f"Got a parking ticket you think is unfair? Before you pay, check these 6 common reasons appeals WIN:\n"
            f"1) Unclear or hidden signs  2) You were within the grace period  3) You'd already paid / valid ticket  "
            f"4) Valid permit or Blue Badge  5) The payment machine was broken  6) You weren't the driver (private tickets)\n\n"
            f"If any apply, appeal in writing and escalate free to POPLA/IAS if they reject you. "
            f"(I made a 2-minute letter tool - link in comments.)")

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    day = datetime.date.today().isoformat()
    posts, errors = [], []
    for sub in SUBS:
        for item in fetch_reddit(sub):
            (errors if "error" in item else posts).append(item)

    md = [f"# AppealMate promo pack - {day}", "",
          "5-minute routine: post 2-3 helpful Reddit replies + today's TikTok + (optional) the FB post.",
          "RULE: help first, link soft, never spam. Adapt each reply to the actual post.", ""]
    md.append("## Reddit opportunities + draft replies\n")
    if posts:
        for p in posts[:6]:
            md += [f"### r/{p['sub']}: {p['title']}", f"Link: {p['url']}", "",
                   "Draft reply:", "```", draft_reply(p), "```", ""]
    else:
        md.append("_Auto-fetch blocked by Reddit today. Click these to find live posts (sorted new), then use the generic reply below:_\n")
        for sub in SUBS:
            md.append(f"- r/{sub}: {search_link(sub)}")
        md += ["", "Generic help-first reply (adapt to the post):", "```",
               draft_reply({"title": "", "body": ""}), "```", ""]
    md += ["## Today's TikTok / Reels script\n", "```", tiktok_script(), "```", "",
           "## Facebook value post\n", "```", fb_post(), "```", ""]
    if errors:
        md += ["## Notes", *[f"- {e['error']}" for e in errors]]

    f = OUT / f"{day}.md"
    f.write_text("\n".join(md), encoding="utf-8")
    print(f"[ok] promo pack -> {f}  (reddit posts: {len(posts)}, errors: {len(errors)})")

if __name__ == "__main__":
    main()
