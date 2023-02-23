// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption06

import arrow.core.Option
import arrow.core.Some
import arrow.core.None

val some: Option<String> = Some("I am wrapped in something")
val none: Option<String> = None

fun main() {
  println("value = $some")
  println("empty = $none")
}
