// This file was automatically generated from saga.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSaga01

import io.kotest.matchers.shouldBe

import arrow.core.Either
import arrow.core.left

import arrow.atomic.AtomicInt
import arrow.fx.resilience.*

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

val PROBLEM = Throwable("problem detected!")

// describe the transaction
val transaction: Saga<Int> = saga {
  saga({
    // action to perform
    Counter.increment()
  }) {
    // inverse action for rolling back
    Counter.decrement()
  }
  saga({
    throw PROBLEM
  }) {}
  // final value of the saga
  Counter.value.get()
}

suspend fun example() {
  // perform the transaction
  val result = Either.catch { transaction.transact() }
  result shouldBe PROBLEM.left()
  Counter.value.get() shouldBe INITIAL_VALUE
}
