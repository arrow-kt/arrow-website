// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption10

import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.getOrElse
import io.kotest.matchers.shouldBe

fun main() {
  Some( "Found value").getOrElse { "No value" } shouldBe "Found value"
  None.getOrElse { "No value" } shouldBe "No value"
}
