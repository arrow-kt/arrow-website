---
sidebar_position: 4
---

# Racing

<!--- TEST_NAME RacingTest -->

The ["coroutines standard library"](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
offers [Select](), but often a higher level DSL is desired.
For example, when _racing_ for the _first success value_ and cancelling the others. Or, when you want to easily combine
it with typed errors.

:::info

Arrow Fx makes it easier to follow
the [Structured Concurrency](https://kotlinlang.org/docs/composing-suspending-functions.html#structured-concurrency-with-async)
rules, even when the logic grows more complex.

:::

:::note Where to find it

High-level concurrency is part of the `arrow-fx-coroutines` library.

:::

## Race for the first success value

We often have independent computations that we want to _race_ against each other in parallel,
but we only care about the first one to succeed. For example, getting a value from different locations,
or getting the first result from a list of services. This is the desired behavior:

- The first value produced by a racer _wins_ the race.
- All exceptions need to be logged but not _win_ the race, they need to _await_ the race.
- When the race is finished, all racers need to be canceled before returning the winning value. This guarantees all
  acquired resources are closed whilst trying to return the success value as soon as possible.

Let's first see how we'd write this example with `select`, and how we can rewrite it with Arrow Fx Coroutines.

<!--- INCLUDE
import arrow.fx.coroutines.racing
import arrow.fx.coroutines.race
import arrow.core.NonFatal
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.cancelChildren
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.job
import kotlinx.coroutines.selects.select
import kotlin.coroutines.cancellation.CancellationException
import kotlin.random.Random

typealias UserId = Int

data class User(val name: String)

class BadRequestException(message: String? = null, cause: Throwable? = null) : Exception(message, cause)
-->

```kotlin
object RemoteCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-remote-user") else throw BadRequestException()
}

object LocalCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-local-user") else throw NullPointerException()
}

suspend fun <A> awaitAfterError(block: suspend () -> A): A = try {
    block()
} catch (e: Throwable) {
    if (e is CancellationException || NonFatal(e)) throw e
    e.printStackTrace()
    awaitCancellation()
}

suspend fun getRemoteUser(id: UserId): User = coroutineScope {
    try {
        select {
            async { awaitAfterError { RemoteCache.getUser(id) } }.onAwait { it }
            async { awaitAfterError { LocalCache.getUser(id) } }.onAwait { it }
        }
    } finally {
        coroutineContext.job.cancelChildren()
    }
}
```

The snippet above handles four important edge cases:

- `coroutineScope { }` ensures that all active coroutines are completed before returning.
- `try/finally`: When `select` returns we need to always cancel all still active running coroutines instead of waiting
  for them to be finished. This is crucial otherwise we would still await _all_ values, and that would defeat the
  purpose of racing.

- `awaitAfterError`: When an error occurs in a participant during racing, they are often considered _losers_, and must
  await the race to be finished. Since the _winner_ cancels the race, this can be achieved by `awaitCancellation`.
    - `e.prinStacktrace()`: When an error occurs in a participant during racing, they are often considered _losers_,
      however, its typically not desired this information disappears so some form of error handling strategy is needed.
    - `e is CancellationException || e.isFatal()`: We should never recover from `CancellationException`, nor should we
      recover from fatal exceptions like `OutOfMemoryException`.

The process of setting up this racing logic is a bit low-level, and complex. So unless for specific needs, we often
prefer a higher level DSL. Arrow offers a simpler `racing` DSL on top of `select` that guarantees these semantics.

```kotlin
suspend fun getUserRacing(id: UserId): User = racing {
    race { RemoteCache.getUser(id) }
    race { LocalCache.getUser(id) }
}
```

<!--- KNIT example-racing-01.kt -->

This snippet is significantly simpler, and less error-prone. Initially, it seems we've lost a lot of flexibility, but
let's see what else the Arrow DSL has to offer.

:::warning

If all racers thrown an exception then the `racing` block will hang forever waiting for a success value.

:::

#### Timeout

Hanging is common with racing if everything fails. Therefore, it's common to include a timeout.

<!--- INCLUDE
import arrow.fx.coroutines.racing
import arrow.fx.coroutines.race
import kotlinx.coroutines.delay
import java.util.concurrent.TimeoutException
import kotlin.random.Random
import kotlin.time.Duration.Companion.milliseconds

typealias UserId = Int

data class User(val name: String)

class BadRequestException(message: String? = null, cause: Throwable? = null) : Exception(message, cause)

object RemoteCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-remote-user") else throw BadRequestException()
}

object LocalCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-local-user") else throw NullPointerException()
}
-->

```kotlin
suspend fun getUserRacing(id: UserId): User = racing {
    race { RemoteCache.getUser(id) }
    race { LocalCache.getUser(id) }
    race {
        delay(10.milliseconds)
        throw TimeoutException()
    }
}
```

<!--- KNIT example-racing-02.kt -->

Here we simply use a `delay` inside of the `race { }` block, and return a default value after the `delay` (timeout)
finishes. In this case we throw `UserRaceException` but we could've also returned `null`, `Either.Right`, or `raise`.

#### Allowing exceptions to win the race

Sometimes ignoring all exceptions is not desired, and certain participants are allowed to have their exception to win
the race. For example, in case when `LocalCache` returns fast in the success cache hit occurs, but slow with a cache
miss.`RemoteCache` could finish the race faster with `BadRequest` or `Unauthorized`. Beware that `HttpClient` might
still fail before a successful cache hit occurs like `ConnectException`.

<!--- INCLUDE
import arrow.fx.coroutines.racing
import arrow.fx.coroutines.race
import arrow.core.NonFatal
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.selects.select
import kotlin.coroutines.cancellation.CancellationException
import kotlin.random.Random

typealias UserId = Int

data class User(val name: String)

class BadRequestException(message: String? = null, cause: Throwable? = null) : Exception(message, cause)

object RemoteCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-remote-user") else throw BadRequestException()
}

object LocalCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-local-user") else throw NullPointerException()
}
-->

```kotlin
suspend fun getUserRacing(id: UserId): User = racing {
    raceOrThrow { RemoteCache.getUser(id) }
    race { LocalCache.getUser(id) }
}
```

<!--- KNIT example-racing-03.kt -->

#### Race until a certain condition is met

Sometimes we need to race not only until a value is produced, but also that it needs to meet certain conditions.
For example, when we need to retrieve a `NonEmptyList<UserId>`.

<!--- INCLUDE
import arrow.core.NonEmptyList
import arrow.fx.coroutines.racing
import arrow.fx.coroutines.race
import kotlin.random.Random

typealias UserId = Int

data class User(val name: String)

class BadRequestException(message: String? = null, cause: Throwable? = null) : Exception(message, cause)

object RemoteCache {
    suspend fun getUsers(ids: NonEmptyList<UserId>): List<User> =
        if (Random.nextBoolean()) ids.map { User("$it-remote-user") } else throw BadRequestException()
}

object LocalCache {
    suspend fun getUser(id: UserId): User = getUserOrNull(id) ?: throw NullPointerException()

    suspend fun getUserOrNull(id: UserId): User? = 
        if (Random.nextBoolean()) User("$id-local-user") else null
}
-->

```kotlin
suspend fun LocalCache.getCachedUsers(ids: NonEmptyList<UserId>): List<User> =
    ids.mapNotNull { id -> getUserOrNull(id) }

suspend fun getUserRacing(ids: NonEmptyList<UserId>): List<User> = racing {
    race { RemoteCache.getUsers(ids) }
    race(condition = { it.size == ids.size }) { LocalCache.getCachedUsers(id) }
}
```

<!--- KNIT example-racing-04.kt -->

Since `getCachedUsers` ignores missing cached values we need to make sure the result from our cache matches the amount
requested ids. We can easily do so by adding a `condition` check in our `race` to verify `it.size == ids.size`.

:::warning

If all racers fail, or do not meet the `condition` then the `racing` block will hang forever waiting for a success
value.

:::

#### Custom Exception Handling

By default, the strategy for unhandled exceptions is `Throwable::printStackTrace`, but it attempts to use any installed
`CoroutineExceptionHandler`. So in the case of Ktor it will be using the Ktor's default`CoroutineExceptionHandler`.
It can easily be overridden by explicitly using `withContext` to install a `CoroutineExceptionHandler`.

<!--- INCLUDE
import arrow.fx.coroutines.racing
import arrow.fx.coroutines.race
import arrow.core.NonFatal
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.selects.select
import kotlin.coroutines.cancellation.CancellationException

typealias UserId = Int

data class User(val name: String)

class BadRequestException(message: String? = null, cause: Throwable? = null) : Exception(message, cause)

object RemoteCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-remote-user") else throw BadRequestException()
}

object LocalCache {
    suspend fun getUser(id: UserId): User =
        if (Random.nextBoolean()) User("$id-local-user") else throw NullPointerException()
}
-->

```kotlin
suspend fun customErrorHandling(): String =
    withContext(CoroutineExceptionHandler { ctx, t -> t.printStackTrace() }) {
        racing {
            race {
                delay(2.seconds)
                throw RuntimeException("$it - boom")
            }
            race {
                delay(10.seconds)
                "Winner!"
            }
        }
    }
```

<!--- KNIT example-racing-05.kt -->

### Working with Raise

Since `Raise` does not have any straight-forward fallback way of handling errors by default it will 
