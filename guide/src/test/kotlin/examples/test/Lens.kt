// This file was automatically generated from lens.md by Knit tool. Do not edit.
package arrow.core.examples.test

import kotlin.test.Test
import kotlinx.coroutines.test.runTest
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class Lens {
  @Test fun ExampleLens03() = runTest {
    arrow.website.examples.exampleLens03.example()
  }

  @Test fun ExampleLensDomain01() = runTest {
    arrow.website.examples.exampleLensDomain01.example()
  }

  @Test fun ExampleLensDomain02() = runTest {
    arrow.website.examples.exampleLensDomain02.example()
  }

}
