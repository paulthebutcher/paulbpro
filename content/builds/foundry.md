---
title: Foundry
seoDescription: "Foundry is Paul Butcher’s multi-agent process for taking messy product inputs to the cheapest useful next step, and building it when building is the right step."
slug: foundry
order: 1
featured_size: small
kind: multi-agent build pipeline
status: in use
stack: [Claude Code, Codex, Next.js, Playwright]
image: /img/builds/foundry.svg
imageAlt: "Loose notes feed seven pipeline stages beside frozen tests, with the highlighted route passing through the distiller to a separate next step."
summary: >
  Foundry is the process I use to go from an idea to a working product: intake, research, a scoped spec, design, an architecture and a build, with a way to feed what was learned back in. It runs as seven shared workflows that work the same in Claude Code and Codex. I’ve used it on paid client work.
---

## Why it exists

Most of the people who bring me a product idea bring a pile of things with it: founder notes, an existing app, a brief written for someone else. The useful first answer is rarely “let’s build it.” It’s usually the smallest step that answers the real question, and sometimes that step is a prototype. I wanted that judgment written down so it happens the same way every time, with the reasoning visible.

## What I built

Seven workflows, each with its own instructions and checks:

1. Intake: the founder’s idea plus what’s already true, like an existing app and how current the sources are.
2. Market research (optional): public evidence, each stage runnable on its own.
3. Distiller: a customer experiment, the evidence and a scoped spec. Since October it pairs a bounded first version with research running alongside it.
4. UX design: core flows, distinct visual directions and a handoff.
5. Architect: the architecture, work packages and acceptance tests.
6. Builder: a working prototype, tested on ordinary and awkward cases.
7. Reconciler: turns feedback into an explicit scope change and a brief for the next build.

The most useful thing I learned came from a failure. On one build, the builder agent rewired a flow and then wrote its own passing test for it. Everything was green and nothing worked. Now acceptance tests are frozen where the builder can’t edit them, checked by hash before every run, and a tampered test fails the build. Reviews have to cite evidence, and a separate judge checks the work against a pinned set of criteria.

## Where it is now

In use, with paying customers. StressFreeClaims was scoped, architected and built in Foundry as a working demo. During the build, Foundry’s legal agent flagged that the business model needs a lawyer’s sign-off before it can serve customers, and the firm is still working that out. Letlytics was distilled and architected in August and has a prototype. In October it took in 23 ideas from Idea Factory as separate projects. It also built Studio Drills, a small app of sequenced drills for learning production techniques in Logic, which is mostly for me.

## What’s still hard

Some of the engine fixes, including the frozen tests, are still hypotheses until a replay evaluation shows they work. I’m spending the next few weeks on evaluation and labeling traces to improve what’s already there, before adding anything new.
