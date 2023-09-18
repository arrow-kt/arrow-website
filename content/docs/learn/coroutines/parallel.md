---
sidebar_position: 1
---

# High-level concurrency

<!--- TEST_NAME ParallelTest -->

[Coroutines](https://kotlinlang.org/docs/coroutines-guide.html) are one of the
most interesting features of Kotlin. However, the ["coroutines standard library"](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
sometimes falls short, especially when dealing with many
suspended computations. Arrow provides those few additional functions that have
proven useful in Kotlin code and other programming communities.

:::info

Arrow Fx makes it easier to follow the [Structured Concurrency](https://kotlinlang.org/docs/composing-suspending-functions.html#structured-concurrency-with-async)
rules, even when the logic grows more complex.

:::

## Independently, in parallel

We often have independent computations that we want to perform in parallel.
For example, if we need to fetch a value from the database and download a file
from another service, there's no reason why we shouldn't do them concurrently.
We can use `parZip` (PARallel ZIP) to combine the execution of both computations.

<!--- INCLUDE
import arrow.fx.coroutines.parZip
typealias UserId = Int
data class User(val name: String, val avatar: String)
suspend fun getUserName(id: UserId): String = "$id-name"
suspend fun getAvatar(id: UserId): String = "$id-avatar"
-->
```kotlin
suspend fun getUser(id: UserId): User =
  parZip(
    { getUserName(id) },
    { getAvatar(id) }
  ) { name, avatar -> User(name, avatar) }
```
<!--- KNIT example-parallel-01.kt -->

The code above showcases how `parZip` is used: we have a sequence of arguments
representing each of the computations to perform, and, at the end, one final
block (usually written in trailing form) that specifies what to do with the
results of those computations. In this case, the two arguments obtain the name
and avatar, and the block puts them together in the `User` type.

:::tip

Using `parZip` is essential not only for its high-level view on concurrency.
Its implementation also takes care of the complex task of propagating exceptions
and canceling running computations whenever one of the tasks fails.

:::

In the code above, we had a fixed sequence of computations to perform in parallel.
In other cases, those computations depend on some form of _collection_; for example,
we want to obtain the name of all a user's friends. Arrow provides `parMap` (PARallel MAP)
for that use case.

<!--- INCLUDE
import arrow.fx.coroutines.parMap
typealias UserId = Int
data class User(val name: String)
suspend fun getFriendIds(id: UserId): List<UserId> = listOf(1, 2, 3)
suspend fun getUserName(id: UserId): User = User("$id-name")
-->
```kotlin
suspend fun getFriendNames(id: UserId): List<User> =
  getFriendIds(id).parMap { getUserName(it) }
```
<!--- KNIT example-parallel-02.kt -->

One potential problem with `parMap` is that we may have _too much_ concurrency
if the amount of elements in the collection is too significant. To fight against this
problem, Arrow provides a version of `parMap` with an additional parameter that
tells how many computations should be dispatched in parallel.

### Flows

The [`parMap`](https://apidocs.arrow-kt.io/arrow-fx-coroutines/arrow.fx.coroutines/par-map.html)
function is also provided for [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/).
If the concurrency factor is more than 1, then inner flows are collected by this operator concurrently.
When this factor is one, calling `parMap` is identical to calling `map` on the flow.

Additional performance can be gained if we don't impose the same ordering on
the mapping output as the one in the source flow. Just call [`parMapUnordered`](https://apidocs.arrow-kt.io/arrow-fx-coroutines/arrow.fx.coroutines/par-map-unordered.html)
in that case. As with `parMap`, the concurrency factor defines how many
computations should be executed concurrently at most.

## Racing

The `parX` operators describe the cases in which we are interested in the result
of _every_ computation we perform. But imagine the scenario in which we want to
download a file, but we try two servers simultaneously for resilience purposes. Once we get the file from one server, we're not really interested in the 
rest. This is an example of **racing** two computations.

Arrow provides functions that perform racing over 2 or 3 computations, with the
option of customizing the coroutine context.

<!--- INCLUDE
import arrow.core.merge
import arrow.fx.coroutines.raceN
suspend fun downloadFrom(url: String): Unit = Unit
-->
```kotlin
suspend fun file(server1: String, server2: String) =
  raceN(
    { downloadFrom(server1) },
    { downloadFrom(server2) }
  ).merge()
```
<!--- KNIT example-parallel-03.kt -->

The example above shows a typical pattern combined with `raceN`.
The result of the function above is `Either<A, B>`, with each type
corresponding to one branch in `raceN`. Since we have two computations that
return the same type here and don't care which one "wins," we conflate both into
a single value.

## Integration with typed errors

Arrow's typed errors can seamlessly integrate with the Arrow Fx Coroutines operators while supporting the patterns of structured concurrency.
The subtleties lie in the ordering of the DSLs and how they affect the _cancellation_ of scopes of structured concurrency -and error handling.
So you must understand how cancellation works in [Structured Concurrency](https://kotlinlang.org/docs/cancellation-and-timeouts.html).

<!--- INCLUDE
import arrow.core.raise.either
import arrow.fx.coroutines.parZip
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.delay
-->
```kotlin
suspend fun logCancellation(): Unit = try {
  println("Sleeping for 500 milliseconds ...")
  delay(500)
} catch (e: CancellationException) {
  println("Sleep was cancelled early!")
  throw e
}
```

When we nest the `Raise` DSL inside the Arrow Fx Coroutines operators lambdas, the errors will remain _inside_ the lambdas. Thus, they will _not_ affect any of the regular behavior.
For example, if we compute `Either` values inside the `parZip`, any occurred _typed error_ will not affect the other computations. 

```kotlin
suspend fun example() {
  val triple = parZip(
    { either<String, Unit> { logCancellation() } },
    { either<String, Unit> { delay(100); raise("Error") } },
    { either<String, Unit> { logCancellation() } }
  ) { a, b, c -> Triple(a, b, c) }
  println(triple)
}
```
<!--- KNIT example-parallel-04.kt -->

```text
Sleeping for 500 milliseconds ...
Sleeping for 500 milliseconds ...
(Either.Right(kotlin.Unit), Either.Left(Error), Either.Right(kotlin.Unit))
```
<!--- TEST -->

:::danger

Using typed errors with KotlinX Flow is prone to leaking the `raise` DSL scope and should be used carefully.
More information can be found in the [typed errors documentation](../../typed-errors).

:::

### Cancellation on Raise

In contrast, when we nest Arrow Fx Coroutines operators inside the `Raise` DSL, the errors will be observed by Structured Concurrency.
_typed errors_ follow the same rules as [Structured Concurrency](https://kotlinlang.org/docs/cancellation-and-timeouts.html), and behave the same as `CancellationException` since they _short-circuit_ the computation.

As shown above, `parZip` allows running _independent_ tasks in parallel. If any of the tasks fail, the other tasks will get canceled.
The same semantics are also guaranteed when composing `parZip` with typed errors.

The example below shows 3 `task` running in parallel, and according to the `task` implementation, the `TaskId` 2 will fail.

<!--- INCLUDE
import kotlinx.coroutines.delay
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.fx.coroutines.parZip
import kotlin.time.Duration.Companion.milliseconds
import kotlin.coroutines.cancellation.CancellationException

suspend fun logCancellation(): Unit = try {
  println("Sleeping for 500 milliseconds ...")
  delay(500)
} catch (e: CancellationException) {
  println("Sleep was cancelled early!")
  throw e
}
-->
```kotlin
suspend fun example() {
  val res = either {
    parZip(
      { logCancellation() } ,
      { delay(100); raise("Error") },
      { logCancellation() }
    ) { a, b, c -> Triple(a, b, c) }
  }
  println(res)
}
```
<!--- KNIT example-parallel-05.kt -->

In the output, we can see that tasks `1` and `3` started, but `2` _raised_ an error that triggered the cancellation of the other two tasks.
After tasks `1` and `3` are canceled, we see that the result of `raise` is returned and prints the error message.

```text
Sleeping for 500 milliseconds ...
Sleeping for 500 milliseconds ...
Sleep was cancelled early!
Sleep was cancelled early!
Either.Left(Error)
```
<!--- TEST -->

Similarly, we can apply the same pattern to `parMap` when working with collections, where we want all tasks to be canceled if any of them fails.

<!--- INCLUDE
import kotlinx.coroutines.delay
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.fx.coroutines.parMap
import kotlin.coroutines.cancellation.CancellationException

suspend fun logCancellation(): Unit = try {
  println("Sleeping for 500 milliseconds ...")
  delay(500)
} catch (e: CancellationException) {
  println("Sleep was cancelled early!")
  throw e
}
-->
```kotlin
suspend fun Raise<String>.failOnEven(i: Int): Unit {
  ensure(i % 2 != 0) { delay(100); "Error" }
  logCancellation()
}

suspend fun example() {
  val res = either {
    listOf(1, 2, 3, 4).parMap { failOnEven(it) }
  }
  println(res)
}
```
<!--- KNIT example-parallel-06.kt -->

The example transforms, or maps, every element of an `Iterable` `[1, 2, 3, 4]` in _parallel_ using `parMap` and `failOnEven`.
Since `failOnEven` raises an error when the `Int` is even, it fails for inputs 2 and 4, and the other two coroutines are canceled.

```text
Sleeping for 500 milliseconds ...
Sleeping for 500 milliseconds ...
Sleep was cancelled early!
Sleep was cancelled early!
Either.Left(Error)
```
<!--- TEST -->

### Accumulating typed errors in parallel

Arrow Fx Coroutines also provides a way to accumulate errors in parallel.
If we want to run tasks in parallel but accumulate all errors instead of short-circuiting, we can use `parMapOrAccumulate`.
It works the same as `parMap` from our previous example, but instead of canceling the other coroutines when one fails, it accumulates the errors.
So no matter how many coroutines fail, all of them will run to completion.

```kotlin
suspend fun example() {
  val res = listOf(1, 2, 3, 4)
    .parMapOrAccumulate { failOnEven(it) }
  println(res)
}
```

```text
Sleeping for 500 milliseconds ...
Sleeping for 500 milliseconds ...
Either.Left(NonEmptyList(Error, Error))
```
