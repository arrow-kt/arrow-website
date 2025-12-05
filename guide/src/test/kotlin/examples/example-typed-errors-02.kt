// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors02

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.left
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.AssertionErrorBuilder.Companion.fail
import io.kotest.matchers.shouldBe

object UserNotFound
data class User(val id: Long)

// wrapper type approach
val error: Either<UserNotFound, User> = UserNotFound.left()

// computation context approach
fun Raise<UserNotFound>.error(): User = raise(UserNotFound)
