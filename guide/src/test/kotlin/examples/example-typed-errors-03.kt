// This file was automatically generated from typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors03

import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensure
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

data class MyError(val message: String)

fun isPositive(i: Int): Either<MyError, Int> = either {
  ensure(i > 0) { MyError("$i is not positive") }
  i
}

fun Raise<MyError>.isPositive(i: Int): Int {
  ensure(i > 0) { MyError("$i is not positive") }
  return i
}

fun example() {
  isPositive(-1) shouldBe MyError("-1 is not positive").left()

  fold(
    { isPositive(1) },
    { _: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
