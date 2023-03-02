// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption17

import arrow.core.Option
import arrow.core.Some
import arrow.core.None
import arrow.core.none
import io.kotest.matchers.shouldBe

fun main() {
  Some(1).onSome { println("I am here: $it") }
  none<Int>().onNone { println("I am here") }
  
  none<Int>().onSome { println("I am not here: $it") }
  Some(1).onNone { println("I am not here") }
}
