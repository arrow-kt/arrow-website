// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.website.examples.exampleParallel07

import kotlinx.coroutines.delay
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.fx.coroutines.parMap
import kotlin.coroutines.cancellation.CancellationException

suspend fun logCancellation(): Unit = try {
  println("Sleeping for 500 milliseconds ...")
  delay(500)
} catch (e: CancellationException) {
  println("Sleep was cancelled early!")
  throw e
}

suspend fun Raise<String>.failOnEven(i: Int): Unit {
  ensure(i % 2 != 0) { delay(100); "Error" }
  logCancellation()
}

suspend fun example() {
  val res = either {
    listOf(1, 2, 3, 4).parMap { failOnEven(it) }
  }
  println(res)
}
