// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.core.examples.test

import kotlin.test.Test
import kotlinx.coroutines.test.runTest
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class ParallelTest {
  @Test fun ExampleParallel04() = runTest {
    captureOutput("ExampleParallel04") { arrow.website.examples.exampleParallel04.example() }
      .verifyOutputLines(
        "Sleeping for 500 milliseconds ...",
        "Sleeping for 500 milliseconds ...",
        "(Either.Right(kotlin.Unit), Either.Left(Error), Either.Right(kotlin.Unit))"
      )
  }

  @Test fun ExampleParallel05() = runTest {
    captureOutput("ExampleParallel05") { arrow.website.examples.exampleParallel05.example() }
      .verifyOutputLines(
        "Sleeping for 500 milliseconds ...",
        "Sleeping for 500 milliseconds ...",
        "Sleep was cancelled early!",
        "Sleep was cancelled early!",
        "Either.Left(Error)"
      )
  }

  @Test fun ExampleParallel06() = runTest {
    captureOutput("ExampleParallel06") { arrow.website.examples.exampleParallel06.example() }
      .verifyOutputLines(
        "Sleeping for 500 milliseconds ...",
        "Sleeping for 500 milliseconds ...",
        "Sleep was cancelled early!",
        "Sleep was cancelled early!",
        "Either.Left(Error)"
      )
  }

}
