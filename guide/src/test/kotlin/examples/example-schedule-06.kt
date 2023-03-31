// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSchedule06

import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.resilience.*
import io.kotest.matchers.shouldBe

suspend fun example(): Unit {
  var counter = 0

  val keepLast = (Schedule.identity<String>() zipLeft Schedule.recurs(3)).repeat {
    counter++; "$counter"
  }
  
  keepLast shouldBe "4"
}
