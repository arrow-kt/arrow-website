// This file was automatically generated from optional-prism.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOptional04

import io.kotest.matchers.shouldBe

import arrow.core.Either
import arrow.optics.*

fun main() {
  val x = Prism.left<Int, String>().reverseGet(5)
  x shouldBe Either.Left(5)
}
