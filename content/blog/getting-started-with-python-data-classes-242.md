---
canonical_url: "https://josemukorivo.com/blog/getting-started-with-python-data-classes-242"
id: 1268350
title: Getting Started with Python Data Classes
description: >-
  A short introduction to generated methods, defaults, validation, and frozen
  value objects with Python's dataclasses module.
publishedAt: "2022-11-28T08:47:41Z"
updatedAt: "2026-07-18T17:47:50Z"
tags:
  - python
socialImage: >-
  https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fag81bnknd9puhql5cioj.jpg
originalUrl: "https://dev.to/josemukorivo/getting-started-with-python-data-classes-242"
---

If you have seen `@dataclass` in Python code and wondered what it does, the short answer is that it writes some boring class methods for you.

Suppose we need a small type for a programmer:

```python
class Programmer:
    def __init__(self, name: str, age: int) -> None:
        self.name = name
        self.age = age

    def __repr__(self) -> str:
        return f"Programmer(name={self.name!r}, age={self.age!r})"
```

If two programmers with the same data should compare as equal, we also need `__eq__`. None of this is hard, but it is easy to forget one method when a field changes.

A data class gives us the same basic model with less code:

```python
from dataclasses import dataclass

@dataclass
class Programmer:
    name: str
    age: int
```

```python
amina = Programmer(name="Amina", age=29)

print(amina)
# Programmer(name='Amina', age=29)

amina == Programmer(name="Amina", age=29)
# True
```

The decorator reads the annotated fields and generates `__init__`, `__repr__`, and `__eq__` by default. The result is still a normal Python class. You can add methods, properties, and custom behaviour as usual.

## Fields and defaults

The order of the fields becomes the order of the generated constructor arguments:

```python
@dataclass
class Account:
    name: str
    active: bool = True
```

Fields without defaults must come first, just like required parameters in a function.

Mutable defaults need special care. This is the common example:

```python
from dataclasses import dataclass, field

@dataclass
class Team:
    name: str
    members: list[str] = field(default_factory=list)
```

`default_factory` runs for each new `Team`, so every instance gets its own list. Using one list as a class-level default would make instances share it.

`field` also lets you control generated behaviour. A secret, for example, probably should not appear in logs:

```python
@dataclass
class ApiCredential:
    name: str
    token: str = field(repr=False, compare=False)
```

The token is stored on the object, but it is left out of `repr` and equality.

## Validation and derived values

The generated constructor calls `__post_init__` after assigning the fields. This is a good place for a small invariant or a derived value:

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

`total` is excluded from `__init__`, then calculated after the input fields are available.

I keep `__post_init__` small. If creating the object needs database access, several services, or a complicated sequence of steps, a factory function or an explicit class is usually easier to understand.

## Frozen values

For a value that should stay unchanged after construction, use `frozen=True`:

```python
@dataclass(frozen=True)
class Coordinate:
    latitude: float
    longitude: float
```

Trying to assign a new latitude now raises an error. A frozen data class can also receive a generated hash when its fields are hashable, which makes small value objects useful as dictionary keys.

Frozen does not mean deeply immutable:

```python
@dataclass(frozen=True)
class Team:
    members: list[str]
```

The `members` attribute cannot be replaced, but the list can still be changed. Use an immutable field type such as `tuple[str, ...]` if that is the contract you want.

## When I use a data class

Data classes work well for coordinates, configuration records, events, commands, and other types whose identity comes from their fields. They make construction and equality obvious without hiding the object model.

I usually choose an explicit class when the object has a complicated lifecycle, depends on external services, or is defined mainly by its behaviour. Generated field equality can be misleading for entities whose identity comes from an ID or database record.

That is the useful test: do field-based construction, representation, and equality describe what this object means? If they do, `@dataclass` removes code I would otherwise have to keep in sync by hand.

## Further reading

- [Python's `dataclasses` documentation](https://docs.python.org/3/library/dataclasses.html)
- [PEP 557: Data Classes](https://peps.python.org/pep-0557/)
