---
sidebar_position: 2
---

# Retry and repeat

A common demand when working with actions is to retry or repeat them when 
(adverse) certain circumstances happen. Usually, the retrial or repetition does 
not happen right away; rather, it is done based on a policy. For instance, when
fetching content from a network request, we may want to retry it when it fails,
using an exponential backoff algorithm, for a maximum of 15 seconds or 5 
attempts, whatever happens first.

:::info Additional context for this pattern

[Retry pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry)
in _Cloud Design Patterns_.

:::


[`Schedule`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/index.html)
allows you to define and compose powerful yet simple policies. There are two
steps involved in using `Schedule`.

1. First we need to **construct** a policy, which specifies the amount and the
   delay in repetition.
2. Then we **run** this schedule with a specified action. There are two ways to do so:
   - [`retry`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/retry.html)
     executes the action once, and if it fails, it is reattempted based
     on the scheduling policy. It stops when the action succeeds, or when the policy 
     determines it should not be reattempted again.
   - [`repeat`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/repeat.html)
     executes the action, and if it succeeds, keep executing it again based on
     the scheduling policy passed as an argument. It stops if the action 
     fails, or the policy determines it should not be executed again. 
     It returns the last internal state of the scheduling policy, 
     or the error that happened running the action.

## Constructing a policy

<!--- TEST_NAME RetryRepeat -->

<!--- INCLUDE .*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.ExperimentalTime
import arrow.fx.resilience.*
import io.kotest.matchers.shouldBe
-->

Scheduling policies are constructed using the methods in [`Schedule`'s
companion object](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/-companion/index.html).
Schedule policies also return values on each step, which can be used to
take decisions based on previous values.

One of the simplest policies is recurring 10 times. This means that if we
call `repeat`, the same action is performed 10 times, and if we call `retry`,
the action is attempted until successful for a maximum of 10 times.

```kotlin
fun <A> recurTenTimes() = Schedule.recurs<A>(10)
```
<!--- KNIT example-schedule-01.kt -->

A common algorithm to retry operations communicating with external services, 
such as network requests, is the exponential backoff algorithm. Roughly, this
means that the delay between attempts increases by the given factor.

```kotlin
@ExperimentalTime
val exponential = Schedule.exponential<Unit>(250.milliseconds)
```
<!--- KNIT example-schedule-02.kt -->

Here's a much more complex schedule. Let's walk through it step by step:
- It recurs with exponential backoff as long as the delay is less than 60 seconds.
- Afterwards, we have a spaced (constant) delay of 60 seconds for up to 100 attempts.
- Some random noise is added by calling `jittered`.
- We also collect every input to the schedule and return it.

```kotlin
@ExperimentalTime
fun <A> complexPolicy(): Schedule<A, List<A>> =
  Schedule.exponential<A>(10.milliseconds).whileOutput { it < 60.seconds }
    .andThen(Schedule.spaced<A>(60.seconds) and Schedule.recurs(100)).jittered()
    .zipRight(Schedule.identity<A>().collect())
```
<!--- KNIT example-schedule-03.kt -->

## Repeating an action

When we repeat an action, we do it as long as it is successful and the 
scheduling policy tells us to keep recursing. 
For example, this block repeats an action 3 times after its first successful
execution (so 4 times in total).

```kotlin
suspend fun example(): Unit {
  var counter = 0
  val res = Schedule.recurs<Unit>(3).repeat {
    counter++
  }
  counter shouldBe 4
}
```
<!--- KNIT example-schedule-04.kt -->
<!--- TEST assert -->

Notice that we did not handle the error case, there are overloads 
[`repeatOrElse`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/repeat-or-else.html)
and [`repeatOrElseEither`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/repeat-or-else-either.html)
which offer that capability, repeat will just rethrow any error encountered.

### Collecting values

Using `repeat` the resulting value is the number of iterations it has performed.
We're throwing away any value produced by each iteration of the repetition. 
But we have other three possibilities:
- Discard all results; that is, return `Unit`.
- Discard all intermediate results and just keep the last produced result.
- Keep all intermediate results.

To discard the values provided by the repetition of the action, we combine our 
policy with [`Schedule.unit`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/-companion/unit.html), 
using the [`zipLeft`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/zip-left.html)
or [`zipRight`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/zip-right.html)
combinators, which keep just the output of one of the policies:

```kotlin
suspend fun example(): Unit {
  var counter = 0

  val keepLeft = (Schedule.unit<Unit>() zipLeft Schedule.recurs(3)).repeat {
    counter++
  }
  val keepRight = (Schedule.recurs<Unit>(3) zipRight Schedule.unit()).repeat {
    counter++
  }

  counter shouldBe 8
  keepLeft shouldBe Unit
  keepRight shouldBe Unit
}
```
<!--- KNIT example-schedule-05.kt -->
<!--- TEST assert -->

Following the same strategy, we can zip it with the [`Schedule.identity`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/-companion/identity.html) 
policy to keep only the last result of the action.

```kotlin
suspend fun example(): Unit {
  var counter = 0

  val keepLast = (Schedule.identity<String>() zipLeft Schedule.recurs(3)).repeat {
    counter++; "$counter"
  }
  
  keepLast shouldBe "4"
}
```
<!--- KNIT example-schedule-06.kt -->
<!--- TEST assert -->

Finally, if we want to keep all intermediate results, we can zip the policy with
[`Schedule.collect`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/-companion/collect.html).

```kotlin
suspend fun example(): Unit {
  var counter = 0

  val keepAll = (Schedule.collect<Int>() zipLeft Schedule.recurs(3)).repeat {
    counter++
    counter
  }

  keepAll shouldBe listOf(1, 2, 3, 4)
}
```
<!--- KNIT example-schedule-07.kt -->
<!--- TEST assert -->

### Until / while it produces a certain value

We can make use of the policies [`doWhile`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/-companion/do-while.html)
and [`doUntil`](https://arrow-kt.github.io/arrow/arrow-fx-resilience/arrow.fx.resilience/-schedule/-companion/do-until.html) 
to repeat an action while or until its produced result matches a given predicate.

```kotlin
suspend fun example(): Unit {
  var result = ""

  Schedule.doWhile<String> { it.length <= 5 }.repeat {
    result += "a"
    result
  }
  
  result shouldBe "aaaaaa"
}
```
<!--- KNIT example-schedule-08.kt -->
<!--- TEST assert -->
