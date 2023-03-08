// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSchedule08

import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.fx.resilience.*
import io.kotest.matchers.shouldBe

suspend fun example(): Unit {
  var result = ""

  Schedule.doWhile<String> { it.length <= 5 }.repeat {
    result += "a"
    result
  }
  
  result shouldBe "aaaaaa"
}
