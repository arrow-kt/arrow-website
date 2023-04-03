// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide04

import arrow.core.Either
import arrow.core.left
import arrow.core.NonEmptyList
import arrow.core.nonEmptyListOf
import arrow.core.raise.either
import arrow.core.raise.zipOrAccumulate
import io.kotest.matchers.shouldBe

fun one(): Either<String, Int> = "error-1".left()
fun two(): Either<NonEmptyList<String>, Int> = nonEmptyListOf("error-2", "error-3").left()

fun example() {
  either<NonEmptyList<String>, Int> {
    zipOrAccumulate(
      { one().bind() },
      { two().bindNel() }
    ) { x, y -> x + y }
  } shouldBe nonEmptyListOf("error-1", "error-2", "error-3").left()
}
