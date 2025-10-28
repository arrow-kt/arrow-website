---
title: From Either to Raise
sidebar_position: 3
description: Learning about Raise from other FP ecosystems.
---

# From `Either` to `Raise`

Typed errors in other functional ecosystems usually revolve around
dedicated types like `Either`, which provide the ability to describe
computations that are successful or end in error. This style is
fully supported by Arrow, but the DSL based around `Raise` usually
results in a nicer code. This small guide describes common patterns
in the `Either` style and how they translate into `Raise`.

:::note Working with typed errors

For a more general introduction to typed errors, without assuming
any prior knowledge on the topic, check [this tutorial](working-with-typed-errors.md).

:::

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

Consider this possible combination of the aforementioned functions:

```kotlin
fun foo(n: Int): Either<Error, String> =
  f(n).flatMap { s ->
    g(s).map { t ->
      t.summarize()
    }
  }
```

The translation into the `Raise` DSL describes the same sequence
of steps, but using a more sequential style:

```kotlin
fun foo(n: Int): Either<Error, String> = either {
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
to call `bind`. This short-circuits the current calculation in case
of error and continues with normal execution otherwise.
In this style you don't need to use any function to compose computations,
you use regular Kotlin idioms with some `bind`s sprinkled. In fact,
you could have written the previous code in one single line:

```kotlin
fun foo(n: Int): Either<Error, String> = either {
  g(f(n).bind()).bind().summarize()
}
```

How you split your code into local values no longer depends on the
structure of your functions, as is the case with `flatMap`, but rather
on the logical decomposition you want to achieve in your code.

Arrow provides different builders for different return types
(`either`, `option`, `result`), but regardless of which one you choose
you always use `bind` at every step where potential failure is possible.

:::info Why "Raise DSL"?

At this point, you may be surprised that we haven't used the word `Raise`
at all in the code, only `either` and `bind`. To understand why we use
"`Raise` DSL" to refer to this coding style, we need to dig a bit into
the type of the `either` declaration itself.

```kotlin
fun <E, A> either(block: Raise<E>.() -> A): Either<E, A>
```

The fact that `Raise<E>` appears at the front of the function type
of `block` (formally, as an [extension receiver](https://kotlinlang.org/docs/lambdas.html#function-literals-with-receiver))
means that all the functions from the `Raise<E>` interface are available
implicitly in the scope of `block`. The function `bind` (alongside
`raise`, `ensure`, `mapOrAccumulate`, and others) lives in that interface.

The pattern of having a parameter with a functional type with receiver
is not alien to Kotlin, either. Quite the contrary, it is
[described in the documentation](https://kotlinlang.org/docs/type-safe-builders.html).
Other well-known libraries in the ecosystem, like `kotlinx.coroutines`
also follow this pattern (in `coroutineScope` or `flow`, for example).

:::

## Returning with logical error

Using wrapper types you often have a specific constructor that represents
the error case. For example, `Left` signals failure when using `Either`.
Using the `Raise` DSL you no longer need to remember each of them, 
failure is always signaled using `raise`.

```kotlin
fun fooThatRaises(n: Int): Either<Error, String> = either {
  if (n < 0) raise(Error.NegativeInput)
  val s = f(n).bind()
  val t = g(s).bind()
  t.summarize()
}
```

Calling `raise` immediately ends the execution of the current block. In the example
above, calling `fooThatRaises(-1)` ends up in `raise`, which in the case of an `either` block
means resulting in `Either.Left(Error.NegativeInput)`.

:::info Somebody said "exceptions"?

The propagation and early return of the `Raise` scope look similar to exceptions.
That is deliberate, for familiarity.  However, they serve a different purpose from exceptions.
Typed errors should be used for _logical_ errors — problems that have
a place in your domain model — as opposed to _exceptional_ cases — which represent
circumstances that are difficult to recover from.

For a more concrete example, `Raise` is a good tool to signal problems like
"user not found in a database". On the other hand, "database connection suddenly dropped"
should rather be modeled via exceptions (perhaps combined with [resilience](/learn/resilience/intro)).

:::

By the way, the Raise DSL provides several utility functions for common patterns.
Checking an assertion and raising if false is one of those; so the most idiomatic
way to write the code above is:

```kotlin
fun fooThatRaises(n: Int): Either<Error, String> = either {
  ensure(n >= 0) { Error.NegativeInput }
  val s = f(n).bind()
  val t = g(s).bind()
  t.summarize()
}
```

## Transforming the error values

The fact that both `f` and `g` share the same `Error` type is key for
the previous code blocks to compile. In every `Raise` scope, we have one _single_
error type which you can `raise` or `bind` in the whole block of code.
If this is not the case, you have to _bridge_ the different error types to each other, which
is done using functions like `mapLeft`.

```kotlin
fun bar(n: Int): Either<Error, String> =
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
scope error type into the error type of the outer scope.

```kotlin
fun bar(n: Int): Either<Error, String> = either {
  val s = f(n).bind()
  val t = withError({ boo -> boo.toError() }) { h(s).bind() }
  t.summarize()
}
```

## More than one failure

Sometimes you have not one, but many values for which you
want to run a potentially-failing computation. Almost every library
provides an "effectful map" (usually called `traverse`) to cover those cases.

```kotlin
fun foos(xs: List<Int>) = xs.traverse { foo(it) }
```

Another advantage of the `Raise` DSL is that you don't need all of those
new combinators. The regular `map` on lists is enough — although you
need to remember to `bind` each of the values.

```kotlin
fun foos(xs: List<Int>) = either {
  xs.map { foo(it).bind() }
  // alternatively
  xs.map { foo(it) }.bindAll()
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

## `Either` and `bind` no more

Until this point, we were using the `Raise` DSL to combine different `Either`
computations, with the goal of producing yet another `Either`. The frontier
between both styles requires the use of `bind`; but if you go full-on with
`Raise`, we can even remove those. In that case, the error type appears
as the extension receiver, instead of wrapping the return type.

```kotlin
fun Raise<Error>.f(n: Int): String
fun Raise<Error>.g(s: String): Thing
fun Raise<Boo>.h(s: String): Thing
fun Thing.summarize(): String
```

As a consequence of return types being "bare", we can use them directly,
without the mediation of `bind`. The last of our examples reads now as:

```kotlin
fun Raise<Error>.bar(n: Int): String {
  val s = f(n)
  val t = withError({ boo -> boo.toError() }) { h(s) }
  return t.summarize()
}
```

We encourage you to use this style, especially for non-public parts of your
code, instead of continuously using `either` and `bind`. Apart from the
stylistic improvement, it also avoids wrapping and unwrapping
`Right` and `Left` values.

:::warning More than one receiver

Unfortunately, the current Kotlin language does not allow for more than
one receiver. That means that you cannot easily turn a function like this:

```kotlin
fun Thing.problematic(): Either<Error, String>
```

into a similar version but with `Raise<Error>` as a receiver. There is
an ongoing proposal, [context parameters](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md),
which shall hopefully drop this restriction. Until then though, your best resort
is to move the original receiver into an argument.

```kotlin
fun Raise<Error>.problematic(thing: Thing): String
```

:::
