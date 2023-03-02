// This file was automatically generated from either_ior.md by Knit tool. Do not edit.
package arrow.website.examples.exampleEitherIor01

import io.kotest.matchers.shouldBe
import arrow.core.left
import arrow.core.right
import arrow.core.Either

import arrow.core.raise.either
import arrow.core.raise.ensure

data class MyError(val message: String)

fun isPositive(i: Int): Either<MyError, Int> = either {
  ensure(i > 0) { MyError("$i is not positive") }
  i
}

suspend fun example() {
  isPositive(-1) shouldBe MyError("-1 is not positive").left()
  isPositive(1)  shouldBe 1.right()
}
