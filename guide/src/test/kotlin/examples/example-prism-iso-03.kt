// This file was automatically generated from prism-iso.md by Knit tool. Do not edit.
package arrow.website.examples.examplePrismIso03

import io.kotest.matchers.shouldBe

import arrow.optics.*

@optics data class Person(val name: String, val age: Age): User {
  companion object
}

@JvmInline @optics value class Age(val age: Int)

fun User.happyBirthday() =
  User.person.age.age.modify(this) { it + 1 }
