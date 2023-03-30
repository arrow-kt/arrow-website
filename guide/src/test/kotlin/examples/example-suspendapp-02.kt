// This file was automatically generated from index.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSuspendapp02

import arrow.continuations.SuspendApp
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import kotlinx.coroutines.awaitCancellation
import arrow.fx.coroutines.resourceScope

fun main() = SuspendApp {
  resourceScope {
    install({ println("Creating some resource") }) { _, exitCase ->
      println("ExitCase: $exitCase")
      println("Shutting down will take 10 seconds")
      delay(10_000)
      println("Shutdown finished")
    }
    println("Application running with acquired resources.")
    awaitCancellation()
  }
}
