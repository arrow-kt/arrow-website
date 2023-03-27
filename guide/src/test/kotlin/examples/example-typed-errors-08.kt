// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors08

import arrow.core.Either
import arrow.core.left
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.core.recover
import arrow.core.right
import io.kotest.matchers.shouldBe

data class User(val id: Long)
data class UserNotFound(val message: String)

fun fetchUser(id: Long): Either<UserNotFound, User> = either {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  User(id)
}

fun Raise<UserNotFound>.fetchUser(id: Long): User {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  return User(id)
}

object OtherError

fun example() {
  val either: Either<OtherError, User> =
    fetchUser(1)
      .recover { _: UserNotFound -> raise(OtherError) }
  
  either shouldBe User(1).right()

  fetchUser(-1)
    .recover { _: UserNotFound -> raise(OtherError) } shouldBe OtherError.left()
}
