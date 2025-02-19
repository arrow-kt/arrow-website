---
title: Outcomes and in-progress
sidebar_position: 6
description: Describing more than success and failure.
---

# Outcomes and in-progress values

Arrow Core includes three different types to model success and failure:
`Option` when no information is available on failure,
`Either` when the success and failure cases are disjoint,
and `Ior` when success and failure may happen at the same time.
But sometimes life is a bit more complicated, and these type fall short.
Fortunately, the wonderful Kotlin community has developed libraries
to cover other scenarios, with full integration with Arrow's `Raise` approach.

## Outcomes: absence is not failure

[Quiver](https://block.github.io/quiver/) introduces the
[`Outcome`](https://block.github.io/quiver/-quiver%20-library/app.cash.quiver/index.html)
with three states: `Present`, `Failure`, and `Absent`. The last one is what
sets it apart from `Either`.

<!--- TEST_NAME OutcomeTest -->

<!--- INCLUDE
import app.cash.quiver.*
import app.cash.quiver.raise.*
-->

```kotlin
val good = 3.present()
val bad  = "problem".failure()
val whoKnows = Absent
```
<!--- KNIT example-outcome-01.kt -->

## In-progress values with Pedestal

[Pedestal State](https://opensavvy.gitlab.io/groundwork/pedestal/api-docs/state/index.html)
introduces [`ProgressiveOutcome`](https://opensavvy.gitlab.io/groundwork/pedestal/api-docs/state/opensavvy.state.progressive/-progressive-outcome/index.html)
a type that combines the current state of a computation, and information
about how the corresponding task is evolving.

:::tip Success does not mean stopped

The value `Success(5, loading(0.4))` is perfectly valid,
and describes a point in which:

- The last successful value of a task is `5`,
- Retrieving the new value is at 40% completion.

:::

<!--- INCLUDE
import opensavvy.progress.*
import opensavvy.state.outcome.*
import opensavvy.state.progressive.*
-->

To access the two components of a `ProgressiveOutcome` you often
use Kotlin's destructuring.
The first part is very similar to `Outcome`, in that it has `Success`,
`Failure`, and `Incomplete` modes.
The second element describes the current progress. In this case we may
be `Done`, or the task may be `Loading`.

```kotlin
fun <E, A> printProgress(po: ProgressiveOutcome<E, A>) {
    val (current, progress) = po
    when {
        current is Outcome.Success -> println("current value is ${current.value}!")
        progress is Progress.Loading -> println("loading...")
        progress is Progress.Done -> println("no value found :(")
    }
}
```
<!--- KNIT example-outcome-02.kt -->

<!--- INCLUDE
import opensavvy.progress.*
import opensavvy.state.outcome.*
import opensavvy.state.progressive.*
-->

Pedestal State includes helper functions `onState` that only execute when the 
value is in the corresponding state. These functions are especially useful
to build a UI, where one often sees a component holding the current value
and separate one describing the progress.

```kotlin
fun <E, A> printProgress(po: ProgressiveOutcome<E, A>) {
    po.onSuccess {
        println("current value is $it")
    }
    po.onLoading {
        println("loading...")
    }
}
```
<!--- KNIT example-outcome-03.kt -->

## `Flow`s and `State`s

One useful pattern in frontend applications is to combine one of these
types with a `Flow` or a `MutableState` (if using Compose), to model the
evolution of a piece of data through time. In fact, Pedestal State has
a companion [coroutines library](https://opensavvy.gitlab.io/groundwork/pedestal/api-docs/state-coroutines/index.html)
including functions which help in using this pattern.
