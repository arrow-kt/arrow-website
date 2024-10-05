// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide01

import arrow.core.Either
// import arrow.core.traverse
import arrow.core.raise.either

fun one(): Either<String, Int> = Either.Right(1)

// val old: Either<String, List<Int>> =
//   listOf(1, 2, 3).traverse { one() }

val new: Either<String, List<Int>> = either {
  listOf(1, 2, 3).map { one().bind() }
}
