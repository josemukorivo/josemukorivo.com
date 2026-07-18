---
id: 2745526
title: Can One Person Really Build a Complex System from Scratch?
description: >-
  The boundaries that let me operate FortyOne's Next.js apps, Go backend,
  workers, realtime updates, integrations, and AI tools as one developer.
publishedAt: "2025-08-01T11:28:03Z"
updatedAt: "2026-07-18T17:47:50Z"
tags:
  - go
  - nextjs
  - typescript
  - webdev
socialImage: >-
  https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Frqdsbb1ux38cdkrmsk5b.jpeg
originalUrl: >-
  https://dev.to/josemukorivo/can-one-person-really-build-a-complex-system-from-scratch-7dn
---

When I started [FortyOne](https://www.fortyone.app), I knew one person could write enough code to make the first version. I was less certain that one person could keep understanding it after the product gained planning, realtime updates, integrations, background jobs, analytics, and an AI teammate.

That became the real architecture problem: limit how much of the system I need to hold in my head for one change.

## Keep the deployment simple

The frontend is a Turborepo with separate applications and a few shared packages:

```text
apps/
  projects/
  landing/
  docs/
  mobile/
  admin/
packages/
  api-client/
  auth/
  ui/
```

The projects app is divided by product domains such as stories, sprints, objectives, integrations, analytics, and Maya. Code that only belongs to stories stays with stories. Shared packages contain contracts that genuinely cross applications.

The backend is a Go modular monolith backed by PostgreSQL and Redis. Each domain has its own handlers, services, and repositories, but they run in one API process and use one transactional database.

I chose that deliberately. Splitting every domain into a network service would give me deployment and failure modes I do not need. The useful boundaries are inside the code; I can extract a service later if an operational reason appears.

## Give state a clear home

The web app has several kinds of state because they have different owners:

- Next.js routes and layouts establish server and workspace context.
- TanStack Query holds server data that needs interactive updates.
- The URL owns shareable filters and selected views.
- React state owns temporary interface details.

I do not copy all of this into one global store.

The module performing a mutation decides how its visible data becomes current. A small story update may patch a detail cache. A change that affects several filtered lists may invalidate a focused query. This decision stays close to the product rule instead of disappearing into generic cache helpers.

## Put product rules in services

An HTTP handler translates a request. It should not decide how a story update affects activity, notifications, GitHub, or connected browsers.

The usual write path is straightforward:

```text
authenticate → authorise → validate → update → record activity → publish effects
```

The service owns that sequence. An API route, worker, integration, or Maya tool can call the same service without receiving a private route around the rules.

Repositories use explicit SQL. FortyOne has many relational questions: which stories support this objective, who belongs to this team, which sprint contains this work? SQL keeps those joins and transaction boundaries visible.

Dependencies are wired in one Go composition root. It is verbose, and I prefer that to runtime discovery. I can see which services depend on stories, reports, calendars, or integrations and replace those dependencies in tests.

## Use one realtime path

Browsers need updates made by other people, workers, integrations, and Maya. Mutations already use HTTP, so the return channel only needs server-to-browser delivery. I use Server-Sent Events.

```text
domain event → Redis Pub/Sub → Go SSE hub → EventSource → query cache
```

Each browser subscribes to a workspace stream and a private notification stream. Keeping them separate prevents a workspace broadcast from carrying one person's notification data.

The stream improves freshness; it is not a database. Redis Pub/Sub is ephemeral, and a disconnected client can miss an event. PostgreSQL remains authoritative, so the browser can invalidate a query and read the current state again.

This trade-off keeps the protocol small. If the product later needs durable replay, event IDs and a log can be added without pretending the current stream already provides them.

## Move slow effects to workers

Emails, reminders, cleanup, recurring sprint work, and assisted assignment run through Asynq workers. The API can finish the user's request while retryable work gets its own lifecycle.

Every task needs to survive retries. It should use stable selection conditions, make duplicate execution harmless, and record enough context to explain a failure.

Workers also use system actors. If automation archives or assigns a story, the activity can say which system changed it and why. That detail matters when I am debugging, and it matters to the person who sees their work move.

## Keep AI behind application tools

Maya operates through typed tools for stories, planning, reports, workload, and other product operations. The model can interpret a request, but it does not read or write the database directly.

The existing service still authenticates the user, checks permissions, validates input, and records the change. For planning, deterministic code builds a valid candidate set and checks calendar space before the model considers work fit.

This gives the AI a useful role without making it a second backend. It can fail, be replaced, or be disabled while the product rules remain in ordinary code.

## Review external work before accepting it

GitHub issues, Slack messages, and public feedback enter as integration requests. They keep their source context while a team decides whether they belong in the plan.

Once accepted, the normal story service creates the work. The external provider and PostgreSQL cannot share one transaction, so failures across that boundary have to be observable and recoverable.

Bidirectional GitHub sync also records causality. If FortyOne updates an issue, the resulting webhook should be recognised as an echo. Remembering the fields and source of the outbound update prevents a loop from overwriting the story.

## Test the seams

The highest-risk tests sit where responsibility changes hands: an integration request becomes a story, a story event becomes a notification, a planner turns calendar data into a schedule, or a GitHub edit returns as a webhook.

I still write unit and component tests, but seam tests protect the assumptions most likely to disappear from my memory. Time logic gets special attention because weekends, occupied windows, sprint boundaries, and retries create many quiet edge cases.

Observability plays the same role in production. Traces, job errors, domain actors, and operation names give me a way to reconstruct what happened without logging secrets or customer content.

## What makes solo development possible

The system stays manageable because I have resisted independence without a reason: one backend deployment, one relational source of truth, one realtime mechanism, and workers for scheduled or retryable effects.

There are limits. Redis events are not durable. The modular monolith shares one deployment failure domain. Integration acceptance crosses systems. One composition root grows as the product grows. These are known costs, not surprises hidden behind the architecture diagram.

One person can build a complex product, but writing a lot of code is the easy interpretation of that claim. The harder part is arranging the system so each change requires understanding a small, honest part of the whole.
