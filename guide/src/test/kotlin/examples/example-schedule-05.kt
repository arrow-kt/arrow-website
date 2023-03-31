// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSchedule05

import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.resilience.*
import io.kotest.matchers.shouldBe

suspend fun example(): Unit {
  var counter = 0

  val keepLeft = (Schedule.identity<Unit>() zipLeft Schedule.recurs(3)).repeat {
    counter++
  }
  val keepRight = (Schedule.recurs<Unit>(3) zipRight Schedule.identity<Unit>()).repeat {
    counter++
  }

  counter shouldBe 8
  keepLeft shouldBe Unit
  keepRight shouldBe Unit
}
