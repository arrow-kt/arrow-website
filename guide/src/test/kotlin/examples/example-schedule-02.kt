// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSchedule02

import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.resilience.*
import io.kotest.matchers.shouldBe

@ExperimentalTime
val exponential = Schedule.exponential<Unit>(250.milliseconds)
