---
title: Graceful shutdown
---

import { useCurrentSidebarCategory } from '@docusaurus/theme-common';
import DocCardList from '@theme/DocCardList';

# Graceful shutdown

When building applications that require graceful shutdown it typically requires us to write a lot of platform-specific
code. This library aims to solve that problem by leveraging Kotlin MPP using KotlinX Coroutines, and Structured Concurrency.

:::info Media resources

- [_Graceful Shutdown with Structured Concurrency_](https://kotlindevday.com/videos/grateful-shutdown-with-structured-concurrency-simon-vergauwen/) by Simon Vergauwen

:::

:::note SuspendApp

For historical reasons, the `suspendapp` library follows its own versioning scheme. Please check [Maven Central](https://central.sonatype.com/artifact/io.arrow-kt/suspendapp) for the latest release information.

:::

## Simple example

When you see `App Started! Waiting until asked to shutdown.` try pressing
_Ctrl+C_ to signal interruption (`SIGINT`) to the process.
You can also use `ps -ax` to find the PID and call `kill PID` to send a
`SIGTERM` event to the process.

```kotlin
import arrow.continuations.SuspendApp
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext

fun main() = SuspendApp {
  try {
    println("App Started!  Waiting until asked to shutdown.")
    while (true) {
      delay(2_500)
      println("Ping")
    }
  } catch (e: CancellationException) {
    println("Cleaning up App... will take 10 seconds...")
    withContext(NonCancellable) { delay(10_000) }
    println("Done cleaning up. Will release app to exit")
  }
}
```
<!--- KNIT example-suspendapp-01.kt -->

:::note

Since our `CoroutineScope` is cancelled we need to run our `delay` in `NonCancellable`.

:::

## SuspendApp Arrow's Resource

[Resource](../../../learn/coroutines/resource-safety/)
allows for modeling resources within the `suspend` world,
and properly takes into account structured concurrency and cancellation.
This means that when a `CoroutineScope` gets cancelled, then any _suspend finalizer_ will _back pressure_ `Job#join`.
And thus when you call `cancelAndJoin` on a `CoroutineScope` it will properly await the `finalizers` to have finished
running.

With SuspendApp this means that if someone sends a terminal signal such as `SIGINT` or `SIGTERM` to the application
then it will run all the _suspend finalizers_ before closing the application.

<!--- INCLUDE
import arrow.continuations.SuspendApp
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.delay
import kotlinx.coroutines.withContext
import kotlinx.coroutines.awaitCancellation
import arrow.fx.coroutines.resourceScope
-->

```kotlin
fun main() = SuspendApp {
  resourceScope {
    install({ println("Creating some resource") }) { _, exitCase ->
      println("ExitCase: $exitCase")
      println("Shutting down will take 10 seconds")
      delay(10_000)
      println("Shutdown finished")
    }
    println("Application running with acquired resources.")
    awaitCancellation()
  }
}
```
<!--- KNIT example-suspendapp-02.kt -->

In the example above we have a `Resource` that during _acquisition_ will print `Creating some resource`,
when the `Resource` needs to be closed, _release_, we print the `ExitCase` with which the `Resource` was closed, and
then we wait for 10 seconds. The `Resource` already takes care of calling `release` on a `NonCancellable` context.

We consume the `Resource` until our application is cancelled by calling `awaitCancellation` from KotlinX Coroutines.
That gives us the following output, if you press _Ctrl+C_ in the terminal.

```text
Creating some resource
Application running with acquired resources.
^CExitCase: Cancelled(exception=kotlinx.coroutines.JobCancellationException: LazyStandaloneCoroutine was cancelled; job=LazyStandaloneCoroutine{Cancelling}@f7470010)
Shutting down will take 10 seconds
Shutdown finished
```

:::tip

You can find this example in the [repository](https://github.com/arrow-kt/suspendapp/tree/main/example), currently setup for NodeJS and native targets.

:::

## Running on different platforms

For more details on Kotlin Multiplatform configuration consult the [official documentation](https://kotlinlang.org/docs/multiplatform.html).
Just `./gradlew build` the project, and launch the created binaries as shown in the sections belows.

:::note Currently supported targets

- JVM
- MacOsX64 & MacosArm64
- NodeJS
- Windows (MingwX64)
- Linux

SuspendApp currently does not support any mobile or browser targets because it does not make sense to have such
application behavior on such platforms. If you have a use-case for this please [open a ticket](https://github.com/arrow-kt/suspendapp/issues)!

:::

### Node.js

Make sure you configure your NodeJS app to be executable.

```
js(IR) {
  nodejs {
    binaries.executable()
  }
}
```

You can run your NodeJS app with the following `node` command,
and if you press _Ctrl+C_ within the first 2500ms you will see the following output.

```text
node build/js/packages/YourAppName/kotlin/YourAppName.js

App Started! Waiting until asked to shutdown.
^CCleaning up App... will take 10 seconds...
Done cleaning up. Will release app to exit
```

### Native

Make sure you configure your Native app(s) to be executable.

```
linuxX64 {
  binaries.executable()
}
mingwX64 {
  binaries.executable()
}
macosArm64 {
  binaries.executable()
}
macosX64 {
  binaries.executable()
}
```

You can run your Native app with the following command,
and if you press _Ctrl+C_ within the first 2500ms you will see the following output.

```text
./gradlew build
build/bin/native/releaseExecutable/YourAppName.kexe

App Started! Waiting until asked to shutdown.
^CCleaning up App... will take 10 seconds...
Done cleaning up. Will release app to exit
```
