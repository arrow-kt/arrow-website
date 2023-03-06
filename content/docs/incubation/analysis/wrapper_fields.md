---
sidebar_position: 6
---

# Fields and wrappers

Arrow Analysis supports the addition of invariants to types, but what happens when you _already_ have a type and want to add information relative to it? And when may that situation arise? There are two different features to keep more information: fields and wrapper types.

## Fields

The declaration of pre and post-conditions may not only talk about the value of the arguments, but also reference their properties, fields, and even some of their functions. This is used, for example, in the contract of the indexing operation of a list, in which we refer to its `size`.

```kotlin
import arrow.analysis.pre

class List<T> {
  val size: Int
    get() = TODO() // complicated computation
  
  fun get(index: Int): T {
    pre(index >= 0 && index < this.size) { "index within bounds" }
    // complicated code to get the value
  }
}
```

We use the word **field** to collectively refer to those elements of an argument we are allowed to refer to in a pre- or postcondition, or an invariant of a mutable variable or type. There are two sources for fields:

1. Properties and fields, like `size` above.
2. Instance or extension methods with _no_ arguments, this allows you to use `isNotEmpty()` as a field.

Given the rules above, the following is accepted by Arrow Analysis:

```kotlin
import arrow.analysis.pre

fun <T> List<T>.first(): T {
  pre(this.isNotEmpty()) { "list should not be empty" }
  return this.get(0)
}
```

### Definition of fields

Actually, if you think about it, the fact that the previous code snippet is accepted is not obvious at all! There must be an additional reasoning step for Arrow Analysis to understand that is the list is not empty, then calling `get` with `0` as index is allowed, since the precondition for `get` only mentions `size`.

It is very common, though, to have this kind of relationship between properties. Furthermore, many style guidelines suggest to use simpler Boolean predicates like `isNotEmpty()` instead of the longer `size > 0`. To establish this broken link, Arrow Analysis follows this rule:

> If a field declares **no** preconditions, and a **single** postcondition of the form `{ it == SOMETHING }`, then `SOMETHING` is taken as the **definition** of that field.

The tool then deems each usage of the derived field as being equivalent to its definition. In our case, the `List` class would declare the postcondition in `isNotEmpty`.

```kotlin
import arrow.analysis.post

class List<T> {
  fun isNotEmpty(): Boolean {
    // complicated code
    return something.post({ this.size > 0 }) { "non-emptiness is size > 0" }
  }
}
```

We remark that this definition only applies at the level of Arrow Analysis. The _implementation_ of `isNotEmpty` is free to use a more performant algorithm. It's during the reasoning stage within the analysis that we make use of the equivalence with `size > 0`.


## Inline classes

Sometimes there's a particular invariant we repeat over and over in our code. For example, a list not being empty, or a number being positive:

```kotlin
fun average(xs: List<Int>): Int {
  pre(xs.isNotEmpty()) { "list not empty" }
  TODO()
}

fun increment(x: Int): Int {
  pre(x > 0) { "non-negative" }
  return (x + 1).post({ it > 0 }) { "positive" }
}
```

In those cases it might be worth defining a new type where the invariant is encoded once and for all. Here we show those types corresponding to non-empty lists and positive numbers:

```kotlin
@JvmInline
value class NonEmptyList<A>(val value: List<A>) {
  init { require(value.isNotEmpty()) { "not empty" } }
}

@JvmInline
value class Positive(val value: Int) {
  init { require(value > 0) { "positive" } }
}
```

That way your pre- and post-conditions are encoded in the types themselves. Alas, in many cases you need to access the underlying `value` or apply the constructor manually.

```kotlin
fun average(xs: NonEmptyList<Int>): Int = TODO()

fun increment(x: Positive): Positive {
  return Positive(x.value + 1)
}
```

The good news is that the performance won't suffer. The `@JvmInline value` at the beginning of the `NonEmptyList` and `Positive` classes declare those as [inline classes](https://kotlinlang.org/docs/inline-classes.html). The Kotlin compiler substituted ("inlines") any usage of inline classes by their underlying value, avoiding any additional heap allocations.

## Collections

Declaring wrappers to encode invariants become increasingly important when working with collection types (lists, sets, maps). Imagine we want to define a function which increments a list of positive values:

```kotlin
// previous version of increment
fun increment(x: Int): Int {
  pre(x > 0) { "non-negative" }
  return (x + 1).post({ it > 0 }) { "positive" }
}

fun List<Int>.example() = map { increment(it) }
```

This will not work, as the analysis cannot guarantee that the value passed to `increment` inside `map` is indeed positive. Alas, there is no way to define a pre-condition which talks about _all the elements_ in the list (technically, that would involve quantifiers, and this is not supported by the logic in Arrow Analysis.) The solution is to use the corresponding wrapper type:

```kotlin
fun List<Positive>.example() = map { increment(it.value) }
```

Note that in this case we didn't have to change our definition of `increment` to take `Positive` values. Instead, by unwrapping with `it.value` the condition `it.value > 0` becomes available to the analysis, making the call to `increment` correct.

One important pattern in this case is the replacement of `filter`s with operations that introduce the wrapper types. For example, the following is not accepted by Arrow Analysis, because it is unaware of the predicate in `filter`.

```kotlin
fun moreExample(xs: List<Int>) = xs.filter { it > 0 }.example()
```

This case can be worked around by replacing `filter` with `mapNotNull`. Instead of simply removing the undesired elements, we also wrap the good ones in `Positive`.

```kotlin
fun moreExample(xs: List<Int>) = xs.mapNotNull {
  if (it > 0) Positive(it) else null
}.example()
```

In the future we aim to introduce support for attaching invariants to types "on the spot". Other analyzers, like [LiquidHaskell](https://ucsd-progsys.github.io/liquidhaskell-blog/), support this features by means of [_refinement types_](http://ucsd-progsys.github.io/liquidhaskell-tutorial/Tutorial_03_Basic.html).
