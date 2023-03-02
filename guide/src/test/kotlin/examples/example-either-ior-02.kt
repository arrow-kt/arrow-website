// This file was automatically generated from either_ior.md by Knit tool. Do not edit.
package arrow.website.examples.exampleEitherIor02

import io.kotest.matchers.shouldBe
import arrow.core.left
import arrow.core.right
import arrow.core.Either

// this is the type we want to construct
@JvmInline value class Age(val age: Int)

// these are the potential problems
sealed interface AgeProblem {
  object InvalidAge: AgeProblem
  object NotLegalAdult: AgeProblem
}

// validation returns either problems or the constructed value
fun validAdult(age: Int): Either<AgeProblem, Age> = when {
  age < 0  -> AgeProblem.InvalidAge.left()
  age < 18 -> AgeProblem.NotLegalAdult.left()
  else     -> Age(age).right()
}
