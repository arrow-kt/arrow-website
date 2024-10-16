// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors22

import arrow.core.*
import arrow.core.raise.*
import io.kotest.matchers.shouldBe

val stringError: Either<String, Boolean> = "problem".left()

val intError: Either<Int, Boolean> = either {
  // transform error String -> Int
  withError({ it.length }) { 
    stringError.bind()
  }
}
fun example() {
  intError shouldBe Either.Left("problem".length)
}
