// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.website.examples.exampleParallel05

import arrow.core.raise.either
import arrow.fx.coroutines.parZip
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.delay

suspend fun logCancellation(): Unit = try {
  println("Sleeping for 500 milliseconds ...")
  delay(500)
} catch (e: CancellationException) {
  println("Sleep was cancelled early!")
  throw e
}

suspend fun example() {
  val triple = parZip(
    { either<String, Unit> { logCancellation() } },
    { either<String, Unit> { delay(100); raise("Error") } },
    { either<String, Unit> { logCancellation() } }
  ) { a, b, c -> Triple(a, b, c) }
  println(triple)
}
