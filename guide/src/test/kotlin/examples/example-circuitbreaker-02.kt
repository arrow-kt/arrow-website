// This file was automatically generated from circuitbreaker.md by Knit tool. Do not edit.
package arrow.website.examples.exampleCircuitbreaker02

import arrow.core.Either
import arrow.resilience.CircuitBreaker
import arrow.resilience.CircuitBreaker.OpeningStrategy
import arrow.resilience.Schedule
import arrow.resilience.retry
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import kotlinx.coroutines.delay

@ExperimentalTime
suspend fun main(): Unit {
  suspend fun apiCall(): Unit {
    println("apiCall . . .")
    throw RuntimeException("Overloaded service")
  }

  val circuitBreaker = CircuitBreaker(
    openingStrategy = OpeningStrategy.Count(2),
    resetTimeout = 2.seconds,
    exponentialBackoffFactor = 1.2,
    maxResetTimeout = 60.seconds,
  )

  suspend fun <A> resilient(schedule: Schedule<Throwable, *>, f: suspend () -> A): A =
    schedule.retry { circuitBreaker.protectOrThrow(f) }

  // simulate getting overloaded
  Either.catch {
    resilient(Schedule.recurs(5), ::apiCall)
  }.let { println("recurs(5) apiCall twice and 4x short-circuit result from CircuitBreaker: $it") }

  // simulate reset timeout
  delay(2000)
  println("CircuitBreaker ready to half-open")

  // retry once,
  // and when the CircuitBreaker opens after 2 failures
  //    retry with exponential back-off with same time as CircuitBreaker's resetTimeout
  val fiveTimesWithBackOff = Schedule.recurs<Throwable>(1) andThen
    Schedule.exponential(2.seconds) and Schedule.recurs(5)

  Either.catch {
    resilient(fiveTimesWithBackOff, ::apiCall)
  }.let { println("exponential(2.seconds) and recurs(5) always retries with actual apiCall: $it") }
}
