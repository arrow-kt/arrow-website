---
sidebar_position: 4
description: Avoiding duplicate work for pure functions
---

# Memoization

Say that your function is pure, that is, given the same inputs it always
produces the same outputs, and it doesn't produce any other effects like printing
to the screen. Then, once you execute the function for a given input, you could
save (or cache) the result, so the next time you need it you don't have to compute it
again. The general technique of saving outputs to avoid double computation of
pure functions is known as _memoization_.

:::warning `MemoizedDeepRecursiveFunction` recommended

The techniques in this section are quite low-level, and require careful
attention when used in recursive functions. 
[`MemoizedDeepRecursiveFunction`](../recursive/#memoized-recursive-functions)
is an easier-to-use alternative, which also provides more options for
configuring the caching policy.

:::

## Simple memoization

<!--- TEST_NAME MemoizationTest -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
-->

Arrow Core contains a small utility called
[`memoize`](https://apidocs.arrow-kt.io/arrow-functions/arrow.core/memoize.html)
which transforms any function into one that keeps a cache of computed results.

```kotlin
import arrow.core.memoize

fun expensive(x: Int): Int {
  // fake it by sleeping the thread
  Thread.sleep(x * 100L)
  return x
}

val memoizedExpensive = ::expensive.memoize()
```

The first time you call `memoizeExpensive`, it needs to compute the value.
From that moment on, the call returns immediately.

```kotlin
fun example() {
  val result1 = memoizedExpensive(3)
  val result2 = memoizedExpensive(3)
  result1 shouldBe result2
}
```
<!--- KNIT example-memoize-01.kt -->
<!--- TEST assert -->

:::caution Memoization takes memory

If you define the memoized version of your function as a `val`, as we've done
above, the cache is shared among **all** calls to your function. In the worst
case, this may result in memory which cannot be reclaimed throughout the whole
execution, so you should apply this technique carefully.

There's some literature about [eviction policies for memoization](https://otee.dev/2021/08/18/cache-replacement-policy.html),
but at the moment of writing memoize doesn't offer any type of control over the
cached values. [Aedile](https://github.com/sksamuel/aedile) is a Kotlin-first
caching library which you can use to manually tweak your memoization.

:::

## Recursion

The technique outlined above can be applied to any function, regardless of its
provenance. However, one needs to be aware of the limitations of `memoize` with
respect to recursive functions.

Let's say we define a recursive Fibonacci function, and call `memoize` with the
intention of avoiding computing the same values over and over.

<!--- INCLUDE
import arrow.core.memoize
-->
```kotlin
fun fibonacciWorker(n: Int): Int = when (n) {
  0 -> 0
  1 -> 1
  else -> fibonacciWorker(n - 1) + fibonacciWorker(n - 2)
}

val fibonacci = ::fibonacciWorker.memoize()
```

<!--- INCLUDE
fun example() {
  fibonacci(6) shouldBe 8
}
-->
<!--- KNIT example-memoize-02.kt -->
<!--- TEST assert -->

This solution falls short, though, because recursion goes through
`fibonacciWorker`, which is **not** memoized.

One way to avoid this problem is making `fibonacciWorker` call `fibonacci`
instead. Our recommendation, however, is to use
[`MemoizedDeepRecursiveFunction`](../recursive/#memoized-recursive-functions),
which avoids the weird mutually-recursive definition, and has the additional
benefit of avoiding stack overflows.
