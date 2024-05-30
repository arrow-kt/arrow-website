// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.website.examples.exampleParallel03

import arrow.fx.coroutines.parZip
import arrow.fx.coroutines.await.awaitAll
typealias UserId = Int
data class User(val name: String, val avatar: String)
suspend fun getUserName(id: UserId): String = "$id-name"
suspend fun getAvatar(id: UserId): String = "$id-avatar"

suspend fun getUser(id: UserId): User = awaitAll {
  val name = async { getUserName(id) }
  val avatar = async { getAvatar(id) }
  User(name.await(), avatar.await())
}
