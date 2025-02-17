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

# Outcomes: absence is not failure

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

This type is very useful with abstractions which model change of state,
like Compose's `MutableState` or coroutines' `Flow`.

# In-progress values with Pedestal

[Pedestal State](https://opensavvy.gitlab.io/groundwork/pedestal/api-docs/state/index.html)
introduces [`ProgressiveOutcome`](https://opensavvy.gitlab.io/groundwork/pedestal/api-docs/state/opensavvy.state.progressive/-progressive-outcome/index.html)
a type that combines the ability to know the current state of a computation
and to obtain progress information as the task evolves.

<!--- INCLUDE
import opensavvy.progress.*
import opensavvy.state.outcome.*
import opensavvy.state.progressive.*
-->

To access the two components of a `ProgressiveOutcome` you often
use Kotlin's destructuring.

```kotlin
fun <E, A> printProgress(po: ProgressiveOutcome<E, A>) {
    val (current, progress) = po
    when {
        progress is Progress.Loading -> println("loading...")
        current is Outcome.Success -> println("done!")
        current is Outcome.Failure -> println("problem ${current.failure}")
    }
}
```
<!--- KNIT example-outcome-02.kt -->

The first part is very similar to `Outcome`, in that it has `Success`,
`Failure`, and `Incomplete` modes.
The second element describes the current progress. In this case we may
be `Done`, or the task may be `Loading`.