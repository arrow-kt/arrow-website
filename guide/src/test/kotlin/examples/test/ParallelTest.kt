// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class ParallelTest : StringSpec({
  "ExampleParallel04" {
    captureOutput("ExampleParallel04") { arrow.website.examples.exampleParallel04.main() }
      .verifyOutputLines(
        "task-1 => I'm going to sleep ...",
        "task-3 => I'm going to sleep ...",
        "job: I was cancelled because of arrow.core.raise.RaiseCancellationException: Raised Continuation",
        "job: I was cancelled because of arrow.core.raise.RaiseCancellationException: Raised Continuation"
      )
  }

}) {
  override fun timeout(): Long = 1000
}
