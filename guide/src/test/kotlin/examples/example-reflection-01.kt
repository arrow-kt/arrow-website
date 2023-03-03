// This file was automatically generated from reflection.md by Knit tool. Do not edit.
package arrow.website.examples.exampleReflection01

import arrow.optics.*
import io.kotest.matchers.shouldBe

data class Person(val name: String, val friends: List<String>)

fun main() {
  val p = Person("me", listOf("pat", "mat"))
  val m = Person::name.lens.modify(p) { it.capitalize() }
  m.name shouldBe "Me"
}
