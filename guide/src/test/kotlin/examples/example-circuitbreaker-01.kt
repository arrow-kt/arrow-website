// This file was automatically generated from circuitbreaker.md by Knit tool. Do not edit.
package arrow.website.examples.exampleCircuitbreaker01

import arrow.core.Either
import arrow.resilience.CircuitBreaker
import arrow.resilience.CircuitBreaker.OpeningStrategy
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import kotlinx.coroutines.delay

@ExperimentalTime
suspend fun main(): Unit {
  val maxFailuresUntilOpen = 2
  val circuitBreaker = CircuitBreaker(
    openingStrategy = OpeningStrategy.Count(maxFailuresUntilOpen),
    resetTimeout = 2.seconds,
    exponentialBackoffFactor = 1.2,
    maxResetTimeout = 60.seconds,
  )

  // normal operation
  circuitBreaker.protectOrThrow { "I am in Closed: ${circuitBreaker.state()}" }.also(::println)

  // simulate service getting overloaded
  for (i in 1 .. maxFailuresUntilOpen + 1) {
    Either.catch {
      circuitBreaker.protectOrThrow { throw RuntimeException("Service overloaded") }
    }.also(::println)
  }
  circuitBreaker.protectEither { }
   .also { println("I am Open and short-circuit with ${it}. ${circuitBreaker.state()}") }

  // simulate reset timeout
  println("Service recovering . . .").also { delay(2000) }

  // simulate test request success
  circuitBreaker.protectOrThrow { 
    "I am running test-request in HalfOpen: ${circuitBreaker.state()}" 
  }.also(::println)
  println("I am back to normal state closed ${circuitBreaker.state()}")
}
