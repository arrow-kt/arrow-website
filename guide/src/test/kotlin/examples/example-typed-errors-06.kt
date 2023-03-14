// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors06

import arrow.core.Either
import arrow.core.left
import arrow.core.recover
import arrow.core.raise.Raise
import arrow.core.raise.fold
import arrow.core.raise.recover
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object MyError
val error: Either<MyError, Int> = MyError.left()
fun Raise<MyError>.error(): Int = raise(MyError)

object OtherError

val other: Either<OtherError, Int> =
  error.recover { _: MyError -> raise(OtherError) }

fun Raise<OtherError>.other(): Int =
  recover({ error() }) { _: MyError -> raise(OtherError) }

fun example() {
  other shouldBe OtherError.left()
  fold(
    { other() },
    { e: OtherError -> e shouldBe OtherError },
    { _: Int -> fail("A logical failure occurred!") }
  )
}
