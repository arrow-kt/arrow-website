---
authors: vergauwen_simon
description: This is my first post on Docusaurus 2. And this is more text for the description. I just want this to be broken.
image: /img/sample-image.jpg
tags: [arrow, kotlin]
---

# My first Kotlin Blogpost

This document includes some code snippets and some other stuff.
There are three different kinds of _tested_ snippets we can write,
and two ways you can get them to generate both the example **and** the test.

<!--- TEST_NAME BasicTest -->

## Verifying the output of System.out

We can quite simply verify the output of a snippet by writing a snippet like this,
and writing an accompanying text block with the output below.
Here we tell knit to generate both the example and the test by adding the **link** and `<!--- TEST -->` directive.
When the link matches the `knit.dir` specified in `knit.properties` it will generate both the example and the test.

```kotlin
fun example() {
    println("Hello World!")
}
```
> You can get the full code [here](../../guide/src/test/kotlin/examples/example-basic-01.kt)

```text
Hello World!
```

<!--- TEST -->

We can do the same for another snippet, but this time we specify knit to generate an example using the `KNIT` directive.

```kotlin
fun example() {
    println("Hello World 2!")
}
```

<!--- KNIT example-basic-02.kt -->

```text
Hello World 2!
```
<!--- TEST -->

## Verifying the output using custom logic

We can also verify the output using custom logic, by specifying it inside of `TEST` directive.
This can be useful for asserting output that is very long, or non-deterministic. 

<!--- INCLUDE
import arrow.fx.coroutines.parMap
import kotlinx.coroutines.Dispatchers
-->
```kotlin
suspend fun example() {
  (1..100).parMap(Dispatchers.Default) { println("${Thread.currentThread().name} ~> $it") }
}
```

<!--- KNIT example-basic-03.kt -->
<!--- TEST lines.all { it.startsWith("DefaultDispatcher-worker") } && lines.size == 100 -->

## Verifying the snippet using assertions

And we can have a final example where we use assertions, instead of verifying the output.
We in this case add an import for `shouldBe`, and specify the `TEST assert` param.

<!--- INCLUDE
import io.kotest.matchers.shouldBe
-->
```kotlin
fun example() {
    "Hello World 3!" shouldBe "Hello World 3!"
}
```

<!--- KNIT example-basic-04.kt -->
<!--- TEST assert -->
