// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors01

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.right
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object MyError

val one: Either<MyError, Int> = 1.right()

fun Raise<MyError>.one(): Int = 1

val res = either { one() }

fun Raise<MyError>.res(): Int = one.bind()

fun example() {
  when (res) {
    is Left -> fail("No logical failure occurred!")
    is Right -> res.value shouldBe 1
  }

  fold(
    { res() },
    { _: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
