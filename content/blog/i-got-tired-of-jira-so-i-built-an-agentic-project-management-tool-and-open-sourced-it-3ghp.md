---
id: 3162259
title: >-
  I Got Tired of Jira. So I Built an Agentic Project Management Tool
description: >-
  Why I built FortyOne to connect goals, incoming requests, capacity, and
  delivery while keeping people in control of the decisions.
publishedAt: "2026-01-10T09:17:19Z"
updatedAt: "2026-07-18T17:47:50Z"
tags:
  - webdev
  - typescript
  - go
  - nextjs
socialImage: >-
  https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwfvz8gyvrq2pqt744waq.png
originalUrl: >-
  https://dev.to/josemukorivo/i-got-tired-of-jira-so-i-built-an-agentic-project-management-tool-and-open-sourced-it-3ghp
---

I built [FortyOne](https://www.fortyone.app) after spending too much time maintaining project management tools that did very little to help with the work itself.

The tickets were there. So were the statuses, estimates, and due dates. The harder questions lived somewhere else: why is this important, who has room to take it, what will it displace, and is the plan still realistic?

I wanted the software to take part in those questions. That is what I mean by agentic project management. The agent works with the same stories, goals, sprints, workload, and permissions as the rest of the product. It does not sit in a chat box with a separate understanding of the workspace.

## Connect the work to the reason

The main unit in FortyOne is a story. It can belong to a sprint, support an objective and key result, have an owner and estimate, and appear on the roadmap.

Those relationships matter because a backlog should help a team decide, not simply collect requests. When looking at a story, I want to know why it matters and what commitment already exists around it.

Objectives are part of the same model. A team can see the work supporting an objective and notice when a key result has no delivery activity. Sprints handle the near-term plan; the roadmap shows sequencing over a longer period. Both read from the same work instead of asking people to rebuild it as presentation cards.

## Keep incoming requests pending

Work often starts in GitHub, Slack, customer feedback, or a support conversation. Automatically turning every message into a story would replace manual entry with a noisy backlog.

FortyOne stores these items as integration requests. A team can review the original context, choose an owner, add an estimate, connect a goal, schedule the work, and then accept or decline it.

The point of this boundary is product judgment. GitHub owns its issue. A customer owns the problem they reported. FortyOne owns the decision to make that input part of the delivery plan.

Accepted requests keep a link to their source. A GitHub issue can stay connected to its story, and public feedback can show a useful status without exposing internal implementation detail.

Bidirectional sync also needs memory. When FortyOne edits a GitHub issue, GitHub sends the change back through a webhook. The integration records what it sent so it can recognise that echo instead of treating it as a fresh external decision.

## Give Maya narrow tools

Maya is the AI teammate inside FortyOne. It can search workspace data, create or update stories, inspect workload, prepare reports, and help with planning.

Each ability is a defined tool with a schema and an application boundary. Maya has no unrestricted database access. The model interprets the request and chooses an operation; ordinary software handles identity, permissions, validation, and persistence.

Changes with consequences require confirmation. I enforce that in several places: the prompt describes when to ask, the tool schema includes confirmation, the tool refuses to run without it, and the backend still authorises the request.

A prompt can guide behaviour. It cannot be the security boundary.

This tool-based design also makes answers less speculative. Maya can read the current workspace or call the same reporting service as the interface instead of inventing a status from an old conversation.

## Plan with capacity

Assigning a story is usually presented as choosing a name from a menu. A responsible assignment also depends on existing work, estimates, role context, and calendar availability.

FortyOne builds a candidate set from product data. It knows each person's active work, estimated load, recent activity, and busy calendar windows. A deterministic planner finds available time first. An AI adviser can consider work fit among those valid candidates, but it cannot choose someone outside the set.

If no one has enough room, the result should say so. A date generated to satisfy a required field is worse than an explicit scheduling risk.

The same rule applies to analytics. Maya uses the reporting contracts that power the product, so a workload or sprint answer should agree with the report a person can open themselves.

## Keep automation visible

FortyOne runs background work for sprint changes, reminders, cleanup, integrations, and assisted assignment. When one of those processes changes a story, the activity records the system actor and the reason.

People need to know whether a teammate, GitHub, a workspace rule, or Maya made the change. Without that history, useful automation starts to feel arbitrary.

Permissions follow the same rule everywhere. Maya can expose an operation in conversation and still be refused by the backend because the current user lacks the role. Public feedback has its own boundary, separate from internal workspace access.

## What I am building toward

I want a team to move through one connected sequence:

1. Capture a request with its source.
2. Decide whether it is worth doing.
3. Connect it to an outcome.
4. Plan it against real capacity.
5. Do the work with the context nearby.
6. Learn from the result.

People still make the commitment and own the trade-off. FortyOne should remove the administrative distance between that decision and the system that records it.

That is the part of Jira I wanted to rethink. A project tool can do better than display the status people typed into it. It can notice missing context, prepare the next step, and make an unrealistic plan harder to ignore.
