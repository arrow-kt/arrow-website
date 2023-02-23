// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption10

import arrow.core.Option
import arrow.core.Some
import arrow.core.None
import arrow.core.none
import io.kotest.matchers.shouldBe

fun main() {
  Some(2).isSome { it % 2 == 0 } shouldBe true
  Some(1).isSome { it % 2 == 0 } shouldBe false
  none<Int>().isSome { it % 2 == 0 } shouldBe false
}
