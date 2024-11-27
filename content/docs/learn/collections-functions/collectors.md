---
sidebar_position: 2
description: Better aggregation over sequences
---

# Collectors

Collectors help build complex computations over sequences of values,
guaranteeing that those values are consumed only once.

:::note Where to find it

Collectors live in the `arrow-collectors` library. This library is still in experimental state, but no big changes are expected.

:::

Take for example the computation of the average of a list. You can 
certainly write a simple version using the built-in functions,

<!--- INCLUDE
val list = listOf(1, 2, 3)
-->

```kotlin
val average = list.sum() / list.size
```
<!--- KNIT example-collectors-01.kt -->

Note however that this implementation traverses the list _twice_,
one per operation over the list. This may not be a problem for small
lists but could become more problematic with longer collections.
Some data structures, like `Sequence` or `Flow`, impose an
even larger footprint, as their elements are computed every time
you need a new one.

Collectors separate the description of the aggregation you want
to perform from the actual collection. To create a new collector
you use one of the built-in ones, and combine them using `zip`.

```kotlin
import arrow.collectors.Collectors
import arrow.collectors.collect
import arrow.collectors.zip

fun divide(x: Int, y: Int): Double = x.toDouble() / y.toDouble()

val averageCollector = zip(Collectors.sum, Collectors.length, ::divide)
```

<!--- INCLUDE
val list = listOf(1, 2, 3)
-->

You then may apply the collector to the sequence or collection you want.

```kotlin
val average = list.collect(averageCollector)
```
<!--- KNIT example-collectors-02.kt -->

:::note Influences

The API implemented in `arrow-collectors` is heavily influenced by
Java's [`Collector`](https://docs.oracle.com/javase/8/docs/api/java/util/stream/Collector.html)
and Haskell's [`foldl` library](https://hackage.haskell.org/package/foldl/docs/Control-Foldl.html).

:::

## Collectors, sequences and flows

Given a sequence of values (in the most abstract sense of the term)
you can broadly operate over them in two different ways: by _transforming_
the sequence into a new one, or by _consuming_ the values into a single
result. Sometimes we refer to the former group as _intermediate_ operations
and the latter as _terminal_.

- Operations like `map`, `filter` and `distinct` belong to the group
  of transformations.
- Operations like `sum` and `size` belong to the group of consumers.

Collectors, as introducing in this section, focus on the second group.
For transformation of sequences, Kotlin already provides two good tools:

- [Sequences](https://kotlinlang.org/docs/sequences.html) describe
  transformations which are performed in a lazy fashion.
- [Flows](https://kotlinlang.org/docs/flow.html) are the counterpart when
  the generation or transformation of values require `suspend` operations.
