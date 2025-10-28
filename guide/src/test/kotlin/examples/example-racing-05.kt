// This file was automatically generated from racing.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRacing05

import arrow.fx.coroutines.racing
import arrow.fx.coroutines.race
import arrow.core.NonFatal
import kotlinx.coroutines.CoroutineExceptionHandler
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitCancellation
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.selects.select
import kotlinx.coroutines.withContext
import kotlin.coroutines.cancellation.CancellationException
import kotlin.random.Random
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

suspend fun customErrorHandling() =
    withContext(CoroutineExceptionHandler { ctx, t -> t.printStackTrace() }) {
        racing {
            repeat(10) {
                race { throw RuntimeException("$it - boom") }
            }
            race { delay(10.seconds) }
        }
    }
