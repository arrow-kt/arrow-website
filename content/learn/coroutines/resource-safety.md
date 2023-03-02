---
sidebar_position: 2
---

# Resource

<!--- TEST_NAME ResourceTest -->

Allocation and release of resources is not an easy task, especially when
we have multiple resources that depend on each other. The Resource DSL
adds the ability to _install_ resources, and ensure proper finalization even
in the face of exceptions and cancellations. Arrow's Resource co-operated
with Structured Concurrency, and KotlinX Coroutines.

## Understanding the problem

The following program is **not** safe because it is prone to leak `dataSource` 
and `userProcessor` when an exception, or cancellation signal occurs whilst using the service.

```kotlin
class UserProcessor {
  fun start(): Unit = println("Creating UserProcessor")
  fun shutdown(): Unit = println("Shutting down UserProcessor")
}

class DataSource {
  fun connect(): Unit = println("Connecting dataSource")
  fun close(): Unit = println("Closed dataSource")
}

class Service(val db: DataSource, val userProcessor: UserProcessor) {
  suspend fun processData(): List<String> = 
    throw RuntimeException("I'm going to leak resources by not closing them")
}
```

For example, the following application would leak resources.

```kotlin
suspend fun example() {
  val userProcessor = UserProcessor().also { it.start() }
  val dataSource = DataSource().also { it.connect() }
  val service = Service(dataSource, userProcessor)

  service.processData()

  dataSource.close()
  userProcessor.shutdown()
}
```
<!--- KNIT example-resource-01.kt -->

If we were using Kotlin JVM, we may rely on `Closeable` or `AutoCloseable` and rewrite our code.

<!--- INCLUDE
class UserProcessor : AutoCloseable {
  fun start(): Unit = println("Creating UserProcessor")
  override fun close(): Unit = println("Shutting down UserProcessor")
}

class DataSource : AutoCloseable{
  fun connect(): Unit = println("Connecting dataSource")
  override fun close(): Unit = println("Closed dataSource")
}

class Service(val db: DataSource, val userProcessor: UserProcessor) {
  suspend fun processData(): List<String> = 
    throw RuntimeException("I'm going to leak resources by not closing them")
}
-->
```kotlin
suspend fun example() {
  UserProcessor().use { userProcessor ->
    userProcessor.start()
    DataSource().use { dataSource ->
      dataSource.connect()
      Service(dataSource, userProcessor).processData()
    }
  }
}
```
<!--- KNIT example-resource-02.kt -->

However, while we fixed closing of `UserProcessor` and `DataSource` there are issues still with this code:

  1. It requires implementing `Closeable` or `AutoCloseable`, only possible for Kotlin JVM, not available for Multiplatform.
  2. Requires implementing interface, or wrapping external types with i.e. `class CloseableOf<A>(val type: A): Closeable`.
  3. Requires nesting of different resources in callback tree, not composable.
  4. Enforces `close` method name, renamed `UserProcessor#shutdown` to `close`
  5. Cannot run `suspend` functions within `fun close(): Unit`.
  6. No exit signal, we don't know if we exited successfully, with an error or cancellation.

Resource solves of these issues. The main idea is that each resource has three
stages, 1️⃣ acquiring the resource, 2️⃣ using the resource, and 3️⃣ releasing the
resource. With `Resource` we bundle steps (1) and (3), and the implementation
ensures that everything works correctly, even in the event of exceptions or
cancellations.

## Dealing with resources properly

You can use Arrow's Resource in two ways:

1. Using `resourceScope` and functions with `ResourceScope` as its receiver.
2. Wrapping the entire resource allocation and release as a `Resource<A>` value,
   which we later `use` in a larger block.

### Using `resourceScope`

The `ResourceScope` DSL allows you to _install_ resources, and interact with them in a safe way.
In fact, that's the only operation you need to learn about: `install` takes both
the acquisition and release steps as arguments. The result of this function is
whatever was acquired, plus the promise of running the finalizer at the end of
the block.

:::tip

The Resource DSL gives you enough flexibility to perform different actions
depending on the way the execution finished: successful completion, exceptions, 
or cancellation. The second argument to the finalizer is of type `ExitCase`
and represents the reason why the finalizer is run.

:::

The code below shows our `example` rewritten to use `resourceScope`. Note that
we acquire our `UserProcessor` and `DataSource` in parallel, using the [`parZip`
operation in Arrow](../parallel). This means that their `start` and `connect` 
methods can run in parallel.

<!--- INCLUDE
import arrow.fx.coroutines.ResourceScope
import arrow.fx.coroutines.resourceScope
import arrow.fx.coroutines.parZip
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserProcessor {
  suspend fun start(): Unit = withContext(Dispatchers.IO) { println("Creating UserProcessor") }
  suspend fun shutdown(): Unit = withContext(Dispatchers.IO) {
    println("Shutting down UserProcessor")
  }
}

class DataSource {
  suspend fun connect(): Unit = withContext(Dispatchers.IO) { println("Connecting dataSource") }
  suspend fun close(): Unit = withContext(Dispatchers.IO) { println("Closed dataSource") }
}

class Service(val db: DataSource, val userProcessor: UserProcessor) {
  suspend fun processData(): List<String> = (0..10).map { "Processed : $it" }
}
-->
```kotlin
suspend fun ResourceScope.userProcessor(): UserProcessor =
  install({ UserProcessor().also { it.start() } }) { p, _ -> p.shutdown() }

suspend fun ResourceScope.dataSource(): DataSource =
  install({ DataSource().also { it.connect() } }) { ds, _ -> ds.close() }

suspend fun example(): Unit = resourceScope {
  val service = parZip({ userProcessor() }, { dataSource() }) { userProcessor, ds ->
    Service(ds, userProcessor)
  }
  val data = service.processData()
  println(data)
}
```
<!--- KNIT example-resource-03.kt -->

The code above also showcases a very common pattern on resource acquisition:
running the constructor, following by calling some start method using Kotlin's
`also` scope function.

:::note

To achieve its behavior, `install` invokes the `acquire` and `release` step
as [NonCancellable](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/).
If a cancellation signal, or an exception is received during `acquire`, the 
resource is assumed to **not** have been acquired and thus will not trigger the
release function; any composed resources that are already acquired are guaranteed 
to release as expected.

:::

### Interfacing with Java

If you're running on the JVM, Arrow provides built-in integration with
[`AutoCloseable`](https://docs.oracle.com/javase/8/docs/api/java/lang/AutoCloseable.html)
in the form of the [`closeable`](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/closeable.html) function.

### Using `Resource`

The usage of `resource` is very similar to `install`. The main difference
is that the result is a value of type `Resource<T>`, where `T` is the type of
the resource to acquire. But such a value doesn't run the acquisition step,
it's simply a _recipe_ describing how that's done; to actually acquire the
resource you need to call `.bind()` inside a `resourceScope`.

<!--- INCLUDE
import arrow.fx.coroutines.Resource
import arrow.fx.coroutines.resource
import arrow.fx.coroutines.resourceScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserProcessor {
  suspend fun start(): Unit = withContext(Dispatchers.IO) { println("Creating UserProcessor") }
  suspend fun shutdown(): Unit = withContext(Dispatchers.IO) {
    println("Shutting down UserProcessor")
  }
}

class DataSource {
  fun connect(): Unit = println("Connecting dataSource")
  fun close(): Unit = println("Closed dataSource")
}

class Service(val db: DataSource, val userProcessor: UserProcessor) {
  suspend fun processData(): List<String> = throw RuntimeException("I'm going to leak resources by not closing them")
}
-->
```kotlin
val userProcessor: Resource<UserProcessor> = resource({
  UserProcessor().also { it.start() }
}) { p, _ -> p.shutdown() }

val dataSource: Resource<DataSource> = resource({
  DataSource().also { it.connect() }
}) { ds, exitCase ->
  println("Releasing $ds with exit: $exitCase")
  withContext(Dispatchers.IO) { ds.close() }
}

val service: Resource<Service> = resource {
  Service(dataSource.bind(), userProcessor.bind())
}

suspend fun example(): Unit = resourceScope {
  val data = service.bind().processData()
  println(data)
}
```
<!--- KNIT example-resource-04.kt -->

:::info

_Why provide two ways to accomplish the same goal?_ 
Although `resourceScope` provides nicer syntax in general, some usage patterns
like acquiring several resources become easier when the steps are saved in
an actual class.

:::

Although the main usage pattern is to give `resource` the acquisition and 
release steps directly, there's another way to define a `Resource<T>`.
For more complex scenarios Arrow provides a `resource` which takes a block
with `ResourceScope` as receiver. That allows calling `install` as required.

<!--- INCLUDE
import arrow.fx.coroutines.Resource
import arrow.fx.coroutines.resource
import arrow.fx.coroutines.resourceScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserProcessor {
  suspend fun start(): Unit = withContext(Dispatchers.IO) { println("Creating UserProcessor") }
  suspend fun shutdown(): Unit = withContext(Dispatchers.IO) {
    println("Shutting down UserProcessor")
  }
}
-->
```kotlin
val userProcessor: Resource<UserProcessor> = resource {
  val x: UserProcessor = install(
    {  UserProcessor().also { it.start() } },
    { processor, _ -> processor.shutdown() }
  )
  x
}
```
<!--- KNIT example-resource-05.kt -->

## Integration with typed errors

Note that the combination of `resourceScope` and a [typed error builders](../../typed-errors)
may become quite tricky. The following shows an example of `resourceScope`
nested inside `either`. In that case, a bind that crosses the `resourceScope` 
will result in release finalizer being called with `Cancelled`.

```kotlin
either<Throwable, A> {
  resourceScope {
    val a = install({ }) { _,ex -> println("Closing A: $ex") }
    Either.catch { throw RuntimeException("Boom!") }.bind()
  } // Closing A: ExitCase.Cancelled
} // Either.Left(RuntimeException(Boom!))
```

But if you switch the order of `either` and `resourceScope` then it doesn't 
cancel, but closes with normal state since nothing "failed".

```kotlin
resourceScope {
  either<Throwable, A> {
    val a = install({ }) { _,ex -> println("Closing A: $ex") }
    Either.catch { throw RuntimeException("Boom!") }.bind()
  } // Either.Left(RuntimeException(Boom!))
} // Closing A: ExitCase.Completed
```

This [conversation](https://kotlinlang.slack.com/archives/C5UPMM0A0/p1677093177834299)
in the Kotlin Slack enters into more detail.
