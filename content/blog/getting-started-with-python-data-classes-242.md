---
canonical_url: "https://josemukorivo.com/blog/getting-started-with-python-data-classes-242"
id: 1268350
title: Getting Started with Python Data Classes
description: >-
  A detailed guide to generated methods, fields, defaults, validation,
  immutability, hashing, slots, inheritance, and value-object design.
publishedAt: "2022-11-28T08:47:41Z"
updatedAt: "2026-07-17T19:00:22Z"
tags:
  - python
socialImage: >-
  https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fag81bnknd9puhql5cioj.jpg
originalUrl: "https://dev.to/josemukorivo/getting-started-with-python-data-classes-242"
---

Python’s `@dataclass` decorator is useful when a class primarily represents structured data. It generates common methods from type-annotated fields, allowing the class to communicate its model without repeating mechanical code.

The feature was added in Python 3.7 through PEP 557. It does not replace ordinary classes and it does not turn Python into a statically typed language. <u>A data class is still a normal Python class.</u> The decorator inspects its annotated fields and adds methods according to the options you select.

To understand why this helps, it is useful to begin with the code we would otherwise write.

## The boilerplate behind a small value

Consider a class that stores a programmer’s name and age:

```python
class Programmer:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def __repr__(self) -> str:
        return (
            f"Programmer(name={self.name!r}, age={self.age!r})"
        )
```

If instances should compare by their values, we also need `__eq__`:

```python
def __eq__(self, other: object) -> bool:
    if other.__class__ is not self.__class__:
        return NotImplemented
    return (self.name, self.age) == (other.name, other.age)
```

None of this code is difficult, but it is mechanical. More importantly, it can become inconsistent as the model changes. Adding another field means updating construction, representation, and equality in several places.

A conventional class often needs an initializer, representation, and equality implementation. A data class can provide all three:

```python
from dataclasses import dataclass

@dataclass
class Programmer:
    name: str
    age: int
```

You can now construct and inspect the value directly:

```python
programmer = Programmer(name="Amina", age=29)

print(programmer)
# Programmer(name='Amina', age=29)
```

The decorator generates an `__init__` method, a readable `__repr__`, and field-based `__eq__` behaviour. The field declaration order determines the generated initializer and representation.

## What the decorator actually does

The decorator returns a class after adding selected special methods. It does not create a wrapper around the class, and it does not replace method dispatch or attribute access.

A special method—often called a _dunder_ method because its name begins and ends with double underscores—allows an object to participate in Python language operations.

Examples include:

- `__init__` for initialization.
- `__repr__` for the developer-facing representation.
- `__eq__` for `==`.
- `__lt__` for `<`.
- `__hash__` for hash-based collections.

A simple operator-overloading example makes the idea concrete:

```python
class Vector:
    def __init__(self, x: int, y: int) -> None:
        self.x = x
        self.y = y

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)
```

Defining `__add__` allows `first + second` to produce another `Vector`. Data classes focus on a smaller set of methods that are commonly required by data-focused classes.

By default, `@dataclass` generates:

- `__init__` for assigning fields.
- `__repr__` for a useful developer representation.
- `__eq__` for comparing instances by field value.

The generated equality method compares instances as if their fields formed an ordered tuple. Both instances must have the identical class; a data class does not normally compare equal to an unrelated tuple or a different subclass with the same field values.

```python
@dataclass
class Point:
    x: int
    y: int

Point(1, 2) == Point(1, 2)  # True
Point(1, 2) == (1, 2)       # False
```

Ordering methods are optional:

```python
@dataclass(order=True)
class Release:
    major: int
    minor: int
    patch: int
```

This generates comparisons such as `<`, `<=`, `>`, and `>=` using field order. _Set `order=True` only when tuple-like ordering represents the domain correctly._ Ordering people by `(name, age)` merely because those happen to be their fields would be a misleading contract.

The main decorator options include:

```python
@dataclass(
    init=True,
    repr=True,
    eq=True,
    order=False,
    frozen=False,
    slots=False,
    kw_only=False,
)
class Example:
    value: str
```

Other options affect hashing, pattern matching, and weak references. They should be selected because the model requires them, not because enabling more generated behaviour appears convenient.

## Defaults and default factories

Scalar defaults can be declared directly:

```python
@dataclass
class Account:
    name: str
    active: bool = True
```

Mutable defaults require more care. A list created at class definition time would be shared between instances, so use `default_factory`:

```python
from dataclasses import dataclass, field

@dataclass
class Team:
    name: str
    members: list[str] = field(default_factory=list)
```

Every `Team` now receives its own list.

`field` can also control whether a value appears in `repr`, participates in comparisons, or is accepted by the generated initializer. This is useful for internal metadata, cached values, or secrets that should not appear in logs.

```python
@dataclass
class ApiCredential:
    name: str
    token: str = field(repr=False, compare=False)
```

The token remains part of the instance, but the generated representation does not expose it and equality does not depend on it.

Fields without defaults must appear before fields with defaults:

```python
@dataclass
class Invalid:
    enabled: bool = True
    name: str
```

That class raises a `TypeError` because the generated initializer would otherwise place a required positional parameter after an optional one. The same rule can appear across inheritance, so field order matters when extending data classes.

## Keyword-only fields

For public models with several values of the same type, positional construction can be difficult to read:

```python
Report("Quarterly review", True, False)
```

`kw_only=True` makes every generated initializer parameter keyword-only:

```python
@dataclass(kw_only=True)
class Report:
    title: str
    published: bool = False
    archived: bool = False

report = Report(
    title="Quarterly review",
    published=True,
)
```

This often produces safer call sites for configuration, request models, and business records. Python also provides the `KW_ONLY` sentinel when only the fields after a specific point should be keyword-only.

## Derived values and validation

Use `__post_init__` when initialization requires validation or a derived field:

```python
@dataclass
class InvoiceLine:
    unit_price: float
    quantity: int
    total: float = field(init=False)

    def __post_init__(self) -> None:
        if self.quantity < 1:
            raise ValueError("quantity must be positive")
        self.total = self.unit_price * self.quantity
```

The generated `__init__` assigns the input fields first, then calls `__post_init__`.

This is appropriate for small invariants. If construction requires several external dependencies, database access, or a complicated lifecycle, a factory function or explicit class is usually clearer.

`InitVar` is useful when initialization needs an input that should not become a stored field:

```python
from dataclasses import InitVar

@dataclass
class User:
    email: str
    raw_password: InitVar[str]
    password_hash: str = field(init=False)

    def __post_init__(self, raw_password: str) -> None:
        self.password_hash = hash_password(raw_password)
```

`raw_password` is passed to `__post_init__`, but it is not returned by `fields()` and is not retained as an ordinary instance field.

This can reduce accidental retention of initialization-only data. For security-sensitive systems, the hashing operation and secret lifecycle still require careful design; _a decorator does not provide security by itself._

## Immutable value objects

`frozen=True` prevents normal field assignment after initialization:

```python
@dataclass(frozen=True)
class Coordinate:
    latitude: float
    longitude: float
```

Frozen data classes work well for value objects such as coordinates, money, identifiers, or configuration snapshots. They can also be hashable when their fields are hashable, making them suitable for dictionary keys or set members.

Immutability here is enforced through generated attribute handling; it is not a deep freeze. A frozen data class can still contain a mutable list, so choose field types that match the intended contract.

```python
@dataclass(frozen=True)
class Team:
    members: list[str]

team = Team(members=["Amina"])
team.members.append("Tariro")  # Still allowed
```

The `members` attribute cannot be replaced normally, but the list it references remains mutable. A tuple would communicate a stronger immutable contract:

```python
@dataclass(frozen=True)
class Team:
    members: tuple[str, ...]
```

Inside `__post_init__`, a frozen data class can set derived fields with `object.__setattr__`:

```python
@dataclass(frozen=True)
class EmailAddress:
    value: str
    domain: str = field(init=False)

    def __post_init__(self) -> None:
        domain = self.value.rsplit("@", 1)[-1]
        object.__setattr__(self, "domain", domain)
```

Use this deliberately. Frozen classes are easiest to understand when all state is established during construction and remains stable afterwards.

## Equality and hashing

Hashing determines whether an object can be used as a dictionary key or stored in a set.

The default relationship between `eq`, `frozen`, and `__hash__` is intentionally conservative:

- `eq=True` and `frozen=True` normally generate a hash.
- `eq=True` and `frozen=False` normally make the class unhashable.
- `eq=False` leaves the superclass hashing behaviour unchanged.

> A mutable value should not usually be hashable because changing a field after insertion can make the object impossible to find in the hash table.

```python
@dataclass(frozen=True)
class Coordinate:
    latitude: float
    longitude: float

locations = {Coordinate(-17.8, 31.0): "Harare"}
```

`unsafe_hash=True` forces generation in specialised cases, but the name is a warning. Only use it when the object is logically immutable and you understand which fields participate in equality and hashing.

## Using slots

On supported Python versions, `slots=True` generates slots for the declared fields:

```python
@dataclass(slots=True)
class Measurement:
    name: str
    value: float
```

Slots can reduce per-instance memory usage and prevent arbitrary new attributes. The benefit matters most when an application creates many instances. For a small number of objects, clarity is usually more important than the memory difference.

`frozen=True` and `slots=True` can be combined when a compact immutable value object is appropriate:

```python
@dataclass(frozen=True, slots=True)
class UserId:
    value: str
```

With `slots=True`, the decorator creates and returns a new class with generated slots. This has a few edge cases around inheritance and `super`, so it should not be enabled as a reflex.

Measure before adopting it as a global convention. The largest benefits appear in systems that create many small instances or intentionally need to prevent arbitrary attribute creation.

## Class variables

Not every annotation describes an instance field. `ClassVar` tells the data-class machinery to ignore a class-level value:

```python
from typing import ClassVar

@dataclass
class HttpClient:
    base_url: str
    default_timeout: ClassVar[int] = 30
```

`default_timeout` remains a normal class variable shared by all instances and stays outside the generated initializer, representation, and equality comparison.

This is clearer than relying on an unannotated value and communicates the intent to type checkers.

## Converting and replacing values

The `dataclasses` module includes utilities for working with instances. `asdict` recursively converts a data class to dictionaries, while `replace` creates a new instance with selected fields changed:

```python
from dataclasses import asdict, replace

updated = replace(programmer, age=30)
payload = asdict(updated)
```

Be careful with `asdict` on large nested object graphs because the recursive conversion performs deep copies. For API serialization, an explicit schema often gives better control over names, formats, and private fields.

`replace` calls the generated initializer and therefore runs `__post_init__` again:

```python
original = InvoiceLine(unit_price=12.5, quantity=2)
updated = replace(original, quantity=4)

assert updated.total == 50.0
```

That behaviour is useful for immutable value objects because it creates a new validated instance rather than mutating the original.

The module also exposes `fields`, `is_dataclass`, `astuple`, and `make_dataclass`. Dynamic class creation is available, but ordinary declarative class definitions are usually easier to read and type check.

## Inheritance

Data-class inheritance combines fields from data-class base classes using the method resolution order.

```python
@dataclass
class Entity:
    id: str
    created_at: datetime

@dataclass
class Project(Entity):
    name: str
```

The generated `Project.__init__` includes the base fields before `name`.

Inheritance becomes harder when base classes contain defaults, subclasses introduce required fields, or a non-data-class base needs its own initializer. The generated child initializer does not automatically call an ordinary base class’s `__init__`.

_When inheritance begins to require workarounds, composition or a factory may produce a clearer model._

## Pattern matching

Modern Python can use data classes in structural pattern matching. By default, the decorator creates `__match_args__` from non-keyword-only initializer fields:

```python
@dataclass
class Success:
    value: str

@dataclass
class Failure:
    message: str

match result:
    case Success(value):
        print(value)
    case Failure(message):
        log_error(message)
```

This works well for small result types and syntax trees. For a large business model, pattern matching should still respect module boundaries rather than spreading knowledge of every field throughout the application.

## When to use a data class

A data class is a strong choice when:

- The type mainly stores related values.
- Equality should be based on those values.
- Construction is simple and explicit.
- A readable representation is useful.
- Immutability or slots match the model.

An explicit class may be better when:

- The object has a complex lifecycle.
- Behaviour matters more than its fields.
- Valid construction requires a factory or external dependencies.
- Equality is based on identity rather than field values.
- Attribute access needs substantial custom logic.

> Data classes reduce boilerplate, but their real value is communication. A well-designed data class tells the reader that the type is a structured value with a small, predictable contract.

Generated methods can always be disabled or overridden when the defaults do not represent the domain correctly.

_The useful question is whether field-based construction, representation, and equality accurately describe what the object means._ The fact that a class can be written as a data class tells us very little on its own.

For coordinates, identifiers, configuration records, events, commands, and other value-oriented types, the answer is often yes. For stateful services, database sessions, controllers, or objects with a complicated lifecycle, an explicit class usually communicates more.

Used with that distinction in mind, data classes provide a concise model without hiding the Python object system underneath it.

## Further reading

- [Python’s `dataclasses` documentation](https://docs.python.org/3/library/dataclasses.html)
- [PEP 557: Data Classes](https://peps.python.org/pep-0557/)
- [Python’s data model](https://docs.python.org/3/reference/datamodel.html)
