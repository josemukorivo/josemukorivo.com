---
canonical_url: >-
  https://josemukorivo.com/blog/how-react-checks-if-2-values-are-the-same-value-3g4a
id: 987588
title: How React checks if 2 values are the same value
description: >-
  A detailed walkthrough of Object.is, React's equality helper, shallow
  comparison, memoization, Hook dependencies, and immutable updates.
publishedAt: "2022-02-14T05:47:53Z"
updatedAt: "2026-07-16T00:00:00Z"
tags:
  - react
  - javascript
  - beginners
  - webdev
socialImage: >-
  https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fnkllh2erofg5kq08efei.jpg
originalUrl: >-
  https://dev.to/josemukorivo/how-react-checks-if-2-values-are-the-same-value-3g4a
---

> React constantly needs to answer a deceptively small question: did this value change?

That decision appears in state updates, Hook dependency arrays, memoized components, reducers, and several internal optimization paths. The answer cannot simply be “use `==`” or “use `===`,” because JavaScript has multiple equality algorithms with slightly different semantics.

The implementation React uses is only a few lines long. Understanding those lines, however, explains a large part of React’s behaviour around references, memoization, and immutable state.

## JavaScript has more than one kind of equality

The three comparisons developers encounter most often are:

- Loose equality with `==`.
- Strict equality with `===`.
- Same-value equality with `Object.is`.

Loose equality can coerce values before comparing them:

```js
0 == false; // true
"" == false; // true
"42" == 42; // true
```

That coercion makes `==` unsuitable for React’s internal change detection. A framework should not decide that two values are equivalent because JavaScript converted one of them into another type.

Strict equality avoids coercion:

```js
0 === false; // false
"42" === 42; // false
42 === 42; // true
```

For most values, `===` gives the result we expect. There are two important exceptions:

```js
NaN === NaN; // false
+0 === -0; // true
```

Those results are valid according to JavaScript’s strict-equality algorithm, but they are not always the most useful definition of whether a value stayed the same.

## `Object.is` and same-value equality

`Object.is` implements JavaScript’s same-value comparison. It behaves like strict equality for ordinary values while treating `NaN` and signed zero differently:

```js
Object.is(25, 25); // true
Object.is("hello", "hello"); // true
Object.is(null, null); // true
Object.is(NaN, NaN); // true
Object.is(+0, -0); // false
```

Objects, arrays, and functions are compared by identity rather than by their contents:

```js
Object.is({}, {}); // false
Object.is([], []); // false

const project = { name: "FortyOne" };
Object.is(project, project); // true
```

The two empty object literals may look identical, but they occupy different locations in memory. The `project` variable, on the other hand, points to the same object on both sides of the comparison.

_This distinction between value equality and reference identity is fundamental to React._

## React’s `Object.is` helper

React’s current source contains a small helper that uses the native `Object.is` implementation when it is available and falls back to an inline equivalent.

The fallback is:

```js
function is(x, y) {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}
```

The exported helper chooses between the browser implementation and the fallback:

```js
const objectIs = typeof Object.is === "function" ? Object.is : is;
```

Let us take the fallback apart.

## The ordinary equality branch

The first branch begins with `x === y`:

```js
x === y && (x !== 0 || 1 / x === 1 / y);
```

For values such as `2` and `2`, `"hello"` and `"hello"`, or the same object reference, `x === y` is true.

If the value is not zero, `x !== 0` is also true and the comparison can return immediately.

```js
const x = 2;
const y = 2;

x === y; // true
x !== 0; // true
```

Zero needs an additional check because strict equality considers positive and negative zero equal.

## How the helper distinguishes signed zero

JavaScript preserves the sign of zero in division:

```js
1 / +0; // Infinity
1 / -0; // -Infinity
```

React uses that behaviour to distinguish the two values:

```js
1 / +0 === 1 / -0; // false
1 / -0 === 1 / -0; // true
```

Therefore:

```js
is(+0, -0); // false
is(-0, -0); // true
```

Signed zero rarely appears in everyday interface code, but preserving the exact same-value semantics keeps React consistent with `Object.is`.

## How the helper detects `NaN`

The second branch is:

```js
x !== x && y !== y;
```

`NaN` is the only JavaScript value that is not equal to itself:

```js
NaN !== NaN; // true
42 !== 42; // false
"text" !== "text"; // false
```

If both values are unequal to themselves, both must be `NaN`, so the helper returns true:

```js
is(NaN, Number.NaN); // true
is(NaN, 0 / 0); // true
```

The complete helper therefore covers three cases:

1. Ordinary values that are strictly equal.
2. Zeros that must also have the same sign.
3. Two values that are both `NaN`.

## Where React uses same-value comparison

It is inaccurate to say that one equality function alone decides whether React renders. Rendering can be caused by state, context, parent work, subscriptions, external stores, and other scheduler decisions.

What is accurate is that same-value comparison is an important primitive in several React paths.

### State update bailouts

When a state update produces a value that is the same as the current state, React can avoid scheduling unnecessary work in some paths.

```jsx
const [count, setCount] = useState(0);

setCount(0);
```

The new state and current state are same-value equal. React may still call the component function in some situations before bailing out, so this should be understood as an optimization rather than a behavioural guarantee.

For object state, identity matters:

```jsx
const [settings, setSettings] = useState({ theme: "light" });

setSettings(settings);
```

The reference did not change. React has no new state identity to observe.

### Hook dependency arrays

React compares each dependency in Hooks such as `useEffect`, `useMemo`, and `useCallback` with its previous value using same-value semantics.

```jsx
useEffect(() => {
  connectToProject(projectId);
}, [projectId]);
```

If `projectId` remains the same according to `Object.is`, the dependency is unchanged.

Objects and functions are different:

```jsx
const options = { roomId };

useEffect(() => {
  connect(options);
}, [options]);
```

A new `options` object is created on every render. Even when `roomId` is unchanged, `Object.is(previousOptions, options)` is false because the references differ.

The better solution is often to move object creation inside the Effect or depend on the primitive values directly:

```jsx
useEffect(() => {
  const options = { roomId };
  connect(options);
}, [roomId]);
```

### Memoized component props

By default, `React.memo` compares every prop with its previous value using `Object.is`.

```jsx
const Profile = memo(function Profile({ name, age }) {
  return (
    <p>
      {name}, {age}
    </p>
  );
});
```

If `name` and `age` remain the same, React can usually skip rendering `Profile` when its parent renders.

Memoization is not a guarantee. React may render a memoized component for its own reasons, and context or local state changes still affect it. _`memo` is a performance optimization, not a semantic boundary._

## How shallow comparison works

React also contains a `shallowEqual` helper. It first checks whether the two inputs are the same value. If they are, no further work is required.

It then verifies that both inputs are non-null objects, compares their key counts, and checks every top-level property with the same `Object.is` helper.

A simplified version looks like this:

```js
function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (!isObject(a) || !isObject(b)) return false;

  const keysA = Object.keys(a);
  if (keysA.length !== Object.keys(b).length) return false;

  return keysA.every((key) => hasOwn(b, key) && Object.is(a[key], b[key]));
}
```

The comparison is _shallow_ because it only examines the first level.

```js
const previous = {
  name: "Joseph",
  profile: { city: "Harare" },
};

const next = {
  name: "Joseph",
  profile: previous.profile,
};
```

`previous` and `next` are different objects, but their top-level values are equal: the strings match and both `profile` properties point to the same nested object.

A deep comparison would continue into `profile`. A shallow comparison does not.

## Why mutation hides changes

Consider this update:

```js
const previous = {
  profile: { name: "Jose" },
};

const next = previous;
next.profile.name = "Joseph";
```

Both variables still reference exactly the same top-level object:

```js
Object.is(previous, next); // true
```

The nested value changed, but <u>the identity React can cheaply compare did not</u>.

An immutable update creates new references along the changed path:

```js
const next = {
  ...previous,
  profile: {
    ...previous.profile,
    name: "Joseph",
  },
};
```

Now the signals are clear:

```js
Object.is(previous, next); // false
Object.is(previous.profile, next.profile); // false
```

> Unchanged branches can keep their existing references, while changed branches receive new ones. This is structural sharing, and it allows shallow comparisons to remain fast without losing useful change information.

## Objects, arrays, and functions as props

Inline values can defeat memoization because they create a new reference on every render:

```jsx
<Profile options={{ compact: true }} />
```

The object is new each time, so a memoized `Profile` sees a changed prop.

_The first question should not be “Where can I add `useMemo`?”_ It should be whether the component needs that object-shaped prop at all:

```jsx
<Profile compact />
```

Smaller primitive props are easier to compare and often produce a clearer component API.

Functions have the same identity behaviour:

```jsx
<Button onClick={() => save(projectId)} />
```

That function is recreated on each render. `useCallback` can preserve its identity when that is genuinely useful, but indiscriminate memoization adds complexity and can cost more than the render it tries to avoid.

## Custom comparison functions

`React.memo` accepts a custom comparator:

```jsx
const Chart = memo(ChartView, (previous, next) => {
  return previous.points.every(
    (point, index) =>
      point.x === next.points[index]?.x && point.y === next.points[index]?.y,
  );
});
```

_This should be used carefully._

The comparator must include every prop, including functions. If it incorrectly declares two prop sets equal, the component can keep stale closures and display outdated information.

A deep comparison can also be slower than simply rendering the component. Measure the production build before adding a custom comparator.

## The practical mental model

React does not continuously inspect the entire contents of every object. That would be prohibitively expensive and unpredictable.

Instead, it relies heavily on:

- Same-value comparison for primitive values and references.
- Shallow comparison for selected object-shaped contracts.
- New references to signal changed object branches.
- Memoization only where skipping work is measurably useful.

> The small `Object.is` helper is therefore more than an implementation curiosity. It explains why `NaN` can remain stable, why signed zero is distinct, why inline objects change on every render, and why immutable updates make React applications easier to reason about.

Once references are treated as part of the state contract, many apparently mysterious React renders become ordinary JavaScript equality decisions.

## Further reading

- [React’s current `objectIs` source](https://github.com/facebook/react/blob/main/packages/shared/objectIs.js)
- [React’s current `shallowEqual` source](https://github.com/facebook/react/blob/main/packages/shared/shallowEqual.js)
- [`memo` in the React documentation](https://react.dev/reference/react/memo)
- [`Object.is` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
