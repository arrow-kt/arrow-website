// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption07

import arrow.core.Option
import arrow.core.toOption
import io.kotest.matchers.shouldBe

fun example() {
  val some: Option<String> = Option.fromNullable("Nullable string")
  val none: Option<String> = Option.fromNullable(null)
  
  "Nullable string".toOption() shouldBe some
  null.toOption<String>() shouldBe none
}
