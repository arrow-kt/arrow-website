// This file was automatically generated from reflection.md by Knit tool. Do not edit.
package arrow.website.examples.exampleReflection03

import arrow.optics.*
import io.kotest.matchers.shouldBe

sealed interface Cutlery
object Fork: Cutlery
object Spoon: Cutlery

fun example() {
  val things = listOf(Fork, Spoon, Fork)
  val forks = Every.list<Cutlery>() compose instance<Cutlery, Fork>()
  val noOfForks = forks.size(things)
  noOfForks shouldBe 2
}
