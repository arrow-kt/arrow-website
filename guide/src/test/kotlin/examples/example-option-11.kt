// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption11

import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import arrow.core.None
import io.kotest.matchers.shouldBe

fun main() {
  Option.fromNullable("Nullable string") shouldBe Some("Nullable string")
  Option.fromNullable(null) shouldBe None
  null.some() shouldBe Some(null)
}
