// This file was automatically generated from typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors08

import arrow.core.Either
import arrow.core.catch
import arrow.core.raise.Raise
import arrow.core.raise.catch
import arrow.core.raise.fold
import arrow.core.right
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

data class MyError(val cause: Throwable)

suspend fun externalSystem(): Int = throw RuntimeException("Boom!")

suspend fun fallback(): Either<Nothing, Int> =
  Either.catch { externalSystem() }.catch { e: Throwable -> 1 }

suspend fun Raise<MyError>.error(): Int =
  catch({ externalSystem() }) { e: Throwable -> raise(MyError(e)) }

suspend fun main() {
  fallback() shouldBe 1.right()
  fold(
    { error() },
    { e: MyError -> e.cause.message shouldBe "Boom!" },
    { _: Int -> fail("A logical failure occurred!") }
  )
}
