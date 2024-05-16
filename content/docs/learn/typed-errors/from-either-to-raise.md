---
title: From Either to Raise
sidebar_position: 5
description: Learning about Raise from other FP ecosystems.
---

# From `Either` to `Raise`

Typed errors in other functional ecosystems usually revolve around
special types like `Either`, which provide the ability to describe
computations that are successful or end in error. This style is
fully supported by Arrow, but the DSL based around `Raise` usually
results in nicer code. This small guide describes common patterns
in the `Either` style and how they translate into `Raise`.

In the following discussion, we assume the following functions:

```kotlin
fun f(n: Int): Either<Error, String>
fun g(s: String): Either<Error, Thing>
fun h(s: String): Either<Boo, Thing>
fun Thing.summarize(): String
```

## Sequential composition

The basic way to compose computations that may error out is by
sequentially executing each of them, and finishing early if
an error appears. This is done using `flatMap` — if the next
computation may also fail — or `map` — if you need to apply
a pure computation to the result, if available.

Take this possible combination of the aforementioned functions:

```kotlin
fun tururu(n: Int): Either<Error, String> =
  f(n).flatMap { s ->
    g(s).map { t ->
      t.summarize()
    }
  }
```

The translation into the `Raise` DSL describes the same sequence
of steps, but using a more sequential style:

```kotlin
fun tururu(n: Int): Either<Error, String> = either {
  val s = f(n).bind()
  val t = g(s).bind()
  t.summarize()
}
```

There are two important steps in this translation. At the beginning of
the function, we have the `either` builder, which (1) indicates that
the result of the function is `Either` of some error type and (2)
creates a new scope in which you can use the `Raise` DSL.

The second step is that every time that you have an `Either` value
resulting from another computation (like `f` and `g` above), you need
to call `bind`. This "injects" any potential error value in the context,
and continues normal execution otherwise.
In this style you don't need to use any function to compose computations,
you use regular Kotlin idioms with some `bind`s sprinkled. In fact
you could have written the previous code in one single line:

```kotlin
fun tururu(n: Int): Either<Error, String> = either {
  g(f(n).bind()).bind().summarize()
}
```

How you split your code into local values no longer depends on the
structure of your functions, as is the case with `flatMap`, but rather
on the logical decomposition you want in your code.

Arrow provides different builders for different return types
(`either`, `option`, `result`), but regardless of the one you choose
you always use `bind` for the injection phase.

## Returning with logical error

Using wrapper types you often have a specific constructor that represents
the error case. For example, `Left` signals failure when using `Either`.
Using the `Raise` DSL you no longer need to remember each of them, 
failure is always signaled using `raise`.

```kotlin
fun tururuThatRaise(n: Int): Either<Error, String> = either {
  if (n < 0) raise(Error.NegativeInput)
  val s = f(n).bind()
  val t = g(s).bind()
  t.summarize()
}
```

Calling `raise` immediately ends the execution of the current block. In the example
above, calling `h(-1)` ends up in `raise`, which in the case of an `either` block
means resulting in `Either.Left(Error.NegativeInput)`.

:::info Somebody said "exceptions"?

The propagation and early return of the `Raise` scope look similar to exceptions.
However, typed errors should be used for _logical_ errors — problems that have
a place in your domain model — as opposed to _exceptional_ cases — which represent
circumstances that are difficult to recover from.

:::

## Transforming the error values

The fact that both `f` and `g` share the same `Error` type is key for
the previous code blocks to compile. In every `Raise` scope, we have one _single_
error type which you can `raise` or `bind` in the whole block of code.
If this is not the case, you have to _bridge_ the different error types, which
is done using functions like `mapLeft`.

```kotlin
fun tarara(n: Int): Either<Error, String> =
  f(n).flatMap { s ->
    h(s).mapLeft { 
      it.toString()
    }.map { t ->
      t.summarize()
    }
  }
```

Within the `Raise` DSL, the corresponding function is called `withError`.
Following the discussion above, the `withError` function creates a new
scope in which the error type is different. The first argument to
`withError` describes how to transform failure values from the inner
scope into the error type of the outer scope.

```kotlin
fun tarara(n: Int): Either<Error, String> = either {
  val s = f(n).bind()
  val t = withError({ it.toString() }) { h(s).bind() }
  t.summarize()
}
```

## More than one failure

Sometimes you have not one, but many values for which you
want to run a potentially-failing computation. Almost every library
provides an "effectful map" (usually called `traverse`) to cover those cases.

```kotlin
fun tururus(xs: List<Int>) = xs.traverse { tururu(it) }
```

Another advantage of the `Raise` DSL is that you don't need all of those
new combinators. The regular `map` on lists is enough — although you
need to remember to `bind` the values to "inject" the errors.

```kotlin
fun tururus(xs: List<Int>) = either {
  xs.map { tururu(it).bind() }
  // alternatively
  xs.map { tururu(it) }.bindAll()
}
```

This advantage is bigger than just dropping a few function names. Since
you don't need specific effectful combinators, you are free to use any
function operating on collections of elements, without restriction.

:::tip Error accumulation

By default `Raise` operates on a fail-first basis: once a failure is `raise`d,
the whole block comes to a halt. If you are operating on a collection, this
means that only the first error is reported. If you need to _accumulate_
all errors that arise in some block, you need to switch to `mapOrAccumulate`.
More information can be found in the 
[Working with typed errors](working-with-typed-errors.md#accumulating-errors) page.

:::

## `Either` no more
