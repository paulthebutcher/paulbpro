---
title: WCAG Engine
seoDescription: "WCAG Engine audits websites against the 50 WCAG 2.1 A and AA criteria and writes platform-specific fixes. Paul Butcher built it and uses it for paid municipal and Popfly audits."
slug: wcag-engine
order: 2
featured_size: large
kind: accessibility audit platform
status: live
stack: [TypeScript, Playwright, axe-core, Claude API, SQLite]
image: /img/builds/wcag-engine.svg
imageAlt: "Five inspection layers cross an abstract page with checked and untested marks, while the highlighted keyboard route lands on the main content."
summary: >
  WCAG Engine crawls a site, checks it against the 50 WCAG 2.1 A and AA criteria, and writes a report with fixes in the site’s own platform terms. I designed and built it, about 44,000 lines over 325 commits. A municipal court and Popfly have paid for audits.
---

## Why it exists

The ADA Title II deadline is coming for local governments, and the Lakewood Municipal Court, whose site I built, needed to know where it stood. Other scanners promise compliance with a plugin. I review the findings and fix them myself, so the tool is there to speed up the first and final audits and leave a paper trail. That paperwork is usually where the time goes.

## What I built

It checks a site in five layers. The first is rule-based testing with axe-core. The second drives a real browser with the keyboard to find traps, missing focus and broken skip links. The third uses Claude to judge things a rule can’t, like whether alt text or a heading actually describes what it labels. The fourth fills out and submits forms. The fifth flags things a person has to look at.

A few rules hold the whole thing together:

- What it saw is stored separately from what it concluded. A contrast ratio of 3.2 is a fact; “this fails 1.4.3” is a judgment layered on top.
- It never passes a criterion it didn’t test. Anything unchecked is reported as not tested, with the reason.
- It detects Webflow or WordPress and gives fixes in that platform’s own terms.
- It crawls politely: it reads robots.txt, waits three seconds between pages and says who it is.

In October I built an evaluation harness so I could change the engine without guessing. It replays a frozen copy of 47 pages offline, and every change has to pass that gate before it merges. When a change moves a result I’ve labeled, the gate names the row. Every model call is logged with its cost; a 50-page scan ran about a dollar in model calls.

## Where it is now

Live, with two paying clients: the Lakewood Municipal Court, whose report went out in May 2026, and Popfly, which paid me to run it on their site and refine it. I worked the Popfly fixes through with their team. Two more municipal sites are in a pilot.

## What’s still hard

The municipal pilots turned up false positives I haven’t solved: labels that only exist for screen readers, decorative carousels, skip links that move focus in a way the browser doesn’t report. Those findings go to a person for review, and the report says so. Some of my early reports also grouped problems too broadly. When I re-ran the Lakewood data through the current report, the same 31 issues split from 6 groups into 11.

The report doesn’t claim a site is compliant. An automated tool can’t certify that, and I’d rather it said less and was right.
