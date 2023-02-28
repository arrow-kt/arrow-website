---
sidebar_position: 2
---

# Resource

<!--- TEST_NAME ResourceTest -->

Allocation and release of resources is not an easy task, especially when
we have multiple resources that depend on each other. The Resource DSL
adds the ability to _install_ resource, and ensure proper finalization even
in the face of exceptions and cancellations. Arrow's Resource co-operated
with Structured Concurrency, and KotlinX Coroutines.

You can use Arrow's Resource in two ways:

1. Using `resourceScope` and functions with `ResourceScope` as its receiver.
2. Wrapping the entire resource allocation and release as a `Resource<A>` value,
   which we later `use` in a larger block.

## Setting up the stage

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
  5. Cannot run suspend functions upon _fun close(): Unit_.
  6. No exit signal, we don't know if we exited successfully, with an error or cancellation.

Resource solves of these issues. In order to use it, we need to define 3 different steps for each resource.
  1. Acquiring the resource of `A`.
  2. Using `A`.
  3. Releasing `A`.
Then we can compose several of these resources, and ensure that everything works correctly.

We rewrite our previous example to [Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) below by:
 1. Define [Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) for `UserProcessor`.
 2. Define [Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) for `DataSource`, that also logs the [ExitCase](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-exit-case/index.html).
 3. Compose `UserProcessor` and `DataSource` [Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) together into a [Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) for `Service`.

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
<!--- KNIT example-resource-03.kt -->

There is a lot going on in the snippet above, which we'll analyse in the sections below.
Looking at the above example it should already give you some idea if the capabilities of [Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html).

## Resource constructors

[Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) works entirely through a DSL,
which allows _installing_ a `Resource` through the `suspend fun <A> install(acquire: suspend () -> A, release: suspend (A, ExitCase) -> Unit): A` function.

`acquire` is used to _allocate_ the `Resource`,
and before returning the resource `A` it also install the `release` handler into the `ResourceScope`.

We can use `suspend fun` with `Scope` as an extension function receiver to create synthetic constructors for our `Resource`s.
If you're using _context receivers_ you can also use `context(Scope)` instead.

<!--- INCLUDE
import arrow.fx.coroutines.ResourceScope
import arrow.fx.coroutines.Resource
import arrow.fx.coroutines.resource
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
suspend fun ResourceScope.userProcessor(): UserProcessor =
  install({  UserProcessor().also { it.start() } }) { processor, _ ->
    processor.shutdown()
  }
```

We can of course also create `lazy` representations of this by wrapping `install` in [resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/resource.html) and returning the `suspend lambda` value instead.

```kotlin
val userProcessor: Resource<UserProcessor> = resource {
  val x: UserProcessor = install(
    {  UserProcessor().also { it.start() } },
    { processor, _ -> processor.shutdown() }
  )
  x
}
```
<!--- KNIT example-resource-04.kt -->

## Scope DSL

The [ResourceScope](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines.continuations/-resource-scope/index.html) DSL allows you to _install_ resources, and interact with them in a safe way.

Arrow offers the same elegant `bind` DSL for Resource composition as you might be familiar with from Arrow Core. Which we've already seen above, in our first example.
What is more interesting, is that we can also compose it with any other existing pattern from Arrow!
Let's compose our `UserProcessor` and `DataSource` in parallel, so that their `start` and `connect` methods can run in parallel.

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
  install({ UserProcessor().also { it.start() } }){ p,_ -> p.shutdown() }

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
<!--- KNIT example-resource-05.kt -->

## Conclusion

[Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) guarantee that their release finalizers are always invoked in the correct order when an exception is raised or the [kotlinx.coroutines.Job](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/) is running gets canceled.

To achieve this [Resource](https://arrow-kt.github.io/arrow/arrow-fx-coroutines/arrow.fx.coroutines/-resource/index.html) ensures that the `acquire` & `release` step are [NonCancellable](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-non-cancellable/).
If a cancellation signal, or an exception is received during `acquire`, the resource is assumed to not have been acquired and thus will not trigger the release function.
 => Any composed resources that are already acquired they will be guaranteed to release as expected.

https://arrow-kt.io/docs/apidocs/arrow-fx-coroutines/arrow.fx.coroutines/-resource/

## Resource + Raise

https://kotlinlang.slack.com/archives/C5UPMM0A0/p1677093177834299
