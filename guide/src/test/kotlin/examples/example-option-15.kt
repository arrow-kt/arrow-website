// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption15

import arrow.core.Some
import arrow.core.none
import io.kotest.matchers.shouldBe

fun main() {
  Some(1).isSome() shouldBe true
  none<Int>().isNone() shouldBe true
}
