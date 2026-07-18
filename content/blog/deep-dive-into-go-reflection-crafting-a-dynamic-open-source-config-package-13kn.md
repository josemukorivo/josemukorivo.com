---
id: 1740898
title: "Deep Dive into Go Reflection: Crafting a Dynamic Open Source Config Package"
description: >-
  How I used Go reflection to load environment variables into typed structs
  without letting dynamic code spread through the application.
publishedAt: "2024-01-26T09:40:20Z"
updatedAt: "2026-07-18T17:47:50Z"
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

Configuration code starts small. Read a string from the environment, parse an integer, check an error. A few months later the application has the same parsing code in several places and each version handles defaults differently.

I built a small [configuration package](https://github.com/josemukorivo/config) around this contract:

```go
type Config struct {
	Host    string        `required:"true"`
	Port    int           `default:"8080"`
	Timeout time.Duration `default:"5s"`
	Debug   bool          `default:"false"`
}

var cfg Config
if err := config.Parse("app", &cfg); err != nil {
	log.Fatal(err)
}
```

The parser maps those fields to `APP_HOST`, `APP_PORT`, `APP_TIMEOUT`, and `APP_DEBUG`. Reflection is useful here because the package does not know the caller's struct at compile time.

I keep that dynamic work behind `Parse`. Once it returns, the application has an ordinary typed `Config` value.

## Values, types, and kinds

The two functions I use first are:

```go
value := reflect.ValueOf(input)
typ := reflect.TypeOf(input)
```

`reflect.Type` describes the declared type. `reflect.Value` gives access to a runtime value. A type also has a `Kind`, which is its underlying category:

```go
type Port int

var port Port = 8080
typ := reflect.TypeOf(port)

fmt.Println(typ.Name()) // Port
fmt.Println(typ.Kind()) // int
```

That distinction matters for `time.Duration`. Its kind is `int64`, but parsing `5s` as a plain integer would be wrong. The package checks the declared type before falling back to kind-based conversion.

## Why `Parse` needs a pointer

Reflection can inspect a value without being able to change it. This call passes a copy:

```go
config.Parse("app", cfg)
```

The parser requires a non-nil pointer to a struct. A small validation function keeps the error at the API boundary:

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

`Elem` dereferences the pointer. The returned struct is addressable, so exported fields can be changed.

## Reading fields and tags

The parser walks the value and its type together:

```go
for index := 0; index < value.NumField(); index++ {
	fieldValue := value.Field(index)
	fieldType := value.Type().Field(index)

	if !fieldValue.CanSet() {
		continue
	}

	// Read tags and assign the environment value.
}
```

The value is needed for assignment. `reflect.StructField` contains the field name, declared type, and tags such as `env`, `default`, and `required`.

I translate that reflection data into a small internal `Field` type. This keeps the rest of the parser from reaching into `reflect` for every decision and gives error messages one place to get the field name and environment key.

An `env` tag can replace the field name. Otherwise the package uppercases the field and adds the prefix:

```go
key := fieldType.Name
if name, ok := fieldType.Tag.Lookup("env"); ok {
	key = name
}
if prefix != "" {
	key = prefix + "_" + key
}
key = strings.ToUpper(key)
```

I use `Lookup` where an empty tag value is meaningful because it tells me whether the tag exists. `Get` only returns a string, so a missing tag and an explicitly empty tag look the same.

## Converting the value

`os.LookupEnv` is important for the same reason: a missing variable is different from a present variable whose value is empty.

Once the raw string is resolved, the parser switches on the field kind. Strings can be assigned directly. Integers and floats use the field's bit width so overflow is checked correctly:

```go
number, err := strconv.ParseInt(
	raw,
	0,
	field.Type().Bits(),
)
if err != nil {
	return err
}

field.SetInt(number)
```

Booleans use `strconv.ParseBool`. `time.Duration` is handled before the generic integer branch with `time.ParseDuration`.

Nested structs can recurse with a longer prefix, producing keys such as `APP_DATABASE_HOST`. The package has to decide which structs are namespaces and which are scalar values. Treating every struct as a namespace would break types such as `time.Time` or `url.URL`.

## Let custom types parse themselves

A kind switch cannot know every application type. I did not want the package to grow a built-in parser for every enum or identifier, so it supports a small interface:

```go
type Setter interface {
	Set(value string) error
}
```

A domain type can then own its rules:

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

The parser checks the field's address for `Setter`, which supports the usual pointer receiver.

## Errors and tests are part of the API

Reflection moves mistakes from compile time to runtime. An error such as `parsing "eight": invalid syntax` is missing the detail an operator needs. I wrap conversion errors with the field name, environment key, expected type, and original error. Supporting `Unwrap` also lets callers use `errors.Is` and `errors.As`.

The tests cover the runtime contracts: invalid destinations, missing required values, defaults, bad conversions, nested fields, custom setters, unsupported kinds, and unexported fields. Every new branch in reflective code needs a failure test as well as a success test.

I use reflection when the caller owns the type and the package must work with many possible structs. I avoid it when a few concrete types or a type switch would be clearer.

For configuration, the boundary is small enough to be worth it: strings and metadata enter at startup, reflection translates them once, and the rest of the program stays statically typed.

## Further reading

- [The `reflect` package](https://pkg.go.dev/reflect)
- [The Laws of Reflection](https://go.dev/blog/laws-of-reflection)
- [The configuration package](https://github.com/josemukorivo/config)
