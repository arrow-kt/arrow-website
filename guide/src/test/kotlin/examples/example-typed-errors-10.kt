// This file was automatically generated from typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors10

import arrow.core.Either
import arrow.core.left
import arrow.core.NonEmptyList
import arrow.core.nonEmptyListOf
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.zipOrAccumulate
import io.kotest.matchers.shouldBe

data class MyError(val message: String)

fun one(): Either<MyError, Int> =
  MyError("first-error").left()

fun two(): Either<NonEmptyList<MyError>, Long> =
  nonEmptyListOf(MyError("second-error"), MyError("third-error")).left()

fun Raise<MyError>.three(): Double =
  raise(MyError("fourth-error"))

fun example() {
  fun Raise<NonEmptyList<MyError>>.triple(): Triple<Int, Long, Double> =
    zipOrAccumulate({ one().bind() }, { two().bindNel() }, { three() }, ::Triple)

  val errors = nonEmptyListOf(MyError("first-error"), MyError("second-error"), MyError("third-error"), MyError("fourth-error"))
  
  either { triple() } shouldBe errors.left()
}
