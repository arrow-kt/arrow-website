// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption09

import arrow.core.None
import arrow.core.Some
import io.kotest.matchers.shouldBe

fun example() {
  Some("Found value").getOrNull() shouldBe "Found value"
  None.getOrNull() shouldBe null
}
