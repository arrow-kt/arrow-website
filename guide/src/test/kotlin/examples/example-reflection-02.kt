// This file was automatically generated from reflection.md by Knit tool. Do not edit.
package arrow.website.examples.exampleReflection02

import arrow.optics.*
import io.kotest.matchers.shouldBe

data class Person(val name: String, val friends: List<String>)

fun example() {
  val p = Person("me", listOf("pat", "mat"))
  val m = Person::friends.every.modify(p) { it.capitalize() }
  m.friends shouldBe listOf("Pat", "Mat")
}
