---
title: Identity service
seoDescription: "How Paul Butcher connected site visits and campaigns to CRM records so Popfly could trace marketing spend to revenue."
slug: identity-service
order: 3
featured_size: small
kind: first-party identity for Popfly
status: live
stack: [Webflow Cloud, RB2B, n8n]
image: /img/builds/identity-service.svg
imageAlt: "Visit dots, a campaign tag and a data stack feed a record, with the highlighted branches merging the three sources into one field."
summary: >
  Popfly’s demo requests used to arrive with little idea of where they came from. I designed and built a first-party identity service that joins who a visitor is to how they arrived and what they did, so each one now arrives with its landing page and visit history. About two-thirds of demo requests come in with a known source.
---

## Why it exists

Popfly needed a first-party way to connect who a visitor is, from enrichment and form fills, to how they arrived and what they did: the channel, each touch, each page. Before this, attribution ran through a chain of tools (n8n, RB2B and Tag Manager), and a footer script was overwriting the UTM fields, so a demo request’s source was often lost before it reached the CRM. I fixed the script, then built the join properly.

## What I built

A service on Webflow Cloud that deploys with the site and records five things:

- **Touches.** Every arrival is classified into a channel by versioned rules, with bot flagging and duplicate checks, and numbered within its session.
- **Pageviews,** tied to their touch and session.
- **Form fills.** Each submission is stamped with the visitor and session, how many touches and sessions came before it, the first and last channel, and a bot score. Forms ran in shadow mode first, recording alongside the existing pipeline without changing what it did.
- **Syncs.** Visit history goes to the CRM in batches about every 12 hours, and enrichment is pulled about every 4 hours.
- **A receipt log.** Every inbound payload is hashed and kept, so the data can be audited later. The first audit relied on it.

## Where it is now

Live. Every demo request arrives with its landing page and visit history, and about two-thirds arrive with a known referring source. In an audit in late October, pageviews arrived with no gaps and 27 of 28 form fills joined to their visit history.

## What’s still hard

Joining a known person to their journey depends on the enrichment vendor’s IDs lining up with ours, and in that audit they didn’t. That join was the first fix on the list. The channel rules also need upkeep: traffic from AI assistants was being filed as referral or paid search until the rules caught up.
