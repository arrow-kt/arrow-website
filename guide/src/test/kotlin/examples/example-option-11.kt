// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption11

import arrow.core.None
import arrow.core.Some
import arrow.core.none
import arrow.core.some
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

fun example() {
  when(val value = 20.some()) {
    is Some -> value.value shouldBe 20
    None -> fail("$value should not be None")
  }
  
  when(val value = none<Int>()) {
    is Some -> fail("$value should not be Some")
    None -> value shouldBe None
  }
}
