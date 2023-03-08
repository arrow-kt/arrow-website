---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

This Quickstart explains how to set up Arrow Analysis in your Gradle project, and how to use it to get further insight in your code, and to introduce additional checks in your own functions and classes.

:::info Media resources

- [_Super-charge your build with Arrow Analysis_](https://www.youtube.com/watch?v=yCZtnzTnpRA) by Alejandro Serrano

:::

## Adding the plug-in

<Tabs groupId="build">
  <TabItem value="gradleKotlin" label="Gradle (Kotlin)">

```kotlin
plugins {
  kotlin("multiplatform") version "1.8.10"
  // other plugins
  id("io.arrow-kt.analysis.kotlin") version "2.0.2"
}

buildscript {
  repositories {
    mavenCentral()
  }
}
```

  </TabItem>
  <TabItem value="gradleGroovy" label="Gradle (Groovy)">

```groovy
plugins {
  id 'org.jetbrains.kotlin.multiplatform' version '1.8.10'
  // other plugins
  id 'io.arrow-kt.analysis.kotlin' version '2.0.2'
}

buildscript {
  repositories {
    mavenCentral()
  }
}
```

  </TabItem>
</Tabs>

This adds both the Kotlin compiler plug-in, which performs the checks, and the pre and post-conditions for the Kotlin standard library. You are ready to get your first analysis results.

### Arrow Analysis + Android

If you want to use the plug-in in an Android project, you may run into [this Kotlin compiler issue](https://youtrack.jetbrains.com/issue/KT-38576), characterized by the following error message:

```plain
java.lang.AssertionError: Duplicated JavaClassDescriptor ... reported to IC
```

To solve this problem you have to disable precise Java tracking, by adding the following line in your `gradle.properties` file:

```kotlin
kotlin.incremental.usePreciseJavaTracking=false
```

## Running the analysis

Open a new file and write the following line. This code is incorrect because you want to obtain the third element of an empty list.

```kotlin
val wrong = emptyList<Int>().get(2)
```

Run the analysis by executing the corresponding Gradle task (usually `build` or `compileKotlin`), and (if everything is correctly configured) you should get the following message:

```plain
e: Example.kt: (1, 18): pre-condition `index within bounds` is not satisfied in `get(2)`
  -> unsatisfiable constraint: `((2 >= 0) && (2 < emptyList<Int>().size))`
  -> `2` bound to param `index` in `kotlin.collections.List.get` 
  -> main function body
```

There's a lot of information there, so let's break it into pieces:

1. `Example.kt: (1, 18)`: the place where the problem lies (but you already knew that 😜);
2. `pre-condition 'index within bounds' is not satisfied`: this is the description of the problem. Something which should be true ("index within bounds") for the arguments of a function (_pre-condition_) is not true (not _satisfied_);
3. `((2 >= 0) && (2 < emptyList<Int>().size))`: this is the formula which expresses the "index within bounds" pre-condition more formally. By inspecting this formula, you can see that the first half (`2 >= 0`) is OK, but there are problems with the second half (`2 < emptyList<Int>().size`), since that size is 0;
4. `'2' bound to param 'index'`: this is additional information about the function call;
5. `main function body`: the last part of the message describes branching information. For example, if we had an `if` expression, it would tell us whether we are in the "condition true" branch of the "condition false" branch. When there are no conditions, we just speak of _main function body_.

Errors arising from function calls whose pre-conditions are not safisfied are the **main** type of problems you'll encounter in the usage of Arrow Analysis.

## Checks in functions

Arrow Analysis extends the contract mechanism provided by Kotlin, and attaches two pieces of information to each function:

- its _pre-conditions_ describe what should be true about the arguments given to a function call,
- its _post-conditions_ describe what is true about the returned value of the function. Note that it only makes sense to talk about post-conditions once we know the pre-conditions hold.

Let's write a small function which increments an integral value:

```kotlin
fun increment(x: Int): Int = x + 1
```

However, in our domain it only makes sense to call this function with positive numbers: the perfect job for a pre-condition. Alas, adding this pre-condition forces us to turn the simple function into a block and use `return`.

```kotlin
import arrow.analysis.pre

fun increment(x: Int): Int {
  pre(x > 0) { "value must be positive" }
  return x + 1
}
```

You can check that the pre-condition works by calling the function with a negative number.

```kotlin
val example = increment(-1)
```
```plain
e: pre-condition `value must be positive` is not satisfied in `increment(-1)`
  -> unsatisfiable constraint: `(-1 > 0)`
```

### Post-conditions

But what about if we change the code to the following?

```kotlin
val example = increment(increment(1))
```

A very similar error arises:

```plain
e: pre-condition `value must be positive` is not satisfied in `increment(increment(1))`
-> unsatisfiable constraint: `(increment(1) > 0)`
```

This error tells us that Arrow Analysis was not able to deduce whether `increment(1)` is positive or not. To fix the problem, we need to introduce a _post-condition_, a **promise** about the result of the function. In this case, we know that given a positive number, the result of incrementing it is also positive.

```kotlin
import arrow.analysis.pre
import arrow.analysis.post

fun increment(x: Int): Int {
  pre(x > 0) { "value must be positive" }
  return (x + 1).post({ it > 0 }) { "result is positive" }
}
```

The post-condition is attached to the result value of the function. The first argument works in a special way: it should be a lambda whose argument represents the return value. You'll often see `{ it > 0 }` in this docs, but feel free to write it as `{ result -> result > 0 }` if that looks better for you.

Most importantly, the error in the double call of `increment` is now gone! 😌

Arrow Analysis does not blindly accept any post-condition you write, the tool ensure it's actually true. If you change it to `{ it < 0 }`, you get an error:

```
e: declaration `increment` fails to satisfy the post-condition: ($result < 0)
```

## Invariants in classes

Imagine now that this notion of being positive occurs very often in your domain. It makes sense then to introduce a new _type_ for this concept, and to ensure that any usage obbeys the positiveness condition. In this case we talk about an _invariant_, something which is always true when using that particular type.

Arrow Analysis turns your `require`s in classes into checks at compile time.

```kotlin
class Positive(val value: Int) {
  init { require(value > 0) }
}
```

The following code is rejected with a very similar error to the ones above:

```kotlin
val positiveExample = Positive(-1)
```

The tool is powerful enough to track the invariants of every value involved in a computation. For example, we can introduce an addition operation with two `Positive` numbers, and we can check statically that the result is again a positive number (otherwise we would not be allowed to construct an instance of `Positive`).

```kotlin
fun Positive.add(other: Positive) =
  Positive(this.value + other.value)
```

## Going further

This Quickstart shows the basic features of Arrow Analysis. The rest of the documentation describes all its features in depth, including thorough explanations about how to track information about properties of an object, and how to deal with mutability.
