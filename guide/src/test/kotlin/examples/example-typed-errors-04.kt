// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors04

import arrow.core.raise.Raise
import arrow.core.raise.ensure

data class User(val id: Long)
data class UserNotFound(val message: String)

context(Raise<UserNotFound>)
fun User.isValid(): Unit =
  ensure(id > 0) { UserNotFound("User without a valid id: $id") }
