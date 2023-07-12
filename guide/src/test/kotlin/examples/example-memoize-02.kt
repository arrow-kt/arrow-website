// This file was automatically generated from memoize.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMemoize02

import io.kotest.matchers.shouldBe

import arrow.core.memoize

fun fibonacciWorker(n: Int): Int = when (n) {
  0 -> 0
  1 -> 1
  else -> fibonacciWorker(n - 1) + fibonacciWorker(n - 2)
}

val fibonacci = ::fibonacciWorker.memoize()
fun example() {
  fibonacci(6) shouldBe 8
}
