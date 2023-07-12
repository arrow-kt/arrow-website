// This file was automatically generated from memoize.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMemoize01

import io.kotest.matchers.shouldBe

import arrow.core.memoize

fun expensive(x: Int): Int {
  // fake it by sleeping the thread
  Thread.sleep(x * 100L)
  return x
}

val memoizedExpensive = ::expensive.memoize()

fun example() {
  val result1 = memoizedExpensive(3)
  val result2 = memoizedExpensive(3)
  result1 shouldBe result2
}
