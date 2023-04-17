// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors14

import arrow.core.Either
import arrow.core.raise.catch
import arrow.core.raise.Raise
import java.sql.SQLException

object UsersQueries {
  fun insert(username: String, email: String): Long = 1L
}

fun SQLException.isUniqueViolation(): Boolean = true

data class UserAlreadyExists(val username: String, val email: String)

suspend fun Raise<UserAlreadyExists>.insertUser(username: String, email: String): Long =
  catch({
    UsersQueries.insert(username, email)
  }) { e: SQLException ->
    if (e.isUniqueViolation()) raise(UserAlreadyExists(username, email))
    else throw e
  }

suspend fun insertUser(username: String, email: String): Either<UserAlreadyExists, Long> =
  Either.catchOrThrow<SQLException, Long> {
    UsersQueries.insert(username, email)
  }.mapLeft { e ->
    if (e.isUniqueViolation()) UserAlreadyExists(username, email)
    else throw e
  }
