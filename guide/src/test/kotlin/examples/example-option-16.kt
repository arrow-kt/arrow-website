// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption16

import arrow.core.Option
import arrow.core.none

val fold =
  none<Int>().fold({ 1 }, { it * 3 })

fun main() {
  println(fold)
}
