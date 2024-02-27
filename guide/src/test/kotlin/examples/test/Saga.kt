// This file was automatically generated from saga.md by Knit tool. Do not edit.
package arrow.core.examples.test

import kotlin.test.Test
import kotlinx.coroutines.test.runTest
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class Saga {
  @Test fun ExampleSaga01() = runTest {
    arrow.website.examples.exampleSaga01.example()
  }

}
