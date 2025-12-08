// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors04

import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensureNotNull
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.AssertionErrorBuilder.Companion.fail
import io.kotest.matchers.shouldBe

data class User(val id: Long)
data class UserNotFound(val message: String)

// wrapper type approach
fun process(user: User?): Either<UserNotFound, Long> = either {
  ensureNotNull(user) { UserNotFound("Cannot process null user") }
  user.id // smart-casted to non-null
}

// computation context approach
fun Raise<UserNotFound>.process(user: User?): Long {
  ensureNotNull(user) { UserNotFound("Cannot process null user") }
  return user.id // smart-casted to non-null
}

fun example() {
  process(null) shouldBe UserNotFound("Cannot process null user").left()

  fold(
    { process(User(1)) },
    { _: UserNotFound -> fail("No logical failure occurred!") },
    { i: Long -> i shouldBe 1L }
  )
}
