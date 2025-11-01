// This file was automatically generated from racing.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRacing05

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

suspend fun LocalCache.getCachedUsers(ids: NonEmptyList<UserId>): List<User> =
    ids.mapNotNull { id -> getUserOrNull(id) }

suspend fun getUserRacing(ids: NonEmptyList<UserId>): List<User> = racing {
    race { RemoteCache.getUsers(ids) }
    race(condition = { it.size == ids.size }) { LocalCache.getCachedUsers(ids) }
}
