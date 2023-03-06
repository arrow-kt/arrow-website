// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption06

import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import arrow.core.None
import arrow.core.none
import io.kotest.matchers.shouldBe

val some: Some<String> = Some("I am wrapped in something")
val none: None = None

val optionA: Option<String> = "I am wrapped in something".some()
val optionB: Option<String> = none<String>()

fun example() {
  some shouldBe optionA
  none shouldBe optionB
}
