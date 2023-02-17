// This file was automatically generated from typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors05

import arrow.core.Either
import arrow.core.left
import arrow.core.merge
import arrow.core.recover
import arrow.core.raise.Raise
import arrow.core.raise.fold
import arrow.core.raise.recover
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object MyError

val error: Either<MyError, Int> = MyError.left()

fun Raise<MyError>.error(): Int = raise(MyError)

val fallback: Either<Nothing, Int> =
  error.recover { e: MyError -> 1 }

fun Raise<Nothing>.fallback(): Int =
  recover({ error() }) { e: MyError -> 1 }

fun main() {
  fallback.merge() shouldBe 1
  fold(
    { fallback() },
    { e: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
