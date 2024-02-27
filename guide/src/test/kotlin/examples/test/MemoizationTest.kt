// This file was automatically generated from memoize.md by Knit tool. Do not edit.
package arrow.core.examples.test

import kotlin.test.Test
import kotlinx.coroutines.test.runTest
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class MemoizationTest {
  @Test fun ExampleMemoize01() = runTest {
    arrow.website.examples.exampleMemoize01.example()
  }

  @Test fun ExampleMemoize02() = runTest {
    arrow.website.examples.exampleMemoize02.example()
  }

}
