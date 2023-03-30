// This file was automatically generated from recursive.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRecursive01

import io.kotest.matchers.shouldBe

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
