// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class OptionKnitTest : StringSpec({
  "ExampleOption01" {
    arrow.website.examples.exampleOption01.main()
  }

  "ExampleOption02" {
    captureOutput("ExampleOption02") { arrow.website.examples.exampleOption02.main() }
      .also { lines -> check(lines.first().startsWith("Exception in thread \"main\" java.lang.AssertionError: Expected null but actual was -1")) }
  }

  "ExampleOption06" {
    captureOutput("ExampleOption06") { arrow.website.examples.exampleOption06.main() }
      .verifyOutputLines(
        "value = Option.Some(I am wrapped in something)",
        "empty = Option.None"
      )
  }

  "ExampleOption08" {
    arrow.website.examples.exampleOption08.main()
  }

  "ExampleOption09" {
    arrow.website.examples.exampleOption09.main()
  }

  "ExampleOption10" {
    arrow.website.examples.exampleOption10.main()
  }

  "ExampleOption11" {
    arrow.website.examples.exampleOption11.main()
  }

  "ExampleOption12" {
    arrow.website.examples.exampleOption12.main()
  }

}) {
  override fun timeout(): Long = 1000
}
