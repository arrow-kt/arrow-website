// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors10

import arrow.core.Either
import arrow.core.left
import arrow.core.getOrElse
import arrow.core.raise.ensure
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.recover
import io.kotest.assertions.AssertionErrorBuilder.Companion.fail
import io.kotest.matchers.shouldBe

data class User(val id: Long)
data class UserNotFound(val message: String)

// wrapper type approach
suspend fun fetchUser(id: Long): Either<UserNotFound, User> = either {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  User(id)
}

// computation context approach
suspend fun Raise<UserNotFound>.fetchUser(id: Long): User {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  return User(id)
}

suspend fun example() {
  // wrapper type approach
  fetchUser(-1)
    .getOrElse { e: UserNotFound -> null } shouldBe null
  
  // computation context approach
  recover({
    fetchUser(1)
  }) { e: UserNotFound -> null } shouldBe User(1)
}
