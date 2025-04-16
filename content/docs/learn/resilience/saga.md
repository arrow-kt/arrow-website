---
sidebar_position: 4
---

# Saga

In a distributed system, sometimes you need a concept similar to a _transaction_
in a database. That is, several operations spanning different microservices
must succeed or fail as a unit; otherwise, we may end up in an inconsistent state.
A **saga** implements this concept by providing for each action a corresponding
_compensating_ action, which is executed if any of the following steps fail.
The role of the compensating action is to undo any changes performed by the
action, hence taking the system back to the state before the entire operation
began its execution.

:::info Additional context for this pattern

[Saga distributed transactions pattern](https://learn.microsoft.com/en-us/azure/architecture/reference-architectures/saga/saga)
in _Cloud Design Patterns_.

:::

<!--- TEST_NAME Saga -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
-->

Arrow Resilience provides the [`saga`](https://apidocs.arrow-kt.io/arrow-resilience/arrow.resilience/saga.html)
function, which creates a new scope where compensating actions can be declared
alongside the action to perform. This is done by the [`saga` function in
`SagaScope`](https://apidocs.arrow-kt.io/arrow-resilience/arrow.resilience/-saga-scope/saga.html).
The resulting `Saga<A>` doesn't perform any actions, though; you need to call
[`transact`](https://apidocs.arrow-kt.io/arrow-resilience/arrow.resilience/transact.html)
to keep the chain going.

Let's use a small counter as an example, which we implement using the
[`Atomic`](../../coroutines/concurrency-primitives/#atomic) type provided
by Arrow.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
-->

```kotlin
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
```

Now we create a saga with a couple of operations. The first one increments the
counter, so the compensating action must be to decrement it. The second action
simply fails; we include no compensation because we know that part is never
reached.

```kotlin
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
```

Executing the transaction gives the expected results:

- The exception raised in the second step bubbles up to the caller of
  `transact`. In this case, we use `Either.catch` to turn it into `Either`.
- The counter has been correctly decremented as part of the compensation
  process in the saga.

```kotlin
suspend fun example() {
  // perform the transaction
  val result = Either.catch { transaction.transact() }
  result shouldBe PROBLEM.left()
  Counter.value.get() shouldBe INITIAL_VALUE
}
```
<!--- KNIT example-saga-01.kt -->
<!--- TEST assert -->

In the example above the failure of a step is signalled by throwing an
exception. `Saga` also integrates with Arrow's
[`Raise`](https://arrow-kt.io/learn/typed-errors/working-with-typed-errors/).

<!--- INCLUDE
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
-->

```kotlin
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
```
<!--- KNIT example-saga-02.kt -->
<!--- TEST assert -->

:::info Saga and [Resource](../../coroutines/resource-safety/)

`SagaScope` has many parallels with `ResourceScope`: both ensure that some
operations are performed at a certain point, and `saga` and `install` require
an action that "undoes" something. The main difference is that `ResourceScope`
**always** runs the release actions, whereas `SagaScope` only runs compensation
**if** the entire action fails.

:::

:::tip Saga and [STM](../../coroutines/stm/)

If you need to perform several actions as a unit over **local** data,
[Software Transactional Memory](../../coroutines/stm/) is a better tool than
Sagas and Atomic references.

:::
