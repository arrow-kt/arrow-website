---
sidebar_position: 2
---

# Pre and post-conditions

In Quickstart we've introduced the idea of pre and post-conditions of functions as promises that either the caller or the body of the function should obey. Here we go deeper in the topic, about how these conditions may look, how they compose, and which way they are checked.

## Pre-conditions

When using Arrow Analysis, each function may declare one or more _pre-conditions_, which describes what should be true of the arguments of each call to it. In other words, the **caller** of the function must ensure that pre-conditions are true on every single call.

```kotlin
import arrow.analysis.pre

fun increment(x: Int): Int {
  pre(x > 0) { "value must be positive" }
  return x + 1
}
```

Each pre-condition takes a Boolean condition and a block with a message describing such condition. Even though the Kotlin compiler allows any expression to appear in those positions, there are heavy restrictions on what is actually understood by Arrow Analysis.

- Pre-conditions may only talk about parameters to the function, including `this` when inside a class method or defining an extension function;
- You can only create Boolean expressions using basic arithmetic operations (addition, subtraction, etc.), comparisons, and simple Boolean operations (and, or, not). In particular, you cannot define a Boolean function and use it in a condition;
- You may use `if` or `when`, but in the latter case only _without_ a subject;
- The final block must be a simple constant string. We follow this pattern for compatibility with Kotlin's built-in `require` function.

### Errors related to pre-conditions

The most common error in Arrow Analysis is calling a function while not satisfying its pre-conditions.

```kotlin
val example = increment(-1)
```
```plain
e: pre-condition `value must be positive` is not satisfied in `increment(-1)`
  -> unsatisfiable constraint: `(-1 > 0)`
```

When more than one block of pre-conditions is present, the tool also checks that those pre-conditions are not inconsistent. Imagine we require for the a number to be both positive and negative:

```kotlin
import arrow.analysis.pre

fun wat(x: Int): Int {
  pre(x > 0) { "value must be positive" }
  pre(x < 0) { "value must be negative" }
  return 0
}
```
```plain
e: `wat` has inconsistent pre-conditions: (x < 0), (x > 0)
```

Think about it: there's no value that can satisfy the requirements imposed by `wat`. Such a restriction usually points to an error in the specification of the function, since any usage would be completely forbidden otherwise.

## Disabling checks

If you are completely sure that a pre-condition is satisfied, even though Arrow Analysis is not able to "see" it, you can disable checking. This case usually arises for data which comes from external input. However, we still encourage you to handle the possibility of failure, instead of blindly disabling the checks: an exception may be hiding behind that call... Arrow Analysis gives three different ways to disable checks, depending on the desired level of granularity.

- `unsafeCall` disables checks only for the call *directly nested* within it. If you need to disable a check, this is the recommended choice, because it removes the fewer guarantees.

    ```kotlin
    import arrow.analysis.unsafeCall
  
    val wrong1 = unsafeCall(increment(-2)) // no errors reported
    val wrong2 = unsafeCall(increment(increment(-2)))
                       //   ^         ^
                       //   disabled  not disabled
                       //      error: pre-condition is not satisfied in `increment(-2)`
    ```

- `unsafeBlock` disables checks for everything inside that block. If you want to silence all errors in a function or value declaration, wrap its entire body with `unsafeBlock`.

    ```kotlin
    import arrow.analysis.unsafeBlock
  
    val wrong3 = unsafeBlock { increment(increment(-2)) } // no errors reported
    ```
- `@Suppress` can be attached to a declaration to silence an entire type of errors or warnings in their body. For example, `"UnsatCallPre"` are those errors coming from **unsat**isfied **pre**conditions on **call**s.

    ```kotlin
    @Suppress("UnsatCallPre")
    val wrong4: Int = increment(emptyList().first())
    ```

## Post-conditions

Post-conditions describe the **promises** we give about the result of the function. They are quite important when composing larger programs, because post-conditions define which information about the inner computation we want to expose about to the rest of the program. For example, these two programs are valid:

```kotlin
import arrow.analysis.post

fun one() = 1.post({ it == 1 }) { "result is exactly 1" }
fun positive() = 1.post({ it > 0 }) { "result is positive" }
```

but in the latter case we only promise that the result is positive. This leaves us room for changing the code later on, while keeping the rest of the code which depended on that condition untouched.

Post-conditions are attached to the result value by calling the `post` extension function. The restrictions for the arguments are similar to those of pre-conditions:

- The first argument should be a **block** whose body talks only about the parameters of the function and the formal parameter of the block, which represents the return value.
- The Boolean expression and the message follow the same restrictions as above.

### Errors related to post-conditions

The most common error message related to post-conditions is for them not being true in the _general_ case. This means that there's at least one set of values for the parameters for which the post-condition is not true. Take the following example:

```kotlin
import arrow.analysis.pre
import arrow.analysis.post

fun nope(x: Int): Int {
  pre(x >= 0) { "value >= 0" }
  return (x + 1).post({ it > 1 }) { "result > 1" }
}
```
```plain
e: declaration `nope` fails to satisfy the post-condition: ($result > 1)
```

In this case, when `x` is `0`, the result value is `1`, which is not strictly greater than `1`. Unfortunately, the error messages produced in this case by Arrow Analysis are not always very useful to diagnose where the problem lies; we are currently working on improving this feature.

