// This file was automatically generated from recursive.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRecursive04

import io.kotest.matchers.shouldBe

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
fun fibonacci(n: Int): Int {
  require(n >= 0)
  return fibonacciWorker(n)
}

fun example() {
  fibonacci(6) shouldBe 8
}
