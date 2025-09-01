// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors01

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.right
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.fold
import io.kotest.assertions.AssertionErrorBuilder.Companion.fail
import io.kotest.matchers.shouldBe

object UserNotFound
data class User(val id: Long)

val user: Either<UserNotFound, User> = User(1).right()

fun Raise<UserNotFound>.user(): User = User(1)
