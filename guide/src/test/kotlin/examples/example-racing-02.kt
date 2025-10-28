// This file was automatically generated from racing.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRacing02

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

suspend fun getUserRacing(id: UserId): User = racing {
    race { RemoteCache.getUser(id) }
    race { LocalCache.getUser(id) }
    race {
        delay(10.milliseconds)
        throw TimeoutException()
    }
}
