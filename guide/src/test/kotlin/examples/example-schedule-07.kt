// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSchedule07

import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.fx.resilience.*
import io.kotest.matchers.shouldBe

suspend fun example(): Unit {
  var counter = 0

  val keepAll = (Schedule.collect<Int>() zipLeft Schedule.recurs(3)).repeat {
    counter++
    counter
  }

  keepAll shouldBe listOf(1, 2, 3, 4)
}
