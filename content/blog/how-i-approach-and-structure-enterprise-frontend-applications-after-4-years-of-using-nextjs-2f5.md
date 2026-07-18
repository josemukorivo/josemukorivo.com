---
id: 1535606
title: >-
  How I Approach and Structure Enterprise Frontend Applications After Four
  Years of Next.js
description: >-
  The domain boundaries, state ownership, runtime checks, and team rules I use
  to keep large Next.js applications understandable.
publishedAt: "2023-09-09T13:09:00Z"
updatedAt: "2026-07-18T17:47:50Z"
tags:
  - nextjs
  - typescript
  - javascript
  - react
socialImage: >-
  https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fska3r0y78p5mksu4h1gz.jpg
originalUrl: >-
  https://dev.to/josemukorivo/how-i-approach-and-structure-enterprise-frontend-applications-after-4-years-of-using-nextjs-2f5
---

Large frontend applications usually become difficult because ownership is unclear. State is copied between stores, shared components make different promises, and a small feature touches folders all over the repository.

After four years with Next.js, I care less about finding the perfect folder structure and more about making change predictable. A developer should be able to find a feature, see what it depends on, change it, and test it without reading the whole application.

I use _enterprise_ for a product that has accumulated responsibilities it must keep handling: permissions, long-lived workflows, integrations, multiple environments, accessibility, and several people changing the same system. The size of the company is secondary.

## Organise around product domains

I keep the code for one product responsibility together. A projects module can own its queries, schemas, components, actions, and tests:

```text
src/
  app/
  modules/
    billing/
    projects/
    users/
  components/
    ui/
  lib/
```

The `app` directory handles routes, layouts, and route-level states. `modules` contains product behaviour. `components/ui` contains low-level controls such as buttons, dialogs, and fields. `lib` is for stable infrastructure such as authentication and API clients.

I avoid global `hooks`, `utils`, or `components` folders as default destinations. If a helper only makes sense for projects, it belongs with projects. Shared code should represent a contract that has actually become shared.

## Keep dependencies moving one way

A folder diagram means little if anything can import anything else. My preferred direction is:

```text
routes → product modules → UI primitives → utilities
```

A project form can import a dialog. The dialog must never import the projects module. That rule keeps product knowledge out of the shared layer.

Each module can expose a small public surface:

```ts
export { ProjectForm } from "./components/project-form";
export { createProject } from "./actions/create-project";
export type { ProjectSummary } from "./types";
```

The entry point is a boundary, so I do not export every internal file through it. ESLint rules, package exports, or workspace packages can enforce these directions when convention alone stops being enough.

## Put server and client boundaries low

With the App Router, the important question is where code runs.

I start with Server Components for route composition and data that does not need browser interactivity. A Client Component is appropriate when a subtree needs state, effects, event handlers, browser APIs, or a client cache.

```tsx
export default async function ProjectPage({ params }) {
  const project = await getProject(params.id);

  return (
    <ProjectView project={toProjectView(project)}>
      <ProjectActions projectId={project.id} />
    </ProjectView>
  );
}
```

Here the route and view stay on the server. Only `ProjectActions` needs the client. I keep `"use client"` as low as practical because every import below it joins the browser graph.

I also pass purpose-built view data across that boundary. A server object may contain fields the browser does not need, and TypeScript will not stop us from serialising them.

## Give every kind of state an owner

I separate state by where its truth lives:

- Server data belongs to the API or database.
- Filters, search, sorting, and pagination often belong in the URL.
- Drafts, menus, and dialogs usually belong in local React state.

TanStack Query is useful when server data needs background updates, optimistic mutations, polling, or coordinated cache invalidation. I still treat its cache as a view of server data, not as a second place for business rules.

Every mutation needs a consistency decision. It can patch a known cache entry, invalidate a focused query, or navigate to server-rendered data. Scattered `refetch` calls are a warning that nobody owns the decision.

Context is useful for a stable capability shared by one subtree. It is a poor default for frequently changing application data because one convenient provider can create a very wide rendering dependency.

## Use TypeScript for real constraints

TypeScript earns its place when it rules out invalid product states.

```ts
type RequestState<Data> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Data }
  | { status: "error"; message: string };
```

This union cannot accidentally be both loading and successful. It is clearer than several booleans whose combinations nobody has defined.

Static types disappear at runtime, so input from forms, APIs, webhooks, and environment variables still needs validation:

```ts
const CreateProject = z.object({
  name: z.string().trim().min(1).max(120),
  ownerId: z.string().uuid(),
});

const input = CreateProject.parse(await request.json());
```

Parsing checks the shape. Authorization and business rules remain server responsibilities. Hiding a button in the browser is never an authorization check.

## Treat shared components as contracts

A reusable component should make the correct behaviour easier for every team. A button should keep native button attributes, expose a clear loading state, prevent duplicate submissions, and work with a keyboard. A dialog should handle focus before a product team adds any domain content.

I review shared components for semantics, accessible names, keyboard behaviour, loading, errors, and mobile use. Visual variants should not change those rules.

I am cautious with components that collect many boolean props. They often represent several incompatible modes hidden inside one API. Composition or a small union of variants is easier to understand.

The same applies to a design system. Components need ownership, tokens, examples, and a way to change their contracts. Without that, the library becomes another folder of code that each team interprets differently.

## Test the expensive failures

I test at the narrowest level that protects the behaviour:

- Unit tests for transformations and domain rules.
- Component tests for semantics and interaction.
- Integration tests for server boundaries and persistence.
- A small Playwright suite for complete business journeys.

Authentication, permissions, payments, destructive actions, and creation flows deserve more protection than decorative details. I also add boundary tests after incidents, especially for dates, API errors, webhooks, and cache updates.

Large end-to-end suites can become slow and ignored. A few reliable journeys, backed by focused lower-level tests, have worked better for me.

## Make team rules part of the architecture

The structure survives only if the team uses it consistently. I document where a product capability belongs, how server and client boundaries are chosen, where runtime validation happens, and which checks must pass before merge.

Those rules can change. If ordinary work keeps forcing exceptions, I inspect the rule before blaming every developer who crosses it.

Next.js gives us routing and rendering tools. TypeScript gives us a way to express contracts. Neither can decide where the product's responsibilities belong. That judgment is the architecture, and its quality shows up in how safely the next person can make a change.
