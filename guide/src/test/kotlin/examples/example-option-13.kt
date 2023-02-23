// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption13

import arrow.core.Option
import arrow.core.raise.nullable

typealias Email = String
typealias QueryParameters = Map<String, String>
typealias SendResult = Unit

@JvmInline value class UserId(val value: Int)
data class User(val id: UserId, val email: Email?)

fun QueryParameters.userId(): UserId? = get("userId")?.toIntOrNull()?.let { UserId(it) }
fun findUserById(id: UserId): Option<User> = TODO()
fun sendEmail(email: Email): SendResult? = TODO()

fun sendEmail(params: QueryParameters): SendResult? = nullable {
  val userId = ensureNotNull(params.userId())
  val user = findUserById(userId).bind()
  val email = user.email.bind()
  sendEmail(email)
}
