// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors19

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.raise.either
import arrow.core.raise.ensure
import io.kotest.matchers.shouldBe

sealed interface UserProblem {
  object EmptyName: UserProblem
  data class NegativeAge(val age: Int): UserProblem
}

data class User private constructor(val name: String, val age: Int) {
  companion object {
    operator fun invoke(name: String, age: Int): Either<UserProblem, User> = either {
      ensure(name.isNotEmpty()) { UserProblem.EmptyName }
      ensure(age >= 0) { UserProblem.NegativeAge(age) }
      User(name, age)
    }
  }
}

fun example() {
  User("", -1) shouldBe Left(UserProblem.EmptyName)
}
