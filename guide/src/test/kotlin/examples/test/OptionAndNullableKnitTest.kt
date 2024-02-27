// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.core.examples.test

import kotlin.test.Test
import kotlinx.coroutines.test.runTest
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class OptionAndNullableKnitTest {
  @Test fun ExampleOption01() = runTest {
    arrow.website.examples.exampleOption01.example()
  }

  @Test fun ExampleOption02() = runTest {
    captureOutput("ExampleOption02") { arrow.website.examples.exampleOption02.example() }
      .also { lines -> check(lines.first().startsWith("Exception in thread \"main\" java.lang.AssertionError: Expected null but actual was -1")) }
  }

  @Test fun ExampleOption06() = runTest {
    arrow.website.examples.exampleOption06.example()
  }

  @Test fun ExampleOption07() = runTest {
    arrow.website.examples.exampleOption07.example()
  }

  @Test fun ExampleOption08() = runTest {
    arrow.website.examples.exampleOption08.example()
  }

  @Test fun ExampleOption09() = runTest {
    arrow.website.examples.exampleOption09.example()
  }

  @Test fun ExampleOption10() = runTest {
    arrow.website.examples.exampleOption10.example()
  }

  @Test fun ExampleOption11() = runTest {
    arrow.website.examples.exampleOption11.example()
  }

  @Test fun ExampleOption15() = runTest {
    arrow.website.examples.exampleOption15.example()
  }

  @Test fun ExampleOption16() = runTest {
    arrow.website.examples.exampleOption16.example()
  }

  @Test fun ExampleOption17() = runTest {
    captureOutput("ExampleOption17") { arrow.website.examples.exampleOption17.example() }
      .verifyOutputLines(
        "I am here: 1",
        "I am here"
      )
  }

}
