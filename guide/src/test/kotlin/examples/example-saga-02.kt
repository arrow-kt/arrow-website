// This file was automatically generated from saga.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSaga02

import io.kotest.matchers.shouldBe

import arrow.core.Either
import arrow.core.left
import arrow.core.raise.*
import arrow.atomic.AtomicInt
import arrow.resilience.*

val INITIAL_VALUE = 1

object Counter {
  val value = AtomicInt(INITIAL_VALUE)

  fun increment() {
    value.incrementAndGet()
  }

  fun decrement() {
    value.decrementAndGet()
  }
}

val PROBLEM = "problem detected!"

fun Raise<String>.transaction(): Saga<Int> = saga {
  saga({ Counter.increment() }) { Counter.decrement() }
  saga({ raise(PROBLEM) }) {}
  Counter.value.get()
}

suspend fun example() {
  // perform the transaction
  val result = either { transaction().transact() }
  result shouldBe PROBLEM.left()
  Counter.value.get() shouldBe INITIAL_VALUE
}
