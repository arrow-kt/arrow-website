// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.website.examples.exampleParallel05

import kotlinx.coroutines.delay
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.fx.coroutines.parZip
import kotlin.time.Duration.Companion.milliseconds
import kotlin.coroutines.cancellation.CancellationException

suspend fun logCancellation(): Unit = try {
  println("Sleeping for 500 milliseconds ...")
  delay(500)
} catch (e: CancellationException) {
  println("Sleep was cancelled early!")
  throw e
}

suspend fun example() {
  val res = either {
    parZip(
      { logCancellation() } ,
      { delay(100); raise("Error") },
      { logCancellation() }
    ) { a, b, c -> Triple(a, b, c) }
  }
  println(res)
}
