---
title: Growth Audit
seoDescription: "Growth Audit runs eleven checks on a company’s site and returns evidence, gaps and costs, with the priorities left to Paul Butcher."
slug: growth-audit
order: 5
kind: site evidence audit
status: in progress
stack: [TypeScript, Playwright, Postgres, Docker, Claude API]
image: /img/builds/growth-audit.svg
imageAlt: "Eleven evidence boxes surround an abstract site, with one highlighted spoke and box marking the finding opened for inspection."
summary: >
  Growth Audit is the tool I’m building for the audit I sell as the first step with new consulting clients. Point it at a URL and it checks accessibility, tracking, attribution, speed, messaging and more, then hands back what it found with links to the evidence. It doesn’t grade the site or pick the top fixes. I do that part.
---

## Why it exists

The audit is the entry point to my consulting work. I wanted every observation tied to something a client can open and look at.

## What I built

Eleven checks, each its own module: accessibility (WCAG Engine runs inside it), whether AI crawlers can reach the site, a technical crawl, email deliverability, tracking, attribution, the path to a conversion, performance, how the messaging reads, what trust signals are on the page, and how the company shows up in AI answers.

Every finding links to the stored page, screenshot or response it came from. Every outside call is logged with its time and cost, and every prompt is versioned so I can tell which one produced a result.

To test it, I built a fictional company site with known problems planted in it, each tagged, and a list of what the audit should find. The first version passed all 95 acceptance tests against that site.

## Where it is now

The first version was built in late October. It isn’t ready for production yet.

## What’s still hard

So far the checks have only been proven against the fictional test site. The AI-visibility check also only runs when three outside services are connected.
