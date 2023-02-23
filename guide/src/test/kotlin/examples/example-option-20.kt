// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption20

import arrow.core.Some

fun main() {
  val value =
    //sampleStart
    Some(1).map { it + 1 }
  //sampleEnd
  println(value)
}
