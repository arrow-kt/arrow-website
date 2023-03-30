// This file was automatically generated from recursive.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRecursive03

import io.kotest.matchers.shouldBe

import arrow.core.memoize

val fibonacciMemoized = ::fibonacciWorker.memoize()

fun fibonacci(n: Int): Int {
  require(n >= 0)
  return fibonacciMemoized(n)
}

fun example() {
  fibonacci(6) shouldBe 8
}

fun fibonacciWorker(n: Int): Int = when (n) {
  0 -> 0
  1 -> 1
  else -> fibonacciWorker(n - 1) + fibonacciWorker(n - 2)
}

