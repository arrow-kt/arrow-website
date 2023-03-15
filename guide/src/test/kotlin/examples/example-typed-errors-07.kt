// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors07

import arrow.core.Either
import arrow.core.left
import arrow.core.recover
import arrow.core.raise.Raise
import arrow.core.raise.fold
import arrow.core.raise.recover
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object OtherError
object MyError

val fallback: Either<OtherError, Int> = OtherError.left()

fun Raise<OtherError>.fallback(): Int = raise(OtherError)

val other: Either<OtherError, Int> =
  MyError.left().recover { _: MyError -> fallback() }

fun Raise<OtherError>.other(): Int =
  recover({ raise(MyError) }) { _: MyError -> fallback.bind() }

fun example() {
  other shouldBe OtherError.left()
  fold(
    { other() },
    { e: OtherError -> e shouldBe OtherError },
    { _: Int -> fail("A logical failure occurred!") }
  )
}
