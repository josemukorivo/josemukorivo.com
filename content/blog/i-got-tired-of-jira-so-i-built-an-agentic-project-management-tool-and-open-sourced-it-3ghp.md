---
id: 3162259
title: >-
  I Got Tired of Jira. So I Built an Agentic Project Management Tool
description: >-
  Why I built FortyOne, a project management platform designed to connect
  goals, planning, execution, customer feedback, workload, and intelligent
  assistance in one operating system for delivery.
publishedAt: "2026-01-10T09:17:19Z"
updatedAt: "2026-07-17T19:00:22Z"
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

I built [FortyOne](https://www.fortyone.app) because I had become frustrated with a familiar contradiction in project management software: teams spend a considerable amount of time maintaining the tool, yet the tool contributes very little to the work itself.

Most platforms are effective systems of record. They store tickets, statuses, comments, estimates, and due dates. Delivery usually breaks down elsewhere: priorities drift away from goals, ownership remains unclear, capacity stays invisible, and important context is scattered across conversations and integrations.

> FortyOne is my attempt to build a more active project management system—one that connects strategy, planning, execution, and feedback, then helps teams reason about what should happen next.

The distinction matters. A passive system waits for people to keep every field accurate and then reports the state they entered. An active system helps structure incoming work, exposes missing decisions, identifies risks, and prepares the next action while preserving human control.

That is what I mean by _agentic project management_. The agent works inside a structured delivery model made up of stories, teams, sprints, objectives, key results, workload, calendars, integrations, and reports. It has a role in the workflow beyond sitting beside it as a chatbot.

## Start with the work, not the board

The core unit in FortyOne is a story, connected to the rest of the plan. It can belong to a sprint, support an objective and key result, carry an estimate, have an owner, and appear on a roadmap. That context changes the quality of planning.

A backlog should answer more than “What could we do?” It should also help answer:

- Why does this work matter?
- Which goal does it support?
- Who has the capacity and context to own it?
- When can it realistically be completed?
- What other work is likely to be displaced?

The product brings these decisions into the same system. Teams can manage stories and sprints, define objectives and measurable key results, review roadmap commitments, and inspect workload without maintaining a separate planning model in a spreadsheet.

### Stories as connected work

A story can carry the operational information a team needs to make and review a commitment:

- Team and workflow status.
- Priority and estimate.
- Reporter and assignee.
- Start and target dates.
- Sprint membership.
- Objective and key-result relationships.
- Labels, comments, links, attachments, and activity.
- Associations with other stories.
- External development or request context.

<u>Each field should help preserve a relationship that explains the work.</u>

When a story moves, the relevant surfaces should move with it. Lists, detail views, personal work, sprint progress, objective reporting, roadmap views, and analytics all observe different projections of the same underlying commitment.

### Objectives should be part of delivery

Many organizations maintain OKRs in a presentation or spreadsheet and manage daily work somewhere else. The two systems meet during a review meeting, usually after the work has already drifted.

FortyOne connects objectives and key results to stories while work is being planned. That makes it possible to ask:

- Which active work supports this objective?
- Which key result has no delivery activity?
- How much effort is committed to each outcome?
- Is progress based on completed work or an optimistic status update?
- Which objective is at risk because its supporting work is late or unowned?

An objective carries more than a coloured progress bar: it has a lead, a time window, status history, measurable key results, supporting work, and activity that can be inspected over time.

### Sprints and the roadmap answer different questions

Sprints organize near-term execution. The roadmap communicates sequencing and direction across a longer horizon.

FortyOne keeps both views connected to the same work rather than requiring teams to recreate projects as roadmap cards. A story may belong to a sprint and also contribute to a larger objective or roadmap commitment.

This matters because teams need to see both the immediate plan and the reason that plan exists.

### Personal work should reflect the full system

The “My work” surface brings together assignments and relevant commitments across teams. A person should not need to inspect several boards to understand what currently requires attention.

The same principle applies to search and notifications. They are horizontal capabilities over the product model, not isolated modules with their own interpretation of work.

## Intake should not become administrative debt

Important work rarely begins inside a project management tool. It arrives through GitHub issues, Slack conversations, customer feedback, support requests, and internal discussions.

FortyOne treats these sources as intake rather than automatically turning every message into committed work. An integration request can be reviewed, refined, assigned, estimated, linked to an objective, scheduled into a sprint, accepted, or declined.

That distinction matters. Automation should reduce transcription, but it should not bypass product judgment. A useful intake system preserves the original context while giving the team a deliberate point at which a request becomes planned work.

An incoming request remains pending while the team refines it. Before acceptance, it can receive:

- A target team and workflow status.
- An assignee.
- Priority and estimate.
- Objective and key-result links.
- Sprint membership.
- Planned start and end dates.

Only after acceptance does FortyOne create the corresponding story and connect it back to its provider.

This review boundary also prevents a common integration failure: allowing an external system to become the accidental source of truth for internal planning. GitHub knows about issues and development events. Slack knows about conversations. Customers know about their problems. FortyOne owns the delivery decision that connects those signals to a plan.

The GitHub integration goes beyond importing a title. It can link stories to issues, pull requests, branches, and commits, synchronize selected issue fields, expose comments, and preserve repository context beside planned work.

That synchronization requires causality, not just webhooks. If FortyOne updates a GitHub issue, the resulting webhook must not be treated as a new GitHub-originated decision and written back over the story. The integration records enough sync state to distinguish an echo from a real external change.

The same model applies to customer feedback. Public feedback boards allow customers to submit ideas, comment, vote, and follow status changes. Internally, the team can triage an item and create a story when the feedback is ready to enter the delivery process. The public conversation and the internal plan remain connected without being treated as the same thing.

Feedback can move through statuses such as pending, reviewing, planned, in progress, completed, and closed. A roadmap summary can communicate the public decision without exposing internal implementation detail.

When the team creates a story from feedback, FortyOne records the relationship instead of copying the text and losing its origin. Product teams can trace delivery back to the customer problem that motivated it.

## Maya is part of the workflow

FortyOne includes an AI teammate called Maya. I designed Maya to understand the product’s operating model and work through explicit tools, giving it a meaningful role beyond a chat window placed beside the application.

Maya can search workspace information, create and update stories, help structure objectives and key results, prepare reports, inspect team workload, propose a work plan, and assist with integration requests. Each capability is narrow and tied to the same authorization rules as the rest of the product.

The tool surface includes operations for:

- Creating, updating, assigning, duplicating, restoring, and associating stories.
- Managing teams, objectives, and key results.
- Inspecting sprint and objective performance.
- Producing workspace, team, story, sprint, timeline, and pulse reports.
- Reviewing integration requests and GitHub context.
- Searching, navigating, commenting, and working with labels or links.
- Inspecting workload and preparing assignment and scheduling plans.

Maya reaches that breadth through defined tools, never unrestricted database access. Each tool has a schema, retrieves current application data, calls an existing product boundary, and returns a structured result.

> The language model handles interpretation and planning. Deterministic software handles identity, authorization, validation, persistence, and side effects.

The important design decision is that consequential actions remain reviewable. Maya can prepare a change, explain the reasoning, and ask for confirmation before applying it. This provides better decision support with less coordination overhead while keeping people accountable for the outcome.

This approach also makes the assistant more reliable. Instead of inventing an answer from a large prompt, Maya can retrieve current product data and invoke a defined operation. The boundary between reasoning and execution stays visible.

For example, an update tool requires an explicit confirmation value before it will change a story. Integration acceptance, bulk changes, GitHub synchronization actions, and work-plan application follow the same pattern.

This is defence in depth:

1. The system prompt tells Maya when confirmation is required.
2. The tool schema includes a confirmation field.
3. The tool implementation refuses to execute without it.
4. The backend authenticates and authorizes the resulting request.

_A prompt is guidance. The application boundary is enforcement._

## Planning requires capacity, not optimism

Assignment is often treated as a dropdown selection, even though a responsible assignment depends on workload, existing commitments, estimates, role context, and availability.

FortyOne’s planning model can combine active work, estimated effort, recent activity, and calendar availability to propose an owner and a realistic time window. When no safe slot exists, the system should surface a scheduling risk rather than quietly overloading someone.

The planner begins with a structured candidate set from product data before AI contributes any judgment:

- Current open stories and total estimated load.
- Team-specific role and work-focus information.
- Recent story activity.
- Busy windows synchronized from calendars.
- Existing schedule blocks.
- The story’s estimate and sprint window.

It searches working days and working hours for available time, aligns candidate slots to predictable intervals, avoids calendar conflicts, and limits the first focus block to a reasonable duration.

The deterministic ranking favours earlier availability, lower estimated load, fewer open stories, and recent activity. An AI advisor can evaluate role and work fit among the valid candidates, but it cannot select someone outside the supplied set.

When no candidate has enough calendar space, the planner can still recommend the strongest owner while producing an explicit schedule-risk action. That is more honest than placing a date on the story simply because the interface requires one.

_This is the direction I find most valuable: software should make constraints explicit before a plan becomes a promise._

The analytics layer follows the same principle. Reports help teams examine delivery health, sprint progress, objective status, workload distribution, timeline risk, and the relationship between planned and completed work, giving them a role well beyond retrospective charts.

FortyOne includes focused reports and broader operating views. A command-centre report can combine workload, stories, sprints, objectives, and incoming requests. A pulse report highlights the conditions that need attention rather than presenting every metric with equal weight.

Maya can use the same reporting contracts when answering questions. This prevents the assistant from calculating an unofficial metric that disagrees with the analytics interface.

## A calmer interface for a complex domain

Project management is inherently dense. The answer is not to expose every possible control at once.

FortyOne’s interface is intentionally restrained. Views are designed around the decision a person is making: prioritizing a backlog, planning a sprint, reviewing a roadmap, checking personal work, assessing an objective, or responding to an incoming request.

Consistency matters here. Shared interaction patterns, predictable keyboard behavior, clear loading states, and focused menus reduce the effort required to navigate a large product. The interface should reveal depth when it is needed without making every screen feel heavy.

The frontend is organized by product modules such as stories, sprints, objectives, key results, roadmap, analytics, integration requests, notifications, public portal, teams, settings, search, and Maya. Shared UI primitives provide the visual and interaction foundations, while domain components remain close to the workflows they implement.

Real-time updates help the product feel coherent when several people or systems are working at once. Server-Sent Events deliver workspace story changes and personal notifications to connected clients. The browser patches the relevant TanStack Query records or invalidates a precise query rather than refreshing the whole application.

This matters for calmness as much as speed. A collaborative interface should update without surprising page jumps, lost filters, or an unnecessary loading state across unrelated content.

The product also supports different surfaces around the same workspace: the core projects application, public feedback portal, administration, documentation, mobile work, and integrations. Shared contracts keep those surfaces from inventing different meanings for the same entities.

## Automation should have visible reasons

FortyOne runs background work for recurring sprint operations, story automation, digest and overdue communication, lifecycle cleanup, integration synchronization, and Maya-assisted assignment.

_Automation becomes dangerous when it changes state without leaving an understandable reason._

When a system actor archives work, moves unfinished stories, assigns a person, or creates a schedule block, the activity should explain what happened and why. People need to distinguish a teammate’s decision from a workspace rule, integration event, or Maya proposal.

This is especially important in an agentic product. Intelligence without provenance feels arbitrary. A recommendation becomes useful when the user can inspect the evidence and decide whether the reasoning is appropriate.

## Permissions remain a product feature

Every workspace operation is evaluated in context: the current user, workspace membership, team access, and required role.

Maya does not override that model. A tool can be available in the assistant while its execution still fails because the user lacks the required permission. Planning and scheduling operations, for example, can require administrative access.

The public portal has a different trust boundary from the internal application. Public reading, authenticated writes, moderation, and internal story creation are separate capabilities.

Permissions also need to be legible in the interface. People should understand why an action is disabled, which role can perform it, and whether they need to change context.

## What I am ultimately building

FortyOne begins from a different view of what project software should be responsible for, rather than recreating Jira behind a new visual design.

I want the product to help a team maintain a continuous line from goals to delivery:

1. Capture a request without losing its source context.
2. Decide whether it is worth doing.
3. Connect it to an objective.
4. Estimate and schedule it against real capacity.
5. Execute it with the relevant context nearby.
6. Learn from the result and communicate progress.

The long-term opportunity is to reduce the distance between understanding a problem and moving the right work forward. That requires more than boards and tickets. It requires a product that understands relationships, constraints, and decisions while keeping people firmly in control.

> Teams still need deliberate planning, difficult tradeoffs, and accountable decisions. FortyOne reduces the administrative distance between those decisions and the system that records them.

When strategy, intake, capacity, execution, feedback, and analytics share one model, the software can do more than display status. It can identify incomplete thinking before it becomes delivery risk.

That is the product I want FortyOne to become: an operating system for delivery in which humans decide what matters and intelligent software helps turn those decisions into coherent, realistic action.
