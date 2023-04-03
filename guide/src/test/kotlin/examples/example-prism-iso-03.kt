// This file was automatically generated from prism-iso.md by Knit tool. Do not edit.
package arrow.website.examples.examplePrismIso03

import io.kotest.matchers.shouldBe

import arrow.optics.*

@optics data class Person(val name: String, val age: Age) {
  companion object
}

@JvmInline @optics value class Age(val age: Int) {
  companion object
}

fun Person.happyBirthday(): Person =
  Person.age.age.modify(this) { it + 1 }

fun example() {
  val p = Person("me", Age(29))
  p.happyBirthday().age shouldBe Age(30)
}
