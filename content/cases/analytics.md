---
title: From no data to a shared answer
seoDescription: "How Paul Butcher got enterprise cybersecurity analytics live in three months and used the data to resolve a product integration dispute."
slug: analytics
order: 2
featured: true
org: Mastercard
years: "2025"
role: Director, Experience Strategy
image: /img/cases/analytics.svg
imageAlt: "Two separate product frames feed a feature map with two assumptions crossed out, while the highlighted route and lower pair mark the habitual features that guide integration."
summary: >
  Two enterprise products had spent over a year trying to make a cross-sell bundle work, and nobody knew how customers used either one. I got usage analytics live on both in three months with one developer and a borrowed intern. Later, that data gave two product leaders, stuck after an acquisition, something to agree on.
pull: I presented it as those features playing a different role than expected, so it didn’t read as a verdict on past investment.
---

## Situation

The products were hosted separately, with separate logins and basic Google Analytics on a few pages. A couple of product managers and I mapped what we needed to measure and asked engineering how long it would take in Mixpanel, the approved tool. The answer was two years, and it wasn’t a negotiating position. That was just how much tagging work it would take.

## What I did

I treated it as a tool problem. We needed a way for non-engineers to set up tracking without a code change each time. A four-week vendor evaluation landed on Fullstory, which goes in with one commit and is then configured in the browser. One developer spent half a day on each product.

I had no headcount for the configuration work. Andrew, a launcher in another team’s intern-to-FTE program, was clearly underused, so I asked his manager for a few hours of his week and taught him to build dashboards against our measurement map. He covered every major area of both products while I built the views for engineering, support, success and sales.

Nobody was told to use it. I asked one or two people from each of those teams to shape the dashboards with me, document them, and then teach their own teams.

After Mastercard acquired Recorded Future, the leader of our products and Recorded Future’s CPO spent months disagreeing about where the products should integrate, and the teams under them were stuck waiting. I combined our usage data with Recorded Future’s reporting and scored each feature three ways: how much it lifted retention, how much effort clustered near churn, and how much it worked as a place customers kept coming back to.

The features both leaders assumed were the core turned out to be reactive, high-effort workflows that got heavy use near churn. Two others were the ones customers used out of habit. I presented it as those features playing a different role than expected, so it didn’t read as a verdict on past investment.

## What changed

Usable dashboards at six weeks, full coverage at three months, and nine functions using them. Engineering and support started reproducing defects together from session replays. Success and sales checked a customer’s usage before every call. Andrew got the promotion and the full-time offer.

Both leaders accepted the analysis, and it gave them the same facts to argue from. The teams left with a full planning increment of integration work, research and definition they could start on.

## What’s still hard

The faster defect diagnosis was reported to me by engineering and support, and I never measured it. The bigger integration questions were still open when the post-acquisition reorg came.
