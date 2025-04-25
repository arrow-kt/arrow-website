---
sidebar_position: 3
description: Making functions stack-safe and efficient
---

# Recursive functions

Algorithms with a functional flavor tend to favor recursion over looping.
This is often hidden in higher-level functions like `map` and `filter`,
so you don't often see it in your code. However, when the time comes, some
platforms (including the JVM) can make your life quite difficult: deep
recursion means a deep stack, so you can easily get a `StackOverflowError`,
even for not-so-big values.

<!--- TEST_NAME RecursiveFunctionsTest -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
-->

:::note Where to find it

Support for memoized deep recursive functions is available in the `arrow-core` library. Integration with cache4k is provided in its own `arrow-cache4k` library.

:::

## Stack-safe deep recursive functions

Kotlin comes with a built-in [`DeepRecursiveFunction`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deep-recursive-function/)
which solves this problem by keeping the call stack in the heap, which usually
has a much bigger memory space allocated to it.

The [Fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_sequence) is
an all-time favorite example of a recursive operation which requires a deep stack
even for small values. The function is only defined for non-negative `n`,
so we split the actual worker function from the top-level one, which checks the
constraint over the argument.

```kotlin
fun fibonacciWorker(n: Int): Int = when (n) {
  0 -> 0
  1 -> 1
  else -> fibonacciWorker(n - 1) + fibonacciWorker(n - 2)
}

fun fibonacci(n: Int): Int {
  require(n >= 0)
  return fibonacciWorker(n)
}

fun example() {
  fibonacci(6) shouldBe 8
}
```
<!--- KNIT example-recursive-01.kt -->
<!--- TEST assert -->

To make this function stack-safe we change the worker from being a regular
function into being a `DeepRecursiveFunction`. The latter takes a block which
defines the function, very similar to a regular one. The key change is that
instead of calling `fibonacciWorker`, we use `callRecursive` every time we
need a recursive call.

<!--- INCLUDE
fun fibonacci(n: Int): Int {
  require(n >= 0)
  return fibonacciWorker(n)
}

fun example() {
  fibonacci(6) shouldBe 8
}
-->

```kotlin
val fibonacciWorker = DeepRecursiveFunction<Int, Int> { n ->
  when (n) {
    0 -> 0
    1 -> 1
    else -> callRecursive(n - 1) + callRecursive(n - 2)
  }
}
```
<!--- KNIT example-recursive-02.kt -->
<!--- TEST assert -->

:::caution Function in a val

Note that we've used `val` to save the `DeepRecursiveFunction`, instead of
`fun`. However, since that type overloads the `invoke` operator, we still
can call it as if it was a function, so no changes are required for `fibonacci`.

:::

## Memoized recursive functions

There's an enormous amount of duplicate work being done in a call to `fibonacci`.
Here is the call tree of `fibonacciWorker(4)`, you can see that we end up in
`fibonacci(2)` a couple of times. Not only that: we can see that in the recursive
call for `n - 1` we eventually require the value for `n - 2` too. Could we make
this function a bit less wasteful?

```mermaid
graph TD;
  4-->3a;
  3a[3];
  3a-->2a;
  3a-->1a;
  2a[2];
  1a[1];
  2a-->1b;
  1b[1];
  2a-->0b;
  0b[0]
  4-->2b;
  2b[2];
  2b-->1c;
  1c[1];
  2b-->0c;
  0c[0];
```

:::info Fibonacci 🤯

The number of calls required to compute Fibonacci is also given by the Fibonacci
sequence!

:::

Fibonacci is a pure function, in other words, given the same argument we always
obtain the same result. This means that once we've computed a value, we can just
_record_ in some cache, so later invocations only have to look there. This
technique is known as **memoization**, and Arrow provides an implementation
in the form of [`MemoizedDeepRecursiveFunction`](https://apidocs.arrow-kt.io/arrow-core/arrow.core/-memoized-deep-recursive-function.html).
No changes other than the outer call are required.

```kotlin
import arrow.core.MemoizedDeepRecursiveFunction

val fibonacciWorker = MemoizedDeepRecursiveFunction<Int, Int> { n ->
  when (n) {
    0 -> 0
    1 -> 1
    else -> callRecursive(n - 1) + callRecursive(n - 2)
  }
}
```
<!--- INCLUDE
fun fibonacci(n: Int): Int {
  require(n >= 0)
  return fibonacciWorker(n)
}

fun example() {
  fibonacci(6) shouldBe 8
}
-->
<!--- KNIT example-recursive-03.kt -->
<!--- TEST assert -->

### Memoization takes memory

If you define the memoized version of your function as a `val` as we've done
above, the cache is shared among **all** calls to your function. In the worst
case, this may result in memory which cannot be reclaimed throughout the whole
execution. If this may pose a problem in your application, you should
consider a better [eviction policy for the cache](https://otee.dev/2021/08/18/cache-replacement-policy.html).

You can tweak `MemoizedDeepRecursiveFunction`'s caching mechanism using
the `cache` parameter. Apart from the built-in options, we provide integration
with [cache4k](https://reactivecircus.github.io/cache4k/), a Multiplatform-ready
library that covers all your desired caching options, in the form of
`arrow-cache4k`.

```kotlin
import arrow.core.MemoizedDeepRecursiveFunction
import arrow.core.Cache4kMemoizationCache
import arrow.core.buildCache4K

val cache = buildCache4K<Int, Int> { maximumCacheSize(100) }

val fibonacciWorker = MemoizedDeepRecursiveFunction<Int, Int>(
  Cache4kMemoizationCache(cache)
) { n ->
  when (n) {
    0 -> 0
    1 -> 1
    else -> callRecursive(n - 1) + callRecursive(n - 2)
  }
}
```
<!--- INCLUDE
fun fibonacci(n: Int): Int {
  require(n >= 0)
  return fibonacciWorker(n)
}

fun example() {
  fibonacci(6) shouldBe 8
}
-->
<!--- KNIT example-recursive-04.kt -->
<!--- TEST assert -->
