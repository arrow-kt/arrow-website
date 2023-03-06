// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class OptionAndNullableKnitTest : StringSpec({
  "ExampleOption01" {
    arrow.website.examples.exampleOption01.example()
  }

  "ExampleOption02" {
    captureOutput("ExampleOption02") { arrow.website.examples.exampleOption02.example() }
      .also { lines -> check(lines.first().startsWith("Exception in thread \"main\" java.lang.AssertionError: Expected null but actual was -1")) }
  }

  "ExampleOption06" {
    arrow.website.examples.exampleOption06.example()
  }

  "ExampleOption07" {
    arrow.website.examples.exampleOption07.example()
  }

  "ExampleOption08" {
    arrow.website.examples.exampleOption08.example()
  }

  "ExampleOption09" {
    arrow.website.examples.exampleOption09.example()
  }

  "ExampleOption10" {
    arrow.website.examples.exampleOption10.example()
  }

  "ExampleOption11" {
    arrow.website.examples.exampleOption11.example()
  }

  "ExampleOption15" {
    arrow.website.examples.exampleOption15.example()
  }

  "ExampleOption16" {
    arrow.website.examples.exampleOption16.example()
  }

  "ExampleOption17" {
    captureOutput("ExampleOption17") { arrow.website.examples.exampleOption17.example() }
      .verifyOutputLines(
        "I am here: 1",
        "I am here"
      )
  }

}) {
  override fun timeout(): Long = 1000
}
