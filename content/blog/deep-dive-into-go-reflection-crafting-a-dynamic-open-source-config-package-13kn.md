---
id: 1740898
title: "Deep Dive into Go Reflection: Crafting a Dynamic Open Source Config Package"
description: >-
  Build a production-oriented environment configuration parser in Go while
  exploring values, types, struct tags, custom setters, recursion, and errors.
publishedAt: "2024-01-26T09:40:20Z"
updatedAt: "2026-07-16T00:00:00Z"
tags:
  - backend
  - opensource
  - go
  - programming
socialImage: >-
  https://media2.dev.to/dynamic/image/width=1000,height=500,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fciwowu117gmg59npgc73.jpg
originalUrl: >-
  https://dev.to/josemukorivo/deep-dive-into-go-reflection-crafting-a-dynamic-open-source-config-package-13kn
---

> Configuration is one of those concerns that begins with three environment variables and quietly grows into dozens of repeated parsing operations.

Every application needs to read strings from the environment, convert them into the expected types, apply defaults, report missing values, and make the result available through a typed structure. Writing those steps by hand is explicit, but it also creates repetitive code that is easy to implement inconsistently.

I built a small Go configuration package around a simple contract:

```go
type Config struct {
	Host    string        `required:"true"`
	Port    int           `default:"8080"`
	Timeout time.Duration `default:"5s"`
	Debug   bool          `default:"false"`
}
```

The application passes a pointer to that structure:

```go
var cfg Config

if err := config.Parse("app", &cfg); err != nil {
	log.Fatal(err)
}
```

The package maps the fields to `APP_HOST`, `APP_PORT`, `APP_TIMEOUT`, and `APP_DEBUG`, then performs the required conversions.

_This is an appropriate use of reflection because the exact structure is supplied by the caller at runtime._ The important engineering decision is to keep reflection behind a small API and make every failure predictable.

## What reflection gives us

Go is statically typed, but an interface value can hold a value of any concrete type. Reflection allows a program to inspect that dynamic type and value while it is running.

The two entry points are:

```go
value := reflect.ValueOf(input)
valueType := reflect.TypeOf(input)
```

`reflect.Type` describes a type: its name, package path, methods, fields, and underlying kind.

`reflect.Value` represents an actual runtime value. It can be inspected and, when the value is addressable and settable, modified.

The distinction is easiest to see with an interface:

```go
var input any = 42

fmt.Println(reflect.TypeOf(input))        // int
fmt.Println(reflect.ValueOf(input).Int()) // 42
```

Reflection is related to type assertions but solves a different problem. A type assertion asks whether an interface contains one specific type:

```go
number, ok := input.(int)
```

Reflection is useful when the concrete type is not known in advance and the code needs to inspect it dynamically.

## `Type`, `Kind`, and named types

<u>`Type` and `Kind` are not interchangeable.</u>

`Type` preserves the complete declared type. `Kind` describes its underlying category:

```go
type Port int

var value Port = 8080
typ := reflect.TypeOf(value)

fmt.Println(typ.Name()) // Port
fmt.Println(typ.Kind()) // int
```

This matters for `time.Duration`. Its kind is `reflect.Int64`, but treating it as an ordinary integer would reject values such as `5s` or `250ms`.

The parser checks both its kind and declared type:

```go
if field.Kind() == reflect.Int64 &&
	field.Type().PkgPath() == "time" &&
	field.Type().Name() == "Duration" {
	duration, err := time.ParseDuration(raw)
	// ...
}
```

The underlying kind determines which setter is available, while the declared type can require specialised parsing.

## Why the destination must be a pointer

Reflection can inspect most values, but it cannot modify an unaddressable copy.

This call cannot work:

```go
var cfg Config
config.Parse("app", cfg)
```

`cfg` is passed by value. The parser receives a copy and cannot populate the caller’s variable.

The package therefore requires a pointer to a struct:

```go
config.Parse("app", &cfg)
```

The validation path should reject:

- Non-pointer values.
- Nil pointers.
- Pointers to scalar values.
- Maps, slices, and other unsupported destinations.

A defensive helper can make the contract explicit:

```go
func destination(input any) (reflect.Value, error) {
	value := reflect.ValueOf(input)
	if !value.IsValid() ||
		value.Kind() != reflect.Pointer ||
		value.IsNil() {
		return reflect.Value{}, ErrInvalidConfig
	}

	value = value.Elem()
	if value.Kind() != reflect.Struct {
		return reflect.Value{}, ErrInvalidConfig
	}
	return value, nil
}
```

`Elem` dereferences the pointer. Once the result is an addressable struct value, its exported fields can be set.

## Extracting fields and metadata

The parser walks the structure with a `reflect.Value` and its corresponding `reflect.Type`:

```go
value := reflect.ValueOf(cfg).Elem()
typ := value.Type()

for index := 0; index < value.NumField(); index++ {
	fieldValue := value.Field(index)
	fieldType := typ.Field(index)
	// Build the configuration field metadata.
}
```

`value.Field(index)` gives access to the runtime field value.

`typ.Field(index)` returns a `reflect.StructField`, which includes the field name, declared type, package information, and struct tags.

The package converts that information into a smaller internal model:

```go
type Field struct {
	Name     string
	Field    reflect.Value
	Key      string
	EnvKey   string
	Required bool
	Default  string
}
```

This is a useful boundary. The rest of the parser operates on `Field` values instead of repeatedly reaching into the reflection API.

## Settable and exported fields

Before assigning a reflected value, the code checks `CanSet`:

```go
if !fieldValue.CanSet() {
	continue
}
```

An exported field on an addressable struct is normally settable. An unexported field is not.

```go
type Config struct {
	Host     string
	password string
}
```

The package can populate `Host`, but it should not attempt to bypass Go’s visibility rules to set `password`.

_Reflection offers powerful low-level operations, but a configuration library should respect ordinary language boundaries rather than using unsafe techniques to defeat them._

## Deriving environment variable names

By default, a field name is uppercased and prefixed:

```go
type Config struct {
	Host string
}
```

With the prefix `app`, the key becomes `APP_HOST`.

An `env` tag can provide an explicit name:

```go
type Config struct {
	User string `env:"config_user"`
}
```

The package can look for the exact override and the prefixed form, depending on the intended convention.

The key-building logic is straightforward:

```go
key := fieldType.Name
if envName := fieldType.Tag.Get("env"); envName != "" {
	key = envName
}
if prefix != "" {
	key = prefix + "_" + key
}
key = strings.ToUpper(key)
```

Centralising this rule prevents every application from developing a slightly different environment naming scheme.

## Defaults and required values

Environment variables are strings, but their absence is different from an empty string.

`os.LookupEnv` returns both the value and whether the key existed:

```go
raw, found := os.LookupEnv(field.Key)
```

That distinction allows the parser to apply a default only when the variable is missing:

```go
if !found && field.Default != "" {
	raw = field.Default
	found = true
}
```

Required values should fail before conversion:

```go
if !found && field.Required {
	return fmt.Errorf(
		"config: required key %s missing value",
		field.Key,
	)
}
```

There is a subtle design question around empty defaults. A tag such as `default:""` cannot be distinguished from an absent tag by calling `Tag.Get`. A package that needs empty-string defaults should use `StructTag.Lookup`, which returns a second boolean indicating whether the tag exists.

_That is the kind of edge case that matters in reflective libraries: metadata has both a value and a presence state._

## Parsing values by kind

After resolving the raw string, the parser selects a conversion based on the field kind.

Strings are direct:

```go
case reflect.String:
	field.SetString(raw)
```

Booleans use `strconv.ParseBool`:

```go
case reflect.Bool:
	value, err := strconv.ParseBool(raw)
	if err != nil {
		return err
	}
	field.SetBool(value)
```

Integers need the field’s bit width:

```go
case reflect.Int, reflect.Int8, reflect.Int16,
	reflect.Int32, reflect.Int64:
	value, err := strconv.ParseInt(
		raw,
		0,
		field.Type().Bits(),
	)
```

Using `Bits` means an `int8` field receives the correct overflow checks rather than being parsed as an unrestricted `int64`.

Floats follow the same principle:

```go
case reflect.Float32, reflect.Float64:
	value, err := strconv.ParseFloat(
		raw,
		field.Type().Bits(),
	)
```

Once conversion succeeds, reflection provides kind-specific setters such as `SetInt`, `SetBool`, and `SetFloat`.

## Supporting maps with JSON

The current package supports maps with string keys by treating the environment value as JSON:

```bash
APP_LABELS={"environment":"production","region":"af-south-1"}
```

The corresponding field is:

```go
type Config struct {
	Labels map[string]string
}
```

Because the complete map type is only known at runtime, the parser creates a new value of that type and asks `encoding/json` to populate it:

```go
mapPointer := reflect.New(field.Type())
if err := json.Unmarshal(
	[]byte(raw),
	mapPointer.Interface(),
); err != nil {
	return err
}
field.Set(mapPointer.Elem())
```

`reflect.New` returns a pointer to a new zero value. Calling `Interface` exposes that pointer to `json.Unmarshal`, and `Elem` retrieves the populated map afterwards.

Shells and dotenv files sometimes wrap JSON in quotes, so the implementation also normalises single- or double-quoted values before decoding them.

## Nested structures and recursive prefixes

Nested structs make related configuration easier to read:

```go
type Config struct {
	Web struct {
		Host string
	}
	DB struct {
		Host string
		Port int
	}
}
```

With an `APP` prefix, the expected keys become:

```text
APP_WEB_HOST
APP_DB_HOST
APP_DB_PORT
```

The parser can recurse when it encounters a struct field:

```go
if fieldValue.Kind() == reflect.Struct {
	nestedPrefix := prefix + "_" + fieldType.Name
	return Parse(nestedPrefix, fieldValue.Addr().Interface())
}
```

This is convenient, but named scalar structures must be considered. A library should decide explicitly whether types such as `time.Time`, `url.URL`, or application-specific value objects are namespaces or scalar values.

> Reflection removes compile-time certainty, so the library must replace it with deliberate runtime rules.

## Custom types through a small interface

A switch over `reflect.Kind` cannot understand every useful application type. Adding every possible parser to the configuration package would make it grow without limit.

The package solves this with a narrow interface:

```go
type Setter interface {
	Set(value string) error
}
```

A custom type can own its parsing:

```go
type LogLevel string

func (level *LogLevel) Set(value string) error {
	switch value {
	case "debug", "info", "warn", "error":
		*level = LogLevel(value)
		return nil
	default:
		return fmt.Errorf("invalid log level %q", value)
	}
}
```

The reflective parser checks both the field value and its address because pointer-receiver methods are common:

```go
if setter, ok := field.Addr().Interface().(Setter); ok {
	return setter.Set(raw)
}
```

This keeps the generic parser small while allowing domain types to define their own valid input.

## Designing useful errors

A conversion failure without field context is difficult to diagnose:

```text
strconv.ParseInt: parsing "eight": invalid syntax
```

A field-specific error is much more useful:

```text
config: error assigning to field Port:
converting 'eight' to type int
```

The package wraps conversion information in `FieldError`:

```go
type FieldError struct {
	fieldName  string
	fieldType  string
	fieldValue string
	fieldErr   error
}
```

For a public library, I would also expose safe accessor methods or exported fields and implement:

```go
func (err *FieldError) Unwrap() error {
	return err.fieldErr
}
```

That allows callers to use `errors.As` for the field error and `errors.Is` for an underlying sentinel.

_Reflection errors should never require a caller to reverse-engineer which field failed._

## `Parse` and `MustParse`

The ordinary API returns an error:

```go
if err := config.Parse("app", &cfg); err != nil {
	return fmt.Errorf("load configuration: %w", err)
}
```

The package also provides `MustParse`, which panics on failure:

```go
config.MustParse("app", &cfg)
```

The panicking version is reasonable at a process entry point where invalid configuration means the application cannot start. Library code and tests should usually prefer `Parse` because it keeps failure under the caller’s control.

`Must` helpers should remain thin wrappers. The parsing behaviour must live in one implementation.

## Loading dotenv files

The parser can load one or more dotenv files before reading the environment:

```go
config.Parse("app", &cfg, ".env", ".env.local")
```

This is convenient during local development, but production systems should remain clear about precedence. Operating-system environment variables should generally win over file defaults, and secrets should not be committed to source control.

Configuration loading is also part of application startup observability. _Log which configuration source was selected, but never log secret values._

## Testing reflective code

Reflection moves errors from compile time to runtime. That makes tests especially important.

The high-value cases include:

- A non-pointer destination.
- A pointer to something other than a struct.
- Missing required values.
- Default values.
- Malformed integers, booleans, floats, durations, and JSON.
- Alternate environment names.
- Nested structures.
- Custom `Setter` implementations.
- Unsupported field kinds.
- Nil pointers and unexported fields.

Table-driven tests work well for conversion errors:

```go
func TestParseRejectsInvalidPort(t *testing.T) {
	t.Setenv("APP_PORT", "not-a-number")

	var cfg Config
	err := Parse("app", &cfg)

	var fieldErr *FieldError
	if !errors.As(err, &fieldErr) {
		t.Fatalf("expected FieldError, got %v", err)
	}
}
```

Tests should also protect package policy. If unsupported kinds must return an error, add a test so a future switch default cannot silently ignore a field.

## Where reflection is worth using

Reflection is justified when the caller defines a type and the library must operate across many possible structures. Configuration decoding, serialization, validation, dependency injection, and database mapping are common examples.

It is usually the wrong tool when:

- A small number of concrete types are already known.
- Generics can express the operation safely.
- A type switch is clearer.
- Performance depends on a tight inner loop.
- The reflective API would leak throughout the application.

For this package, reflection belongs in the adapter that translates strings into a caller-owned struct. After `Parse` returns, the rest of the application uses ordinary typed configuration.

> That is the boundary I aim for: dynamic work at the edge, static types everywhere else.

The purpose of reflection is not to make the code feel magical. It is to remove repetitive configuration plumbing while retaining strict input validation, explicit conversion rules, useful errors, and a thoroughly tested public contract.

## Further reading

- [The `reflect` package documentation](https://pkg.go.dev/reflect)
- [The Laws of Reflection](https://go.dev/blog/laws-of-reflection)
- [The configuration package](https://github.com/josemukorivo/config)
