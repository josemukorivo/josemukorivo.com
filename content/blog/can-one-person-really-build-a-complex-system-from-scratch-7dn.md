---
id: 2745526
title: Can One Person Really Build a Complex System from Scratch?
description: >-
  An advanced architecture walkthrough of FortyOne's Next.js applications, Go
  domains, PostgreSQL, Redis-backed SSE, workers, AI planning, and integrations.
publishedAt: "2025-08-01T11:28:03Z"
updatedAt: "2026-07-16T00:00:00Z"
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

When I began building [FortyOne](https://www.fortyone.app), the difficult question was not whether one person could write enough code. It was whether one person could design a system that remained understandable as it accumulated planning workflows, objectives, real-time collaboration, integrations, analytics, background processing, and an AI teammate.

> The distinction is important. A complex product can be implemented quickly and still become impossible to operate. The real engineering task is to control the number of concepts that must be understood at the same time.

FortyOne is built around that constraint. The architecture favours explicit boundaries, one-directional data flow, asynchronous work where appropriate, and narrowly defined interfaces between product capabilities.

The product now includes work management, sprints, objectives and key results, workload reporting, public feedback, GitHub and Slack intake, calendar-aware planning, real-time collaboration, subscriptions, administration, mobile access, and Maya, an AI teammate.

This article is a map of how those parts work together. It focuses on the decisions that keep the system operable rather than presenting the stack as a list of technologies.

## The system boundary

The frontend is a Turborepo containing the core projects application, marketing and documentation applications, mobile and administration surfaces, and shared packages for UI, authentication, API access, icons, and configuration.

```text
apps/
  projects/  # Core delivery application
  landing/   # Product and marketing site
  docs/      # Documentation
  mobile/    # Expo application
  admin/     # Internal administration
  bot/       # Customer-facing Slack application
packages/
  api-client/
  auth/
  ui/
  icons/
  lib/
```

Each application is deployable, while packages represent contracts that genuinely need to be shared. `ui` owns reusable interaction primitives. `auth` owns session behaviour. `api-client` standardizes communication with the backend. Product-specific modules remain inside the application that owns them.

The core projects application is organized by domain:

```text
modules/
  stories/
  sprints/
  objectives/
  key-results/
  roadmap/
  analytics/
  integration-requests/
  public-portal/
  maya/
```

This layout matters more than whether the repository is called a monorepo. The goal is to ensure that a change to integration intake does not require navigating a global collection of unrelated hooks, components, schemas, and queries.

The backend is a Go modular monolith. Product domains such as stories, sprints, objectives, feedback, integrations, notifications, calendars, and reporting remain separate modules while sharing one deployment and one transactional database.

```text
Next.js applications
        ↓ HTTP
Go API and domain services
        ↓
PostgreSQL + Redis
        ↓
workers, integrations, and SSE
```

_This is intentionally less distributed than a microservice architecture._ FortyOne has many product domains, but they do not each need an independent network boundary. Keeping them in one backend preserves straightforward transactions, local refactoring, and a deployment model that one person can operate.

The important separation exists inside the code: HTTP handlers translate requests, services enforce product rules, repositories persist state, and publishers communicate effects that should happen after a change.

## The frontend has several state systems on purpose

The projects application uses Next.js App Router, React, TypeScript, TanStack Query, Tailwind CSS, Tiptap, Recharts, and a shared component system. Those choices solve different state and rendering problems.

I separate frontend state into:

- **Route and server state:** data loaded for a page or layout.
- **Cached server state:** records that need background synchronization or optimistic interaction.
- **URL state:** search, filtering, sorting, and shareable view selection.
- **Local interaction state:** drafts, menus, dialogs, and temporary selection.

Trying to force all four into one global store would make ownership less clear.

Next.js layouts establish the application shell and workspace context. Server Components can fetch initial data without shipping the fetching implementation to the browser. Interactive product modules then use TanStack Query when they need cache coordination, mutations, or live updates.

The application also uses URL-backed state for filters and navigation. A filtered story list should survive refresh, work with browser history, and be shareable with another person. That makes the URL a better source of truth than an isolated React state variable.

### Mutations own their consistency strategy

A mutation must decide how every visible projection becomes consistent.

For a small update, an optimistic patch can give immediate feedback. For a change with wider consequences, invalidating a focused query may be safer. For server-rendered data, navigation or route revalidation may be the right boundary.

I avoid hiding this decision in generic infrastructure. The module that understands the changed entity should own the cache update or invalidation.

```ts
queryClient.setQueryData(storyKeys.detail(workspaceSlug, storyId), (story) =>
  story ? { ...story, ...changes } : story,
);
```

The same story can appear in a list, detail panel, sprint, personal work view, objective report, and roadmap. Cache helpers and query keys keep those projections consistent without requiring every component to know about every other component.

## Authentication and authorization are separate

The browser authenticates through a shared session cookie named `fortyone_session`. The backend can also resolve bearer credentials for supported clients.

Authentication answers who made the request. Authorization still happens against workspace membership, team access, and role requirements.

The middleware path resolves the current user, loads the workspace context, and applies minimum-role gates where a route needs them. Domain services still validate the identifiers and workspace relationships they receive.

This layered approach matters because the same operation may be reached through the web application, mobile client, AI tool, integration, or worker. None of those transports should become a privileged path around the product rules.

## Domain services own the rules

An HTTP route should not decide how a story update affects notifications, integrations, activity records, or connected clients. Those decisions belong to the story domain.

The typical write path is:

1. Authenticate the actor and resolve the workspace.
2. Validate the command and permissions.
3. Apply the domain change.
4. Persist it through a repository.
5. Record the relevant activity.
6. Publish follow-up work or real-time updates.

This shape keeps transport concerns away from product behaviour. The same service can be used by an API request, an integration, a background task, or an AI tool without duplicating the rules.

Repositories use explicit SQL through `sqlx`. For a product with relational concepts—stories linked to teams, objectives, sprints, labels, members, comments, and integrations—SQL remains a useful representation of what the application is doing. It also makes query cost and transactional behaviour visible.

### Service composition stays explicit

The API bootstrap constructs repositories and services in one composition root.

The story service receives its repository, mentions repository, event publisher, and task service. GitHub and Slack receive the integration-request repository and story service. Feedback receives the story service so that a triaged feedback item can enter the normal creation path. Maya receives stories, reports, calendars, users, its repository, and the planner.

```go
mayaService := maya.New(maya.Dependencies{
	Repository: mayarepository.New(log, db),
	Stories:    storiesService,
	Reports:    reportsService,
	Calendar:   calendarService,
	Users:      usersService,
	Planner:    mayaPlanner,
})
```

There is no runtime container discovering arbitrary dependencies. The wiring is verbose, but it makes product relationships visible and produces ordinary Go values that are straightforward to replace in tests.

### Events separate the write from its effects

Updating a story can have several consequences:

- Record an activity entry.
- Notify a newly assigned person.
- Synchronize an external issue.
- Update connected workspace clients.
- Trigger later automation.

The service persists the authoritative state and publishes a domain event. A consumer interprets the event for notification and real-time effects.

This is not a promise that every side effect is perfectly transactional. It is an explicit consistency boundary. The database remains authoritative, and secondary effects can report or retry failures without rolling back a successful user-facing mutation.

## Real-time updates with Server-Sent Events

FortyOne needs connected clients to observe changes made by other people, integrations, workers, and Maya. The browser only needs a reliable server-to-client stream, so Server-Sent Events are a better fit than introducing a bidirectional socket protocol.

The path for a story update is deliberately small:

```text
story mutation
  → workspace update event
  → Redis Pub/Sub
  → Go SSE hub
  → browser EventSource
  → TanStack Query cache
```

Each connected browser subscribes to two Redis channels: one for user-specific notifications and another for workspace-wide updates. The Go hub tracks clients by user and workspace, supports multiple tabs, and gives every client a bounded send channel.

```go
client := &Client{
	UserID:      userID,
	WorkspaceID: workspaceID,
	Send:        make(chan []byte, 256),
	ctx:         clientCtx,
	cancelFunc:  cancel,
}
```

The buffer absorbs short bursts without blocking the Redis listener. Every connection receives its own cancellation context, so disconnecting one tab stops its subscriptions without affecting the user’s other tabs.

The hub starts two goroutines for each client:

```go
go h.listenToUserNotifications(client)
go h.listenToWorkspaceUpdates(client)
```

The user channel carries private notification data. The workspace channel carries shared updates that every connected member of that workspace may need to observe.

This separation prevents a workspace broadcast from containing notification data intended for one recipient.

The HTTP handler establishes a `text/event-stream` response, disables proxy buffering, flushes each event, and sends a keepalive every 25 seconds. On the client, the connection is scoped to the active workspace:

```ts
const source = new EventSource(
  `${apiURL}/workspaces/${workspace.slug}/notifications/subscribe`,
  { withCredentials: true },
);

source.onmessage = ({ data }) => {
  applyWorkspaceEvent(JSON.parse(data), queryClient);
};
```

The useful part is not the transport itself; it is the cache strategy after an event arrives. A story update patches matching story lists and the individual story record in TanStack Query. Other events invalidate the smallest affected query.

The browser does not blindly patch every story query. It selects active list queries, excludes detail keys, maps the matching story, and separately updates the detail cache:

```ts
queryClient.setQueriesData(
  {
    predicate: (query) =>
      query.queryKey[0] === "stories" &&
      !query.queryKey.includes("detail") &&
      query.isActive(),
  },
  updateStoryInList,
);
```

That keeps inactive cached views from receiving an update whose filter semantics may not be known. For example, changing a story’s status could mean the story no longer belongs in a cached filtered list. In those cases, invalidation is safer than an incomplete local patch.

That avoids two common extremes: refetching the entire application after every event or trying to maintain a second client-side database with perfect local knowledge of backend rules.

The system also has explicit backpressure. If a client cannot accept an event within a short timeout, the event is dropped rather than allowing one slow connection to block the hub. This is acceptable because the stream improves freshness; <u>PostgreSQL remains the source of truth</u> and the client can revalidate.

There is still room to strengthen the design. Event identifiers and replay would make recovery across a lost connection more deterministic. At the current scale, bounded delivery plus query revalidation provides a simpler operational tradeoff.

### Why SSE instead of WebSockets

FortyOne’s main real-time requirement is server-to-browser delivery. Mutations already travel through authenticated HTTP requests.

Server-Sent Events provide:

- A browser-native `EventSource` client.
- Automatic reconnection behaviour.
- A simple text event format.
- Compatibility with ordinary HTTP infrastructure.
- No separate client messaging protocol to design.

WebSockets would be appropriate if the client needed high-frequency bidirectional messages over one persistent connection. For workspace updates and notifications, SSE keeps the protocol smaller.

The tradeoff is that Redis Pub/Sub and the current SSE stream are ephemeral. If a connection is unavailable, events are not replayed. The client must recover by reading current state from the API.

## Asynchronous work is a first-class path

Not every effect belongs in the request that initiated it. Emails, cleanup, scheduled maintenance, workspace lifecycle work, digest generation, overdue reminders, and recurring sprint operations run through Asynq workers.

This keeps user-facing latency predictable and gives retryable work an explicit lifecycle. It also forces an important design discipline: a task must be safe to retry, observable when it fails, and clear about which database state it expects to find.

FortyOne uses scheduled tasks for more than maintenance. Workers can prepare recurring sprint changes, archive or close stale work, migrate unfinished stories, infer work focus, and produce planning or notification events. The worker is therefore part of the product architecture, not an infrastructure afterthought.

The worker runs separately from the API and uses configured queues with a fixed concurrency limit. Queue separation allows notification, cleanup, and automation work to have different operational priorities.

The scheduler currently coordinates jobs such as:

- Daily deletion of expired soft-deleted data.
- Token, webhook, workspace, and chat-session cleanup.
- Automatic sprint creation and unfinished-story migration.
- Story archive and close rules.
- Maya work-focus inference and batch assignment.
- Overdue-story and overdue-objective communication.
- Weekly digests and inactivity warnings.
- Delayed workspace deletion and user deactivation.

```go
scheduler.Register(
	"0 * * * *",
	asynq.NewTask(tasks.TypeMayaBatchAssignment, nil),
	asynq.Queue("automation"),
)
```

Scheduled execution does not remove the need for idempotency. A task may be retried, a scheduler may restart, or two workers may race. Jobs should select work using stable conditions, make duplicate execution harmless, and record enough context to explain their outcome.

### Automation uses system actors

FortyOne resolves stable system identities for Maya, GitHub, and background processes. This allows activities to distinguish a human update from an integration or automation.

That is a product requirement as much as an auditing requirement. If a story was assigned automatically, the interface should be able to explain which system made the change and why.

## AI is an orchestration layer, not a database

Maya, FortyOne’s AI teammate, operates through a set of typed tools. The language model can reason about a request, but current workspace data and state-changing operations remain behind deterministic application interfaces.

```ts
const result = streamText({
  model,
  system: systemPrompt + userContext,
  messages: modelMessages,
  tools,
  maxOutputTokens: 4000,
  stopWhen: stepCountIs(25),
});
```

The tools cover stories, sprints, objectives, key results, reports, workload planning, integrations, navigation, comments, notifications, and other product operations. Server-side authorization still applies. The model does not gain a privileged path around the domain services.

The route supports more than one model provider, streams words smoothly to the interface, records AI telemetry through PostHog, and persists the completed conversation. A development middleware can expose model activity without changing production behaviour.

The 25-step limit is important. Agent loops need an explicit budget so a malformed tool result or circular plan cannot run indefinitely.

### Tool contracts are application contracts

A tool has:

- A description explaining when it should be used.
- A Zod input schema.
- The current workspace context.
- Authentication and role checks.
- A call into an existing query or API boundary.
- A structured success or failure result.

```ts
if (!confirmed) {
  return requireToolConfirmation("create a Maya work plan for this story");
}
```

This confirmation check exists in executable code. The model cannot bypass it by deciding that the user “probably meant yes.”

Consequential actions use a preparation-and-confirmation flow. Maya can retrieve evidence, propose a change, explain why it is appropriate, and wait for the user before execution. That is a more useful safety boundary than relying on prompt wording alone.

Planning demonstrates why this architecture matters. The backend planner can combine:

- A team member’s role and current assignments.
- Estimated load and number of open stories.
- Recent activity.
- Calendar events and existing schedule blocks.
- Available working windows.

It can then propose an assignee and a realistic slot. If no safe slot exists, it produces a schedule risk instead of manufacturing certainty. The language model can assist with judgment, but the candidate data, availability calculations, and resulting actions remain structured.

## The planning algorithm is hybrid by design

The planner demonstrates how I combine deterministic software with model judgment.

First, the backend normalizes the planning request:

- Validate workspace and story identity.
- Restrict the planning window to the sprint where appropriate.
- Convert the estimate into a duration.
- Enforce a minimum slot.
- Normalize time values to UTC.

If the story has no estimate, the planner uses a conservative default and a small heuristic for work that appears to be a larger integration or platform task.

It then builds occupied intervals from synchronized calendar busy windows and existing FortyOne schedule blocks.

```go
for _, window := range candidate.BusyWindows {
	slots = append(slots, timeSlot{
		start: window.StartAt.UTC(),
		end:   window.EndAt.UTC(),
	})
}
```

The slot search:

1. Aligns the cursor to the next half hour.
2. Skips weekends.
3. Restricts planning to working hours.
4. Advances past occupied intervals.
5. Accumulates free time across boundaries.
6. Returns a schedule only when the required duration fits.

For a 16-hour estimate, the complete plan can span several workdays while the first calendar focus block is capped at two hours. This separates the expected work window from the first actionable block.

Candidates with a valid slot are ranked by:

1. Earliest available time.
2. Lowest total estimate load.
3. Fewest open stories.
4. Stable name ordering as a final deterministic tie-breaker.

The planner also prefers people with recent activity when such candidates exist.

An optional AI advisor receives only the candidate set and structured evidence:

- Role title and description.
- Story title, description, and estimate.
- Workload.
- Available slot.
- Recent activity.

The advisor can recommend one of those candidates and explain the fit. If it fails, returns an invalid identity, or is unavailable, the deterministic ranking remains functional.

> This is a critical architectural property: AI improves the decision but is not required for the system to produce a valid plan.

The output is a set of proposed actions:

```go
[]CoreAction{
	{Type: ActionTypeAssignStory},
	{Type: ActionTypeScheduleWorkBlock},
}
```

If no safe slot exists, the output can contain `flag_schedule_risk`. Uncertainty becomes first-class data rather than a fabricated date.

Applying the plan is a separate operation. That separation allows the user to inspect the proposed owner, schedule, and reasons before any story or calendar record changes.

## Integrations enter through a review boundary

GitHub issues, Slack messages, and customer feedback can all produce work candidates. They do not automatically become committed stories.

FortyOne stores these as integration requests with their source context and review status. A team can add an assignee, estimate, objective, key result, sprint, or dates before accepting the request. Declining a request is also a meaningful outcome.

The database enforces one pending identity per external source using the workspace, provider, source type, and source external ID. Repeated webhooks update the same candidate instead of filling the queue with duplicates.

Acceptance follows the normal story service:

```go
story, err := s.stories.CreateExternal(
	ctx,
	actorID,
	toNewStory(request),
	workspaceID,
)
```

After story creation, the provider-specific accepter can establish its link or synchronize external state. The integration request is finally marked accepted with the story and actor that made the decision.

The sequence has a consistency tradeoff: the story and external provider do not share one transaction. Failures must therefore be observable and, where possible, retryable or reconcilable.

This boundary protects the internal planning model. External systems can suggest work without controlling the roadmap.

The public feedback portal follows the same architecture. Feedback items, comments, votes, and statuses live in their own domain. When an item is ready, the feedback service creates a story through the normal story path, preserving the distinction between customer demand and an engineering commitment.

The feedback schema also stores story links, public updates, board relationships, vote uniqueness, and searchable text. Public feedback is a separate bounded context, not a second implementation of stories.

## GitHub synchronization needs causality

A bidirectional integration can easily create an echo loop:

1. FortyOne updates an issue.
2. GitHub emits an `issues` webhook.
3. FortyOne treats the webhook as an external edit.
4. The story is rewritten and another outbound sync begins.

FortyOne stores the last synchronization source and a hash of the outbound fields it actually controls. Matching inbound `opened`, `edited`, `closed`, or `reopened` events can be recognized as echoes.

The hash intentionally covers only title, body, and state because those are the issue fields written by the outbound path. Labels and assignees remain outside that fingerprint so genuine GitHub-originated changes are not suppressed.

_This is a general integration lesson: sender identity is not enough to establish causality._ A robust sync path records what it sent and compares the resulting event with that ledger.

## Observability is part of the design

A solo-built system cannot depend on one person remembering every interaction. Important service and repository operations create trace spans, record errors, and attach domain context. Background jobs and integration paths are designed to leave evidence when they fail.

This is not only an operations concern. Observability exposes poor boundaries. If a single trace crosses many unrelated modules or a failure cannot be attributed to a product operation, the architecture is usually telling you that responsibilities have become blurred.

The Go HTTP framework creates spans around request handling. Services, repositories, and jobs add child spans and events for meaningful operations. Trace context can be propagated into outbound calls.

The backend also exposes a separate metrics process with `pprof` and `expvar` endpoints for profiling and runtime diagnostics.

On the frontend, PostHog captures product events, feature use, and AI telemetry. Exceptions in real-time event handling are reported rather than silently ignored.

Observability has privacy boundaries. Workspace identifiers, operation names, and failure categories are useful. Secrets, raw credentials, and unnecessary customer content are not.

## Deployment is split by operational responsibility

The web applications can deploy independently, while the Go API and worker are separate container images.

The release workflow builds both images, tags them with the commit SHA, publishes them, renders the current Amazon ECS task definitions, and deploys the API and worker services independently.

```yaml
strategy:
  matrix:
    service:
      - name: server
      - name: worker
```

Separating the worker from the HTTP server means a long-running or bursty automation workload does not consume the API’s request-serving capacity. They still share database and Redis contracts, so deployment compatibility matters.

Database migrations must be forward-compatible with the period in which old and new containers may overlap. Destructive schema changes require staged releases rather than assuming an instantaneous deployment.

## Testing the seams

The highest-risk tests are not only component snapshots or isolated functions. They are tests around the seams where one subsystem hands responsibility to another.

FortyOne has focused tests for:

- Story and notification rules.
- Integration-request acceptance and decline behaviour.
- GitHub synchronization and echo suppression.
- Maya candidate recommendations and deterministic fallback.
- Calendar conflicts and schedule-block creation.
- Work-plan application.
- Public feedback to story conversion.
- Automation jobs and generated reasons.
- Authentication and privileged realtime access.

The planner tests are especially valuable because time logic is full of edge cases: weekends, occupied windows, sprint boundaries, duplicate schedule blocks, unavailable candidates, and advisor failure.

_For a solo-built system, tests are external memory._ They preserve decisions that would otherwise live only in the builder’s head.

## What makes solo development possible

The system is manageable because it avoids unnecessary independence:

- One modular backend instead of many premature services.
- One relational source of truth.
- Redis for ephemeral distribution and task coordination.
- A single server-to-client real-time mechanism.
- Shared frontend packages with product modules kept close to their routes.
- AI tools that reuse application contracts.
- Workers for effects that should be retried or scheduled.

It also accepts some deliberate limitations:

- Redis Pub/Sub events are not durable.
- A modular monolith shares one deployment failure domain.
- Integration acceptance crosses transactional boundaries.
- AI recommendations depend on the quality of supplied context.
- One composition root becomes large as the product grows.

These are not hidden flaws. They are tradeoffs to monitor. Architecture becomes dangerous when limitations are denied rather than documented.

The tradeoff is concentration. Product design, implementation, operations, and support decisions still pass through one person. Strong boundaries reduce that cognitive load, but they do not remove it.

> One person can build a complex system from scratch. The sustainable version of that claim is less dramatic: one person can build it when the architecture continuously limits how much complexity must be considered for each change.

The most valuable decisions were not choosing Next.js, Go, PostgreSQL, Redis, or an AI model. They were:

- Keeping product domains explicit.
- Using one authoritative relational model.
- Making asynchronous work visible.
- Treating real-time updates as a projection, not the source of truth.
- Giving AI constrained tools and deterministic fallbacks.
- Preserving review boundaries between external demand and committed work.
- Recording reasons and actors for automated changes.

_Complexity cannot be eliminated from a product that solves a complex operational problem._ It can be placed behind boundaries so that each change requires understanding a manageable part of the whole.
