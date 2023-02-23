// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption15

import arrow.core.Option
import arrow.core.Some

val fold =
  Some(3).fold({ 1 }, { it * 3 })

fun main() {
  println(fold)
}
