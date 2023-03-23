// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors01

import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.right
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object UserNotFound
data class User(val id: Long)

val user: Either<UserNotFound, User> = User(1).right()

fun Raise<UserNotFound>.user(): User = User(1)

val res = either { user() }

fun Raise<UserNotFound>.res(): User = user.bind()

fun example() {
  when (res) {
    is Left -> fail("No logical failure occurred!")
    is Right -> res.value shouldBe User(1)
  }

  fold(
    block = { res() },
    recover = { _: UserNotFound -> fail("No logical failure occurred!") },
    transform = { i: User -> i shouldBe User(1) }
  )
}
