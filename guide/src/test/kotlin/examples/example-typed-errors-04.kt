// This file was automatically generated from typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors04

import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensureNotNull
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

data class MyError(val message: String)

fun increment(i: Int?): Either<MyError, Int> = either {
  ensureNotNull(i) { MyError("Cannot increment null") }
  i + 1
}

fun Raise<MyError>.increment(i: Int): Int {
  ensureNotNull(i) { MyError("$i is null") }
  return i + 1
}

fun main() {
  increment(null) shouldBe MyError("Cannot increment null").left()

  fold(
    { increment(1) },
    { _: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 2 }
  )
}
