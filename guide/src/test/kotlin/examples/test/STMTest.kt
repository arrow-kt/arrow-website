// This file was automatically generated from stm.md by Knit tool. Do not edit.
package arrow.core.examples.test

import kotlin.test.Test
import kotlinx.coroutines.test.runTest
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class STMTest {
  @Test fun ExampleStm01() = runTest {
    arrow.website.examples.exampleStm01.example()
  }

  @Test fun ExampleStm02() = runTest {
    arrow.website.examples.exampleStm02.example()
  }

  @Test fun ExampleStm03() = runTest {
    arrow.website.examples.exampleStm03.example()
  }

}
