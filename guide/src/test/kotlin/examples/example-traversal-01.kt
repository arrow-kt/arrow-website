// This file was automatically generated from traversal.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTraversal01

import io.kotest.matchers.shouldBe

import arrow.optics.*
import arrow.optics.dsl.*

@optics data class Person(val name: String, val age: Int, val friends: List<Person>) {
  companion object
}

fun List<Person>.happyBirthdayMap(): List<Person> =
  map { Person.age.modify(it) { age -> age + 1 } }

fun List<Person>.happyBirthdayOptics(): List<Person> =
  Every.list<Person>().age.modify(this) { age -> age + 1 }

fun Person.happyBirthdayFriends(): Person =
  copy(
    friends = friends.map { friend -> friend.copy(age = friend.age + 1) }
  )

fun Person.happyBirthdayFriendsOptics(): Person =
  Person.friends.every(Every.list()).age.modify(this) { it + 1 }
