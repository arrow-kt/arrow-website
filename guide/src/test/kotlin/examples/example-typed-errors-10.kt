// This file was automatically generated from typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors10

import arrow.core.Either
import arrow.core.left
import arrow.core.nonEmptyListOf
import arrow.core.mapOrAccumulate
import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.core.raise.Raise
import io.kotest.matchers.shouldBe

data class NotEven(val i: Int)

fun Raise<NotEven>.isEven(i: Int): Int =
  i.also { ensure(i % 2 == 0) { NotEven(i) } }

fun isEven2(i: Int): Either<NotEven, Int> =
  either { isEven(i) }

val errors = nonEmptyListOf(NotEven(1), NotEven(3), NotEven(5), NotEven(7), NotEven(9)).left()

fun main() {
  (1..10).mapOrAccumulate { isEven(it) } shouldBe errors
  (1..10).mapOrAccumulate { isEven2(it).bind() } shouldBe errors
}
