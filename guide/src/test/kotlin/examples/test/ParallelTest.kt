// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class ParallelTest : StringSpec({
  "ExampleParallel04" {
    captureOutput("ExampleParallel04") { arrow.website.examples.exampleParallel04.example() }
      .verifyOutputLines(
        "Sleeping for 500 milliseconds ...",
        "Sleeping for 500 milliseconds ...",
        "(Either.Right(kotlin.Unit), Either.Left(Error), Either.Right(kotlin.Unit))"
      )
  }

  "ExampleParallel05" {
    captureOutput("ExampleParallel05") { arrow.website.examples.exampleParallel05.example() }
      .verifyOutputLines(
        "Sleeping for 500 milliseconds ...",
        "Sleeping for 500 milliseconds ...",
        "Sleep was cancelled early!",
        "Sleep was cancelled early!",
        "Either.Left(Error)"
      )
  }

  "ExampleParallel06" {
    captureOutput("ExampleParallel06") { arrow.website.examples.exampleParallel06.example() }
      .verifyOutputLines(
        "Sleeping for 500 milliseconds ...",
        "Sleeping for 500 milliseconds ...",
        "Sleep was cancelled early!",
        "Sleep was cancelled early!",
        "Either.Left(Error)"
      )
  }

}) {
  override fun timeout(): Long = 1000
}
