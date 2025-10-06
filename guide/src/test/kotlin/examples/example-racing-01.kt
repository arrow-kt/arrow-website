// This file was automatically generated from racing.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRacing01

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

suspend fun getUserRacing(id: UserId): User = racing {
    race { RemoteCache.getUser(id) }
    race { LocalCache.getUser(id) }
}
