// This file was automatically generated from optional-prism.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOptional03

import io.kotest.matchers.shouldBe

import arrow.optics.*

@optics sealed interface User {
  companion object
}
@optics data class Person(val name: String, val age: Int): User {
  companion object
}
@optics data class Company(val name: String, val country: String): User {
  companion object
}

fun List<User>.happyBirthday() =
  map { User.person.age.modify(it) { age -> age + 1 } }
