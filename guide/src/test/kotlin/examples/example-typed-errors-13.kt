// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors13

import arrow.core.raise.Raise
import arrow.core.raise.ensure
import arrow.core.raise.recover

data class User(val id: Long)
data class UserNotFound(val message: String)

suspend fun Raise<UserNotFound>.fetchUser(id: Long): User {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  return User(id)
}

object OtherError

suspend fun Raise<OtherError>.recovery(): User =
  recover({
    fetchUser(-1)
  }) { _: UserNotFound -> raise(OtherError) }
