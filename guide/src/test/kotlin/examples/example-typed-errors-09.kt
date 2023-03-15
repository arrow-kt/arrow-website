// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors09

import arrow.core.Either
import arrow.core.catch
import arrow.core.raise.Raise
import arrow.core.raise.catch
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeTypeOf

suspend fun externalSystem(): Int = throw RuntimeException("Boom!")

data class OtherError(val cause: RuntimeException)

suspend fun error(): Either<OtherError, Int> =
  Either.catch { externalSystem() }.catch { e: RuntimeException -> raise(OtherError(e)) }

suspend fun Raise<Nothing>.fallback(): Int =
  catch({ externalSystem() }) { e: Throwable -> 1 }

suspend fun example() {
  error().shouldBeTypeOf<Either.Left<OtherError>>()
  fold(
    { fallback() },
    { _: Nothing -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
