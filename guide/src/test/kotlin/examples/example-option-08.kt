// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption08

import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import arrow.core.None
import io.kotest.matchers.shouldBe

fun example() {
  val some: Option<String?> = Some(null)
  val none: Option<String?> = Option.fromNullable(null)
  
  some shouldBe null.some()
  none shouldBe None
}
