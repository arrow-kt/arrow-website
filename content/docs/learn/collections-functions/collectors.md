---
sidebar_position: 2
description: Better aggregation over sequences
---

# Collectors

Collectors help build complex computations over sequences of values,
guaranteeing that those values are consumed only once.

Take for example the computation of the average of a list. You can 
certainly write a simple version using the built-in functions,

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
val averageCollector = zip(Collectors.sum, Collectors.length) { s, l -> 
  s.toDouble() / l.toDouble() 
}
```

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