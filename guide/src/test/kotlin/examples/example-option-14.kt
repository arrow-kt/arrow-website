// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption14

import arrow.core.None
import arrow.core.Option
import arrow.core.Some

val number: Option<Int> = Some(3)
val noNumber: Option<Int> = None
val mappedResult1 = number.map { it * 1.5 }
val mappedResult2 = noNumber.map { it * 1.5 }

fun main() {
  println("number = $number")
  println("noNumber = $noNumber")
  println("mappedResult1 = $mappedResult1")
  println("mappedResult2 = $mappedResult2")
}
