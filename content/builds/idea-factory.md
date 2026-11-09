---
title: Idea Factory
seoDescription: "Idea Factory runs product ideas through a kill step, viability research and a head-to-head critic before any of them reach Foundry."
slug: idea-factory
order: 4
kind: idea screening pipeline
status: in use
stack: [TypeScript, SQLite, Claude Code, Codex]
image: /img/builds/idea-factory.svg
imageAlt: "Most idea notes stop at a screening gate, while the highlighted surviving idea passes through paired review and leaves toward Foundry."
summary: >
  Idea Factory is where product ideas get judged before anything gets built. Each idea goes through a step meant to kill it early, then viability research, then a critic that compares ideas two at a time. Every step is saved as a trace I can review, and the survivors go to Foundry.
---

## Why it exists

I first sketched this in 2023 and came back to it in September: a way to find and test ideas for companies one person can run with agents. Foundry is good at taking one idea and finding its next step. It needed something upstream deciding which ideas deserved a look.

## What I built

The pipeline writes every step to one shared store, so a run can be replayed and reviewed afterward. A few rules keep it honest:

- An idea’s text never changes. A narrower version becomes a new idea linked to the original.
- The agents can propose new judging rules, and only I can turn one on.
- The judging steps can’t see how an idea was labeled or where it came from. I plant ideas with known answers to check that the judging holds up.
- Each run has a spending cap.

There’s a small review app for reading traces and leaving notes, and a discovery mode that groups candidates by the ways to sell help for the same problem. Take a publisher whose book upload keeps failing. You could sell a preflight check before they upload, a one-off rescue after a rejection, or a service book formatters include in their own package. Same problem, three reasons to pay and three ways to reach the buyer. There’s also a consulting brief, for prospects who already have an app.

## Where it is now

In use. On October 24 it handed 23 ideas to Foundry, each as its own project.

## What’s still hard

Sameness first, weak grounding second. In an earlier batch, 11 of 12 ideas followed the same pattern: take in documents, check them against rules, flag the gaps. The buyers and industries changed, and the offers barely did. My prompt encouraged it by asking for one buyer, one trigger, one workflow and one deliverable. That’s a good way to describe an offer once you have one, and it narrowed what the factory looked for in the first place.

Foundry then turned up practical gaps. Some buyers already had a free or built-in option. Some outreach channels didn’t allow recruiting. Some offers depended on specialist or possibly regulated work. In several cases the factory had a plausible task for an agent and thin evidence that a reachable buyer would pay for it.

The kill step wasn’t the main problem. The book upload rescue is what I want more of: someone with a live problem, a price I can quote, and a first experiment that can be a real sale. The factory’s job is to find more offers with that kind of buying moment, with enough context for Foundry to test them.
