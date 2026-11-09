---
title: Identity service
seoDescription: "How Paul Butcher connected site visits and campaigns to CRM records so Popfly could trace marketing spend to revenue."
slug: identity-service
order: 3
featured_size: small
kind: first-party identity for Popfly
status: live
stack: [Webflow Cloud]
image: /img/builds/identity-service.svg
imageAlt: "Visit dots, a campaign tag and a data stack feed a record, with the highlighted branches merging the three sources into one field."
summary: >
  Popfly’s demo requests used to arrive with little idea of where they came from. I designed and built a first-party identity service so each one now arrives with its landing page and visit history. About two-thirds of demo requests come in with a known source.
---

## Why it exists

Attribution ran through a chain of tools: n8n, RB2B and Tag Manager. A footer script was overwriting the UTM fields, so the source of a demo request was often lost before it reached the CRM.

## What I built

A first-party service that ties site visits, campaign tags and third-party data to one CRM record, so marketing spend can be traced to revenue. It runs on Webflow Cloud and deploys with the site.

## Where it is now

Live. Every demo request arrives with its landing page and visit history, and about two-thirds arrive with a known referring source.

## What’s still hard

Attribution is only as good as what a visit leaves behind. About a third of demo requests still arrive without a known source.
