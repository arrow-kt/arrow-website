// This file was automatically generated from parallel.md by Knit tool. Do not edit.
package arrow.website.examples.exampleParallel04

import kotlin.coroutines.cancellation.CancellationException
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import arrow.fx.coroutines.parZip
import arrow.core.Either
import arrow.core.raise.either
import io.kotest.matchers.shouldBe

suspend fun task(number: Int): Unit = try {
    println("task-$number => I'm going to sleep ...")
    delay(500)
    println("task-$number => I finished sleeping ...")
} catch (e: CancellationException) {
  println("job: I was cancelled because of $e")
}

fun main(): Unit = runBlocking {
  either {
    parZip(
      { task(1) },
      {
        delay(200)
        raise("task 2 failed")
      },
      { task(3) }
    ) { _, _, _ -> }
  }.onLeft { msg -> println(msg) }
}
