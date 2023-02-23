// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption21

import arrow.core.Some

val value =
  Some(1).zip(Some("Hello"), Some(20.0), ::Triple)

fun main() {
  println(value)
}
