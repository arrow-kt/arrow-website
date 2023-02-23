// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption18

import arrow.core.toOption

val nullString: String? = null
val valueFromNull = nullString.toOption()

val helloString: String? = "Hello"
val valueFromStr = helloString.toOption()

fun main() {
  println("valueFromNull = $valueFromNull")
  println("valueFromStr = $valueFromStr")
}
