// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide03

import arrow.core.Either
import arrow.core.left
import arrow.core.NonEmptyList
import arrow.core.nonEmptyListOf
import arrow.core.mapOrAccumulate
import io.kotest.matchers.shouldBe

fun one(): Either<String, Int> = "error-1".left()
fun two(): Either<NonEmptyList<String>, Int> = nonEmptyListOf("error-2", "error-3").left()

fun example() {
  listOf(1, 2).mapOrAccumulate {
    one().bind()
  } shouldBe nonEmptyListOf("error-1", "error-1").left()
  
  listOf(1, 2).mapOrAccumulate {
    two().bind()
  } shouldBe nonEmptyListOf("error-2", "error-3", "error-2", "error-3").left()
}
