// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption14

import arrow.core.Option
import arrow.core.raise.option
import arrow.core.toOption

typealias Email = String
typealias QueryParameters = Map<String, String>
typealias SendResult = Unit

@JvmInline value class UserId(val value: Int)
data class User(val id: UserId, val email: Email?)

fun QueryParameters.userId(): Option<UserId> =
  get("userId")?.toIntOrNull()?.let(::UserId).toOption()

fun findUserById(id: UserId): Option<User> = TODO()
fun sendEmail(email: Email): Option<SendResult> = TODO()

fun sendEmail(params: QueryParameters): Option<SendResult> = option {
  val userId = params.userId().bind()
  val user = findUserById(userId).bind()
  val email = ensureNotNull(user.email)
  sendEmail(email).bind()
}
