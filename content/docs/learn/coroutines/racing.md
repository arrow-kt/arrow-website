---
sidebar_position: 2
---

# Racing

<!--- TEST_NAME RacingTest -->

The [parallelism operators](/learn/coroutines/parallel) describe the cases in which we are interested in the result
of _every_ computation we perform. But imagine the scenario where we want to
download a file, but we try two servers simultaneously for resilience purposes. 
Once we get the file from one server, we're not really interested in the 
rest. This is an example of **racing** two computations.

This is an key point in racing: we only care about the **first value** to **succeed**.
But that is too abstract, the desired behavior should match the following:

- The first value produced by a racer _wins_ the race.
- All exceptions need to be logged but not _win_ the race, they need to _await_ the race.
- When the race is finished, all racers need to be canceled before returning the winning value. This guarantees all
  acquired resources are closed whilst trying to return the success value as soon as possible.

## Simple racing

For the simpler cases,
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
<!--- KNIT example-racing-01.kt -->

The example above shows a typical pattern combined with `raceN`.
The result of the function above is `Either<A, B>`, with each type
corresponding to one branch in `raceN`. Since we have two computations that
return the same type here and don't care which one "wins," we conflate both into
a single value.

## Using `select`

The ["coroutines standard library"](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
offers [select expressions](https://kotlinlang.org/docs/select-expression.html), but often a higher level DSL is desired.
For example, when _racing_ for the _first success value_ and cancelling the others. Or, when you want to easily combine
it with typed errors.

Let's first see how we'd write this example with `select`, and how we can rewrite it with Arrow Fx Coroutines.
You don't need to understand the whole code to keep reading, but it provides a good explanation of the difficulties of racing.

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

## Racing DSL (experimental)

:::warning

The functionality described in this section is experimental.
Although the basic concepts shall remain, we may tweak the API in the future.

:::

The process of setting up this racing logic is a bit low-level, and complex. So unless for specific needs, we often
prefer a higher level DSL. Arrow offers a simpler `racing` DSL on top of `select` that guarantees these semantics.

```kotlin
suspend fun getUserRacing(id: UserId): User = racing {
    race { RemoteCache.getUser(id) }
    race { LocalCache.getUser(id) }
}
```

<!--- KNIT example-racing-02.kt -->

This snippet is significantly simpler, and less error-prone. Initially, it seems we've lost a lot of flexibility, but
let's see what else the Arrow DSL has to offer.

:::info

If all racers thrown an exception then the `racing` block will hang **forever** waiting for a success value.

:::

### Timeout

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

<!--- KNIT example-racing-03.kt -->

Here we simply use a `delay` inside of the `race { }` block, and return a default value after the `delay` (timeout)
finishes. In this case we throw `UserRaceException` but we could've also returned `null`, `Either.Right`, or `raise`.

### Allow exceptions to win

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
    raceOrFail { RemoteCache.getUser(id) }
    race { LocalCache.getUser(id) }
}
```

<!--- KNIT example-racing-04.kt -->

### Race until a certain condition

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
    race(condition = { it.size == ids.size }) { LocalCache.getCachedUsers(ids) }
}
```

<!--- KNIT example-racing-05.kt -->

Since `getCachedUsers` ignores missing cached values we need to make sure the result from our cache matches the amount
requested ids. We can easily do so by adding a `condition` check in our `race` to verify `it.size == ids.size`.

:::info

If all racers fail, or do not meet the `condition` then the `racing` block will hang **forever** waiting for a success
value.

:::

### Custom exception handling

By default, the strategy for unhandled exceptions is `Throwable::printStackTrace`, but it attempts to use any installed
`CoroutineExceptionHandler`. So in the case of Ktor it will be using the Ktor's default`CoroutineExceptionHandler`.
It can easily be overridden by explicitly using `withContext` to install a `CoroutineExceptionHandler`.

<!--- INCLUDE
import arrow.fx.coroutines.racing
import arrow.fx.coroutines.race
import arrow.core.NonFatal
import kotlin.random.Random
import kotlinx.coroutines.*
import kotlinx.coroutines.selects.select
import kotlin.coroutines.cancellation.CancellationException
import kotlin.time.Duration.Companion.seconds

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
                throw RuntimeException("boom!")
            }
            race {
                delay(10.seconds)
                "Winner!"
            }
        }
    }
```

<!--- KNIT example-racing-06.kt -->

### Integration with typed errors

For the purposes of racing, using `raise` has the same effects as throwing
an exception. That means that if you want the error to propagate you need
to use `raceOrFail`; otherwise that computation does not count as successful.
