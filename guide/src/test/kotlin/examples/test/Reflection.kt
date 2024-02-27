// This file was automatically generated from reflection.md by Knit tool. Do not edit.
package arrow.core.examples.test

import kotlin.test.Test
import kotlinx.coroutines.test.runTest
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class Reflection {
  @Test fun ExampleReflection01() = runTest {
    arrow.website.examples.exampleReflection01.example()
  }

  @Test fun ExampleReflection02() = runTest {
    arrow.website.examples.exampleReflection02.example()
  }

  @Test fun ExampleReflection03() = runTest {
    arrow.website.examples.exampleReflection03.example()
  }

}
