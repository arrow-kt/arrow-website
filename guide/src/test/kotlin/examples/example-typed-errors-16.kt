// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors16

import arrow.core.Either
import arrow.core.left
import arrow.core.mapOrAccumulate
import arrow.core.raise.either
import arrow.core.raise.ensureNotNull
import arrow.core.raise.Raise
import io.kotest.matchers.shouldBe

data class MyError(val message: String)

fun Raise<MyError>.isEven(i: Int): Int =
  ensureNotNull(i.takeIf { i % 2 == 0 }) { MyError("$i is not even") }

fun isEven2(i: Int): Either<MyError, Int> =
  either { isEven(i) }

operator fun MyError.plus(second: MyError): MyError =
  MyError(message + ", ${second.message}")

val error = MyError("1 is not even, 3 is not even, 5 is not even, 7 is not even, 9 is not even").left()

fun example() {
  (1..10).mapOrAccumulate(MyError::plus) { isEven(it) } shouldBe error
  (1..10).mapOrAccumulate(MyError::plus) { isEven2(it).bind() } shouldBe error
}
