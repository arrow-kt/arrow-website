// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors21

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.NonEmptyList
import arrow.core.nonEmptyListOf
import arrow.core.raise.either
import arrow.core.raise.accumulate
import io.kotest.matchers.shouldBe

sealed interface UserProblem {
  object EmptyName: UserProblem
  data class NegativeAge(val age: Int): UserProblem
}

data class User private constructor(val name: String, val age: Int) {
  companion object {
    operator fun invoke(name: String, age: Int): Either<NonEmptyList<UserProblem>, User> = either {
      accumulate {
        ensureOrAccumulate(name.isNotEmpty()) { UserProblem.EmptyName }
        ensureOrAccumulate(age >= 0) { UserProblem.NegativeAge(age) }
        User(name, age)
      }
    }
  }
}

fun example() {
  User("", -1) shouldBe Left(nonEmptyListOf(UserProblem.EmptyName, UserProblem.NegativeAge(-1)))
}
