// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors15

import arrow.core.raise.Raise
import arrow.core.raise.ensure
import arrow.core.raise.recover
import io.kotest.matchers.shouldBe
import kotlin.experimental.ExperimentalTypeInference

sealed interface Lce<out E, out A> {
  object Loading : Lce<Nothing, Nothing>
  data class Content<A>(val value: A) : Lce<Nothing, A>
  data class Failure<E>(val error: E) : Lce<E, Nothing>
}

@JvmInline
value class LceRaise<E>(val raise: Raise<Lce<E, Nothing>>) : Raise<Lce<E, Nothing>> by raise {
  fun <A> Lce<E, A>.bind(): A =  when (this) {
    is Lce.Content -> value
    is Lce.Failure -> raise.raise(this)
    Lce.Loading -> raise.raise(Lce.Loading)
  }
}

@OptIn(ExperimentalTypeInference::class)
inline fun <E, A> lce(@BuilderInference block: LceRaise<E>.() -> A): Lce<E, A> =
  recover({ Lce.Content(block(LceRaise(this))) }) { e: Lce<E, Nothing> -> e }

fun example() {
  lce {
    val a = Lce.Content(1).bind()
    val b = Lce.Content(1).bind()
    a + b
  } shouldBe Lce.Content(2)

  lce {
    val a = Lce.Content(1).bind()
    ensure(a > 1) { Lce.Failure("a is not greater than 1") }
    a + 1
  } shouldBe Lce.Failure("a is not greater than 1")
}
