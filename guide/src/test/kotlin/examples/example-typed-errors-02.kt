// This file was automatically generated from typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors02

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.left
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object MyError

val error: Either<MyError, Int> = MyError.left()

fun Raise<MyError>.error(): Int = raise(MyError)

fun example() {
  when (error) {
    is Left -> error.value shouldBe MyError
    is Right -> fail("A logical failure occurred!")
  }

  fold(
    { error() },
    { e: MyError -> e shouldBe MyError },
    { i: Int -> fail("A logical failure occurred!") }
  )
}
