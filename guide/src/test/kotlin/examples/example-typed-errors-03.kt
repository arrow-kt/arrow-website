// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors03

import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensure
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.AssertionErrorBuilder.Companion.fail
import io.kotest.matchers.shouldBe

data class User(val id: Long)

data class UserNotFound(val message: String)

fun User.isValid(): Either<UserNotFound, Unit> = either {
  ensure(id > 0) { UserNotFound("User without a valid id: $id") }
}

fun Raise<UserNotFound>.isValid(user: User): User {
  ensure(user.id > 0) { UserNotFound("User without a valid id: ${user.id}") }
  return user
}

fun example() {
  User(-1).isValid() shouldBe UserNotFound("User without a valid id: -1").left()

  fold(
    { isValid(User(1)) },
    { _: UserNotFound -> fail("No logical failure occurred!") },
    { user: User -> user.id shouldBe 1 }
  )
}
