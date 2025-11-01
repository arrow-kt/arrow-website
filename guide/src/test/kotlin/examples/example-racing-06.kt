// This file was automatically generated from racing.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRacing06

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
