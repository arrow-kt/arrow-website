// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.website.examples.exampleParallel02

import arrow.fx.coroutines.parMap
typealias UserId = Int
data class User(val name: String)
suspend fun getFriendIds(id: UserId): List<UserId> = listOf(1, 2, 3)
suspend fun getUserName(id: UserId): User = User("$id-name")

suspend fun getFriendNames(id: UserId): List<User> =
  getFriendIds(id).parMap { getUserName(it) }
