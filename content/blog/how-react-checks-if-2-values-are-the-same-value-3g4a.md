---
canonical_url: >-
  https://josemukorivo.com/blog/how-react-checks-if-2-values-are-the-same-value-3g4a
id: 987588
title: How React checks if 2 values are the same value
description: >-
  Reading React's small Object.is helper explains signed zero, NaN, shallow
  comparison, and why object references matter.
publishedAt: "2022-02-14T05:47:53Z"
updatedAt: "2026-07-18T17:47:50Z"
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

React often needs to know whether a value changed. That question appears in state updates, Hook dependency arrays, and memoized props.

JavaScript already has `Object.is`, but React also ships a tiny fallback for environments that do not provide it. Reading that function is a good way to understand why references matter so much in React.

## JavaScript equality is not one thing

Loose equality converts values before comparing them:

```js
0 == false; // true
"42" == 42; // true
```

Strict equality avoids that conversion, but it has two results worth knowing:

```js
NaN === NaN; // false
+0 === -0; // true
```

`Object.is` uses the same-value algorithm. For ordinary values it behaves much like `===`, while handling those two cases differently:

```js
Object.is(NaN, NaN); // true
Object.is(+0, -0); // false
Object.is(42, 42); // true
```

Objects and functions still compare by identity:

```js
Object.is({}, {}); // false

const project = { name: "FortyOne" };
Object.is(project, project); // true
```

Two object literals can contain the same data and still be different values because they are different objects.

## React's helper

The current React source uses native `Object.is` when it exists and falls back to this function:

```js
function is(x, y) {
  return (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y);
}

const objectIs = typeof Object.is === "function" ? Object.is : is;
```

The compressed expression looks strange, but it handles two small edge cases.

### Signed zero

When `x === y`, the function would normally return `true`. Zero gets one extra check because JavaScript keeps its sign during division:

```js
1 / +0; // Infinity
1 / -0; // -Infinity
```

That makes `1 / x === 1 / y` false when one value is positive zero and the other is negative zero.

### NaN

`NaN` is the only JavaScript value that is not equal to itself:

```js
NaN !== NaN; // true
42 !== 42; // false
```

So if both `x !== x` and `y !== y` are true, both values are `NaN` and the helper treats them as the same value.

## Where this shows up in React

React compares Hook dependencies with `Object.is`. A primitive dependency that stays the same does not cause an Effect to run again:

```jsx
useEffect(() => {
  connectToProject(projectId);
}, [projectId]);
```

An object created during rendering is different every time:

```jsx
const options = { projectId };

useEffect(() => {
  connect(options);
}, [options]);
```

Even when `projectId` is unchanged, `options` has a new identity. In this case I would create the object inside the Effect and depend on `projectId` directly.

`React.memo` also compares each prop with `Object.is` by default. This is why an inline object or function can make a memoized child render again. It does not mean every value needs `useMemo` or `useCallback`; the extra memoization may cost more than the render. Measure first.

## Shallow comparison and mutation

React's `shallowEqual` helper starts with the same-value check. If the two inputs are different objects, it compares their keys and then uses `Object.is` for each top-level value.

It does not walk nested objects. That is why mutation can hide a change:

```js
const previous = {
  profile: { name: "Jose" },
};

const next = previous;
next.profile.name = "Joseph";

Object.is(previous, next); // true
```

The data changed, but the reference React can compare did not.

An immutable update creates new references along the changed path:

```js
const next = {
  ...previous,
  profile: {
    ...previous.profile,
    name: "Joseph",
  },
};

Object.is(previous, next); // false
```

Unchanged branches can keep their references. Changed branches receive new ones. This gives React a cheap signal without requiring a deep comparison of the whole object.

The practical model is simple: primitives compare by value, objects compare by identity, and React uses those comparisons as one input to its rendering decisions. Once I keep reference identity in mind, many surprising Effect runs and missed updates stop being surprising.

## Further reading

- [React's `objectIs` source](https://github.com/facebook/react/blob/main/packages/shared/objectIs.js)
- [React's `shallowEqual` source](https://github.com/facebook/react/blob/main/packages/shared/shallowEqual.js)
- [`Object.is` on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
