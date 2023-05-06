// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors10

import arrow.core.Either
import arrow.core.raise.either
import arrow.core.raise.nullable

object Problem

fun problematic(n: Int): Either<Problem, Int?> =
  either { 
    nullable { 
      when {
        n < 0  -> raise(Problem)
        n == 0 -> raise(null)
        else   -> n
      }
    }
  }
