// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.website.examples.exampleParallel01

import arrow.fx.coroutines.parZip
typealias UserId = Int
data class User(val name: String, val avatar: String)
suspend fun getUserName(id: UserId): String = "$id-name"
suspend fun getAvatar(id: UserId): String = "$id-avatar"

suspend fun getUser(id: UserId): User =
  parZip(
    { getUserName(id) },
    { getAvatar(id) }
  ) { name, avatar -> User(name, avatar) }
