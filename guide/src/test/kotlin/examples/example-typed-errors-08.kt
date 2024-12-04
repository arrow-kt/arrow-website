// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors08

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.right
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object Problem

val maybeTwo: Either<Problem, Int> = either { 2 }
val maybeFive: Either<Problem, Int> = either { raise(Problem) }

val maybeSeven: Either<Problem, Int> = either {
  maybeTwo.bind() + maybeFive.bind()
}
