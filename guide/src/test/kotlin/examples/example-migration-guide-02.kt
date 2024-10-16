// This file was automatically generated from migration.md by Knit tool. Do not edit.
package arrow.website.examples.exampleMigrationGuide02

import arrow.core.Either
import arrow.core.zip
import arrow.core.raise.either

fun one(): Either<String, Int> = Either.Right(1)

// val old: Either<String, Int> = one().zip(one()) { x, y -> x + y }

val new: Either<String, Int> =
  either { one().bind() + one().bind() }

val new2 : Either<String, Int> = either { 
  val x = one().bind()
  val y = one().bind()
  x + y
}
