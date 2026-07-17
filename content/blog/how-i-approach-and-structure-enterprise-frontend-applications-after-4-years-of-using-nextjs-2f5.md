---
id: 1535606
title: >-
  How I Approach and Structure Enterprise Frontend Applications After Four
  Years of Next.js
description: >-
  A practical guide to domain architecture, TypeScript conventions, state
  ownership, rendering boundaries, accessibility, testing, tooling, and
  operating large Next.js applications.
publishedAt: "2023-09-09T13:09:00Z"
updatedAt: "2026-07-16T00:00:00Z"
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

Large frontend applications rarely become difficult because React or Next.js cannot support the required scale. They become difficult when product boundaries are unclear, state has no obvious owner, shared components make inconsistent promises, and every new feature introduces another local convention.

> After four years of building with Next.js, I have found that enterprise frontend architecture is primarily an exercise in making change predictable. A developer should be able to locate a feature, understand its dependencies, modify it without reading the entire repository, and verify the result with confidence.

This is not the only valid approach. It is the collection of principles and conventions that has worked consistently for me.

The word _enterprise_ can be misleading. It does not necessarily mean millions of users or hundreds of engineers. It means the application has accumulated responsibilities that must remain reliable over time: authentication, permissions, complex forms, long-lived workflows, integrations, accessibility, observability, multiple environments, and several teams changing the same product.

_At that point, architecture is less about choosing a fashionable framework and more about controlling coupling._

## The principles I start with

### Modularity and componentization

I divide an application by product responsibility, then keep the code required to deliver that responsibility close together. A billing module may contain routes, queries, actions, schemas, components, and tests. It should not require developers to search several global folders to understand one workflow.

Shared code is useful when it represents a genuinely stable contract. Premature abstraction is not modularity; it is often a dependency between features that have not yet proved they are the same.

### Separation of concerns

Routes should compose product capabilities. Product modules should own business behaviour. Shared UI primitives should know about interaction and presentation but not about a specific domain.

The same principle applies across the network boundary. Authentication, authorization, validation, and persistence should be explicit server responsibilities. <u>A client-side hidden button is not an authorization rule</u>, and a TypeScript type is not runtime validation.

### Scalability by design

Scalability is not only the number of users a system can serve. It is also the number of engineers and product changes the codebase can support without becoming incoherent.

I prefer structures that allow teams to work in separate domains, packages that have clear ownership, and APIs that can evolve without forcing unrelated parts of the application to change.

There are at least three separate kinds of scale to consider:

- **Runtime scale:** traffic, data volume, response latency, and infrastructure limits.
- **Product scale:** the number of workflows, roles, integrations, and exceptional cases.
- **Organizational scale:** the number of people and teams that must safely change the system.

A caching strategy can improve runtime scale while making the application harder to reason about. A monorepo can improve organizational scale while increasing the importance of package boundaries. The correct architecture balances all three rather than optimizing one metric in isolation.

### Maintainability and code quality

Readable code has a compounding return. Consistent naming, small interfaces, narrow modules, automated formatting, type checking, and tests all reduce the amount of context required for the next change.

Documentation should explain decisions and contracts. It should not reproduce complete source files that will become stale.

I also treat code review latency as an architectural signal. If a small feature repeatedly produces large diffs across unrelated folders, the boundaries are probably wrong. If reviewers need to reconstruct hidden state interactions before approving a component, state ownership is probably unclear.

### Accessibility by default

Accessibility is most reliable when it is built into shared primitives. Buttons, dialogs, menus, inputs, and links should have correct semantics, focus behaviour, keyboard interactions, labels, errors, and disabled states before a feature team uses them.

Retrofitting these behaviours in every product screen is slower and produces inconsistent results.

### Performance as a measured constraint

Performance work should begin with evidence. I pay attention to server response time, client JavaScript, hydration cost, interaction latency, image delivery, caching, and avoidable data waterfalls.

_The objective is not a perfect synthetic score._ It is a product that remains responsive on the devices and networks its users actually have.

In a Next.js application, I normally investigate:

- Whether the server can begin data work in parallel.
- Whether a route sends more JavaScript than its interactions require.
- Whether large providers force an unnecessarily wide client boundary.
- Whether data is fetched twice across server and client layers.
- Whether list rendering, charts, or editors dominate interaction time.
- Whether images, fonts, and third-party scripts delay useful content.

Performance budgets are more useful than occasional optimization campaigns. A team can agree on acceptable route payloads, interaction latency, and Core Web Vitals, then make regressions visible in CI or monitoring.

### Security at every boundary

Treat forms, API responses, webhooks, environment variables, URL parameters, and stored data as untrusted inputs. Validate them at the boundary where they enter the system.

Authorization should be checked beside the protected operation. Keeping that rule on the server prevents presentation logic from becoming a security mechanism.

Frontend security work also includes controlling where sensitive values are serialized. A Server Component can access a server-only object, but passing that object into a Client Component can expose more data than the browser needs.

Return purpose-built view models, avoid leaking internal identifiers or secrets, set an explicit Content Security Policy where practical, and review third-party scripts as production dependencies rather than harmless markup.

### Internationalization and localization

Even when a product launches in one language, avoid embedding assumptions that make future localization unnecessarily expensive. Dates, times, numbers, plural rules, text direction, and message length all affect component contracts.

The server and browser must also agree on time zones and locale-sensitive formatting. Storing a formatted date string in domain state usually creates more problems than storing an instant and formatting it at the presentation boundary.

## A domain-oriented project structure

Folder structure should communicate ownership. The following is a simplified example:

```text
src/
  app/
  modules/
    billing/
    projects/
    users/
  components/
    ui/
    shared/
  hooks/
  lib/
  styles/
```

The `app` directory owns routing, layouts, route-level loading and error states, and composition. It should remain relatively thin.

The `modules` directory contains product domains. A module can expose the small public surface required by routes or other domains while keeping its implementation private:

```text
modules/projects/
  api/
  components/
  hooks/
  schemas/
  types/
  utils/
```

`components/ui` contains low-level, reusable primitives such as buttons, dialogs, fields, and menus. `components/shared` is for composed application patterns that are reused across domains but do not belong to one product module.

`lib` contains stable infrastructure such as authentication helpers, API clients, telemetry, and environment parsing. I avoid turning it into a miscellaneous folder. If a utility only makes sense for projects, it belongs in the projects module.

Path aliases can make these boundaries easier to read:

```ts
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/modules/projects";
import { requireSession } from "@/lib/auth";
```

I also avoid broad barrel exports in large folders. Explicit imports make dependencies visible and reduce accidental bundle growth.

## Make dependencies directional

A folder structure only helps when imports respect it. My preferred dependency direction is:

```text
routes
  → product modules
    → shared application patterns
      → UI primitives
        → low-level utilities
```

UI primitives should not import billing, projects, or authentication modules. A projects module may consume a dialog primitive, but the dialog package should never know what a project is.

Cross-domain imports deserve scrutiny. If billing needs project information, the cleanest boundary may be a small public query or server contract rather than importing billing internals directly into projects.

I often expose a narrow module entry point:

```ts
export { ProjectForm } from "./components/project-form";
export { createProject } from "./actions/create-project";
export type { ProjectSummary } from "./types";
```

The entry point is not permission to export everything. It defines which parts of the module other code is allowed to depend on.

Dependency rules can be enforced with ESLint boundaries, package-level exports, TypeScript project references, or separate workspace packages. Tooling should reinforce the architecture instead of leaving it as a diagram in documentation.

## App Router and rendering boundaries

The App Router encourages developers to think about where code runs. That is more important than whether a file contains JSX.

Server Components are a strong default for route composition and data that does not require browser interactivity. They can read from server-side services, avoid shipping their implementation to the browser, and stream route segments through Suspense.

Client Components are appropriate when a subtree needs state, effects, event handlers, browser APIs, or a client-side data cache.

The `"use client"` directive creates a boundary. Everything imported into that client graph must be suitable for the browser, so I place it as low in the tree as possible:

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

Here, the route can remain on the server while `ProjectActions` owns the interactive client behaviour.

Large top-level providers are sometimes necessary, but they should be treated as architecture. A provider that wraps the entire application can force more rendering and client code than a provider scoped to one workflow.

I also avoid passing large objects through the server-to-client boundary. Serialize the minimum stable shape required by the interactive component.

## TypeScript should describe the product

TypeScript adds the most value when it models constraints rather than merely annotating JavaScript.

### Prefer options objects for evolving operations

Functions with several positional arguments become difficult to read and risky to extend. An options object makes the call site self-documenting:

```ts
type CreateProjectInput = {
  name: string;
  ownerId: string;
  workspaceId: string;
};

function createProject(input: CreateProjectInput) {
  // Validate and execute the operation.
}
```

The same input shape can often become the boundary for runtime validation, tests, and transport adapters.

An options object is especially useful when arguments share a type:

```ts
scheduleProject({
  projectId,
  startDate,
  endDate,
  ownerId,
});
```

The positional equivalent is easy to call incorrectly and difficult to review. The object also gives the operation one place to document optional and mutually exclusive values.

### Model mutually exclusive states

Several booleans can describe impossible combinations. A discriminated union makes valid states explicit:

```ts
type RequestState<Data> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Data }
  | { status: "error"; message: string };
```

Components can now handle every case deliberately, and TypeScript can report an unhandled state.

### Use names that expose intent

Local variables and functions use `camelCase`. Components and types use `PascalCase`. Boolean names should read as predicates, such as `isLoading`, `hasPermission`, or `canEdit`.

Constants should communicate their domain meaning. For fixed object values, I use `as const satisfies` to preserve literal types while checking the intended shape:

```ts
const PROJECT_STATUS = {
  planned: "planned",
  active: "active",
  completed: "completed",
} as const satisfies Record<string, string>;
```

Generic names should be descriptive when the relationship is not obvious. `TData` and `TError` communicate more than a sequence of single-letter type parameters in a public API.

I do not apply “always use `type`” or “always use `interface`” as an absolute rule. Type aliases are excellent for unions, mapped types, and most application models. Interfaces remain useful for extensible object contracts and declaration merging.

_Consistency matters, but semantic accuracy matters more than turning a team preference into a language law._

### Validate at runtime

Static types disappear when the application runs. Data entering from a form, API, webhook, database, or environment variable must still be parsed and validated.

I prefer validation at the boundary, followed by strongly typed domain code. This gives the rest of the application a clear assumption: values have already been checked before they arrive.

```ts
const CreateProject = z.object({
  name: z.string().trim().min(1).max(120),
  ownerId: z.string().uuid(),
  targetDate: z.coerce.date().optional(),
});

const input = CreateProject.parse(await request.json());
```

The schema is not the domain operation itself. Parsing establishes that the input has the right shape; authorization and business rules still belong to the server-side operation.

## State needs an explicit owner

I separate application state into three categories:

- **Server state:** data owned by an API or database.
- **URL state:** filters, search, pagination, sorting, and selected views that should be shareable.
- **Local interface state:** temporary values such as an open dialog, draft text, or active tab.

This classification prevents server data from being copied into global client stores without a strong reason.

Server Components are useful when data can be fetched and rendered at the route boundary without client interactivity. A client cache such as TanStack Query is useful when the interface needs live updates, optimistic mutations, polling, or coordinated background refetching.

The URL is often the best store for state that a user expects to bookmark, share, or restore. Local React state is usually enough for transient interaction state.

For independent server operations, start work in parallel to avoid unnecessary waterfalls. For every mutation, define the consistency strategy: update the cache directly, invalidate a precise query, or navigate to data rendered from the server. _Scattered refetch calls are not a strategy._

### Server state

Server state has a lifecycle outside the component. It may change because another person, worker, integration, or browser tab updated it.

A client cache is useful when the interface needs background synchronization, optimistic updates, pagination, or offline-aware behaviour. The cache should still be treated as a projection of server truth rather than an independent source of product rules.

### URL state

Filters, selected tabs, search terms, sorting, and pagination often belong in the URL:

```text
/projects?status=active&owner=me&page=2
```

This makes the view refresh-safe, shareable, and compatible with browser navigation. It also reduces pressure to place every cross-component value in Context.

### Local and global client state

Local state is appropriate for drafts and interaction details that disappear with the component.

Context is useful for stable cross-cutting capabilities such as a scoped editor instance, current workspace shell, or compound component coordination. It is not a replacement for every other state category.

If a Context value changes frequently and wraps a large tree, split the provider or separate read and action contracts. Otherwise, an apparently convenient global store can create wide rendering dependencies.

## Reusable components are contracts

> A reusable component is successful when consumers can predict its semantics and behaviour without reading its implementation.

A button should preserve native button attributes, forward the relevant ref, expose a clear loading contract, and prevent duplicate actions while loading:

```tsx
function Button({ loading = false, disabled, children, ...props }) {
  return (
    <button
      {...props}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      {loading ? "Working…" : children}
    </button>
  );
}
```

Visual variants should not change that semantic contract. If a component supports icons, loading indicators, or destructive styling, those capabilities should compose cleanly rather than producing a long list of interacting boolean props.

For shared components, I review:

- Native semantics and expected browser behaviour.
- Keyboard and focus interactions.
- Accessible names, descriptions, and error messages.
- Controlled and uncontrolled usage where appropriate.
- Loading, empty, disabled, and failure states.
- Responsive and cross-browser behaviour.
- Tests for the interaction contract.
- Documentation and migration notes when the API changes.

Storybook can be valuable for developing these states in isolation and making the component contract visible to designers and engineers.

## Design systems need governance

A component library alone is not a design system. A sustainable system also includes:

- Design tokens for colour, spacing, typography, elevation, and motion.
- Accessibility and interaction standards.
- Content and naming conventions.
- Ownership and a contribution process.
- Versioning or migration guidance.
- Examples of when _not_ to use a component.

The objective is not to prevent product teams from designing. It is to centralize decisions that should not be rediscovered in every feature.

Variant APIs should describe meaningful choices:

```tsx
<Button variant="danger" size="small">
  Delete project
</Button>
```

They should not expose implementation details such as arbitrary padding combinations. When every CSS decision becomes a prop, the shared component stops enforcing a system.

For mutually exclusive capabilities, TypeScript can make invalid combinations unrepresentable:

```ts
type IconProps =
  | { leftIcon: ReactNode; rightIcon?: never }
  | { leftIcon?: never; rightIcon: ReactNode }
  | { leftIcon?: never; rightIcon?: never };
```

Use this technique where the restriction is real. Over-modeling every visual combination can make a component harder to consume than the problem requires.

## Data fetching and APIs

The browser should receive the smallest stable contract required by the interface. Avoid exposing raw database shapes when the frontend needs a product-specific view.

With TanStack Query, query keys and invalidation rules should live close to the feature that owns them. Mutations should define what becomes stale. Optimistic updates are useful when the rollback behaviour is clear and the action is likely to succeed.

For forms, the server remains authoritative. Client validation improves feedback, but the operation must be validated and authorized again at the server boundary.

Error handling should preserve useful distinctions. Validation failure, permission denial, conflict, rate limiting, and an unavailable dependency should not collapse into the same generic message or retry behaviour.

## Forms and mutations

Enterprise applications often contain more complexity in forms than in dashboards.

A robust form flow normally has:

1. Accessible labels, descriptions, and field errors.
2. Client-side feedback for fast correction.
3. Server-side parsing and authorization.
4. A domain operation with explicit outcomes.
5. Submission state that prevents accidental duplicates.
6. Recovery that preserves the user’s input.

Server Actions can be an effective transport boundary, but they should not become a place to mix parsing, permissions, database access, email delivery, cache invalidation, and presentation messages in one function.

Keep the action thin:

```ts
export async function createProjectAction(formData: FormData) {
  const session = await requireSession();
  const input = CreateProject.parse(Object.fromEntries(formData));

  return createProject(session, input);
}
```

The underlying operation should remain callable from other transports and testable without rendering a form.

For destructive or high-impact actions, confirmation should describe the consequence rather than repeat the button label. A disabled state, progress state, and idempotency strategy are part of the mutation contract.

## Errors and observability

Error boundaries are presentation tools, not a replacement for error classification.

I distinguish:

- Expected validation or permission errors that can be shown near the action.
- Recoverable dependency failures that may offer retry.
- Route-level failures that need an error boundary.
- Programmer errors that should be reported and investigated.

Production observability should connect a frontend symptom to the server request that caused it. Error reports benefit from route, release, workspace, feature flag, and correlation identifiers, while avoiding sensitive personal or credential data.

Analytics events should describe product decisions, not every click. A stable event such as `project_created` is more useful than a stream of DOM-level interaction names that change with the interface.

## Testing for confidence

I test at the narrowest level that protects the contract:

- Unit tests for deterministic transformations and domain rules.
- Component tests for interaction, semantics, and accessibility.
- Integration tests for server boundaries, persistence, and external adapters.
- A focused set of end-to-end tests for critical user journeys.

React Testing Library is useful when tests describe behaviour from the user’s perspective. Playwright is my preference for end-to-end coverage because it exercises the application in real browsers and supports reliable tracing when a test fails.

The goal is not maximum test volume. It is confidence in the paths where a regression would be expensive: authentication, permissions, payments, creation flows, destructive actions, and core collaboration workflows.

I also include contract tests at boundaries that have caused production incidents: date serialization, API error mapping, feature-flag defaults, webhook payloads, and cache invalidation after mutations.

End-to-end tests should remain selective. A large suite that is slow and flaky becomes ignored. Cover a small number of complete business journeys, then use lower-level tests for the combinatorial detail inside them.

## Tooling choices

The exact packages will continue to change. The decision criteria should remain stable.

I use Next.js when its routing, rendering, and server boundaries fit the product. TypeScript provides compile-time contracts. TanStack Query is appropriate when the client genuinely needs a server-state cache. Auth.js can provide a strong authentication foundation, while authorization remains an application responsibility.

Turborepo is useful when several applications and packages need coordinated development, caching, and CI. It is unnecessary when a single application has no meaningful package boundaries.

In a monorepo, I separate packages by ownership and release responsibility:

```text
apps/
  admin/
  customer-portal/
  projects/
packages/
  api-client/
  auth/
  ui/
  eslint-config/
  tsconfig/
```

An application may depend on shared packages. A shared package should not import an application. Package exports define the supported API, and CI should build only affected work while still protecting consumers from incompatible changes.

Formatting, linting, type checking, tests, builds, and dependency checks should run automatically in CI. Local tooling should make the correct workflow easy, while CI protects the shared repository.

_Choose a tool because it removes a recurring source of complexity, not because it appears on an enterprise technology checklist._

## Team conventions are architecture

The most elegant directory structure will fail if every team interprets it differently.

I document a small set of enforceable rules:

- Where a new product capability belongs.
- Which modules may depend on each other.
- How server and client boundaries are chosen.
- How runtime input is validated.
- Where query keys and mutation consistency live.
- What shared component quality requires.
- Which checks must pass before merge.

Architecture decision records are useful for choices that future developers may otherwise “simplify” without knowing the original constraint. They should be short: context, decision, alternatives, and consequences.

The rules should also evolve. If developers repeatedly need to violate a convention to deliver ordinary work, investigate the convention instead of blaming every exception.

## Practices I avoid

- A single global `components` directory with no ownership.
- Large client components that fetch, transform, mutate, and render everything.
- Generic `helpers` or `utils` folders that become unreviewable.
- Boolean-heavy component APIs with unclear combinations.
- Duplicating server data across several client stores.
- Authorization rules that exist only in the interface.
- Abstractions introduced before two use cases have demonstrated the same contract.
- Full source-file examples when a smaller example explains the decision.
- Top-level client providers added without considering their rendering scope.
- A monorepo where every package can import every other package.
- Deep custom memoization before measuring the actual rendering cost.
- Catch-all error messages that make operational failures indistinguishable.

## Conclusion

> Enterprise frontend architecture is not measured by the number of layers in a repository. It is measured by the cost and safety of change.

Domain boundaries make ownership clear. TypeScript expresses product constraints. Runtime validation protects trust boundaries. Explicit state ownership prevents duplication. Accessible primitives make quality repeatable. Focused tests protect important behaviour.

The best architecture is the one that allows a team to understand where a change belongs, implement it without surprising unrelated features, and verify that it works.

It should also remain proportionate. A five-person product does not need every platform practice used by a five-hundred-person organization. It does need boundaries that match its current risks and a path to strengthen them as those risks grow.

Next.js provides rendering, routing, caching, and server capabilities. TypeScript provides a language for contracts. Turborepo, TanStack Query, Playwright, Storybook, and design-system tooling solve specific coordination problems.

_None of them can decide where your product boundaries belong._ That is the architectural work: turning business responsibilities into code that remains legible after years of change.

## Further reading

- [Next.js documentation](https://nextjs.org/docs)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Playwright documentation](https://playwright.dev/docs/intro)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
