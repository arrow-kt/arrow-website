// This file was automatically generated from recursive.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRecursive02

import io.kotest.matchers.shouldBe

fun fibonacci(n: Int): Int {
  require(n >= 0)
  return fibonacciWorker(n)
}

fun example() {
  fibonacci(6) shouldBe 8
}

val fibonacciWorker = DeepRecursiveFunction<Int, Int> { n ->
  when (n) {
    0 -> 0
    1 -> 1
    else -> callRecursive(n - 1) + callRecursive(n - 2)
  }
}
