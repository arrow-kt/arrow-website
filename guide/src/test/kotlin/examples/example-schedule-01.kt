// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSchedule01

import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.fx.resilience.*
import io.kotest.matchers.shouldBe

fun <A> recurTenTimes() = Schedule.recurs<A>(10)
