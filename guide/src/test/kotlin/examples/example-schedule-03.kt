// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.website.examples.exampleSchedule03

import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.resilience.*
import io.kotest.matchers.shouldBe

@ExperimentalTime
fun <A> complexPolicy(): Schedule<A, List<A>> =
  Schedule.exponential<A>(10.milliseconds).doWhile { _, duration -> duration < 60.seconds }
    .andThen(Schedule.spaced<A>(60.seconds) and Schedule.recurs(100)).jittered()
    .zipRight(Schedule.identity<A>().collect())
