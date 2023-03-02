// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption12

typealias Email = String
typealias QueryParameters = Map<String, String>
typealias SendResult = Unit

@JvmInline value class UserId(val value: Int)
data class User(val id: UserId, val email: Email?)

fun QueryParameters.userId(): UserId? = get("userId")?.toIntOrNull()?.let { UserId(it) }
fun findUserById(id: UserId): User? = TODO()
fun sendEmail(email: Email): SendResult? = TODO()

fun sendEmail(params: QueryParameters): SendResult? =
  params.userId()?.let { userId ->
    findUserById(userId)?.email?.let { email ->
      sendEmail(email)
    }
  }
