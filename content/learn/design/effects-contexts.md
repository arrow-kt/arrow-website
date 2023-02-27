---
sidebar_position: 2
---

# Effects and contexts

How you model data is a very important part of the design of your software. The other important side is how you model your **behaviors**. This is what we are going to talk about today: how to simplify your code with effects, avoiding heavyweight dependency injection frameworks on the go.

> This article was originally published at [47 Degrees' blog](https://www.47deg.com/blog/effects-contexts/).

For every single function you write, there's often some _main_ data you require, and a bunch of other ancillary pieces, the _context_. The typical example is a function to write some user information to the database: apart from the `User` itself, you need a `DatabaseConnection`, and maybe a way to `log` potential issues. One possibility is to make everything a parameter, as follows.

```kotlin
suspend fun User.saveInDb(conn: DatabaseConnection, logger: Logger) {
  // prepare something
  val result = conn.execute(update)
  if (result.isFailure) logger.log("Big problem!")
  // keep doing stuff
}
```

This has an advantage: everything is **explicit**. You know exactly what you need to run this function. But there's a big disadvantage too: everything is **explicit**. This means that you need to manually thread all this context in your functions. This also means a lot of boilerplate mudding your code, and decreased _maintainability_, as any change on the context required for some piece of code could create a domino effect in the rest of the code.

This problem isn't new, of course; this is our old friend **dependency injection** (DI). In short, we want to have all the pieces we need, but don't want to thread them. The world knows no shortage of DI frameworks, but almost all of them suffer from two disadvantages:

- Dependencies are not reflected as part of the type, so they become part of a _hidden_ contract. We prefer explicitness for two reasons: (1) the rest of the team can discover the dependencies without looking in the body of the function or how it's used, and (2) the compiler can perform some sanity checks for us.
- Dependency injection does not use the same vocabulary as the rest of the code. We prefer ways to model this problem using features of the language, instead of relying on magic such as annotation processing.

## Dependencies as receivers

The technique we want to present today takes a similar starting point to many others: define each of your dependencies as **interfaces**, which we usually call **effects**. Remember to mark all of your functions with `suspend`. This allows for better control both on the effect level and the runtime level. In the case of a database connection, the interface can be as easy as a function returning it.

```kotlin
interface Database {
  suspend fun connection(): DatabaseConnection
}
```

We always suggest exposing a more constrained API, though. In this case, instead of giving up all your control of the connection, we may provide a way to execute a query. This opens the door to `execute` queueing the queries, for example.

```kotlin
interface Database {
  suspend fun <A> execute(q: Query<A>): Result<A>
}
```

Regardless of your choice, the final step is to make this interface your _receiver_ type. As a consequence, your `User` must now appear as argument, and you can directly call `execute`, since it comes from the receiver `Database` interface.

```kotlin
suspend fun Database.saveUserInDb(user: User) {
   // prepare something
  val result = execute<User>(update)
  // do more things
}
```

This solution is explicit, as `Database` appears as part of the type of `saveUserInDb`, but avoids lots of boilerplate by using one Kotlin feature: receivers.

### Injecting

We can provide different incarnations of `Database` by creating new objects implementing the aforementioned interface. The most straightforward is simply wrapping a `DatabaseConnection`, as we were doing previously:

```kotlin
class DatabaseFromConnection(conn: DatabaseConnection) : Database {
  override suspend fun <A> execute(q: Query<A>): Result<A> =
    conn.execute(q)
}
```

This is not the only one: the execution may work in a pool of connections, or we could be using an in-memory database for testing.

```kotlin
class DatabaseFromPool(pool: ConnectionPool) : Database { ... }
class InMemoryDatabase() : Database { ... }
```

The [scope function `with`](https://kotlinlang.org/docs/scope-functions.html#with) is one of Kotlin's idiomatic ways to provide the value of a receiver. In most cases, we would use a block right after it, in which `Database` is already made available.

```kotlin
suspend fun main() {
  val conn = openDatabaseConnection(connParams)
  with(DatabaseFromConnection(conn)) {
    saveUserInDb(User("Alex"))
  }
}
```

Some teams prefer to bundle the whole create the wrapping object + call `with` into specialized **runner** functions. In that case, a clear pattern appears, in which the last parameter of such runner is a function that consumes that receiver.

```kotlin
suspend fun <A> db(
  params: ConnectionParams,
  f: suspend Database.() -> A): A {
  val conn = openDatabaseConnection(connParams)
  return with(DatabaseFromConnection(conn), f)
}

suspend fun main() {
  db(connParams) { saveUserInDb(User("Alex")) }
}
```

### Always `suspend`

Strong statements require strong justifications, and we've made one when we said that we *always* mark the functions in our effects with the `suspend` modifier. To understand the justification, we need to dive a bit into the difference between _describing_ some computation and actually _executing_ it.

Most of the time, we think of computation as happening "on the spot." Whenever the program arrives to my `println("Hello!")`, it's going to immediately execute it. This model is simple; on the other hand, it's also problematic for a couple of reasons:

- If the `println` was in code we do not control, it's imposing on us a so-called _side effect_ that we cannot easily handle or get rid of.
- Immediate executing the code denies us the possibility of modifying parameters of this execution: maybe we wanted it to happen in a different thread. For example, because this is part of a graphical interface that requires some operations to happen in a specific "UI thread."

The `suspend` modifier in Kotlin avoids these problems, because such a function is *not* immediately executed. We can still compose those functions — in fact, Kotlin makes it so easy that it looks as we were writing "normal" code —. But `suspend` functions by themselves are only **descriptions** of what ought to be done. As a very simplistic approximation, think of a function `() -> Int`: such a function is *not yet* an integral number, but a recipe to obtain one.

Once you've built the entire description, you can **execute** it in many different ways. The simplest one is [`runBlocking`](https://kotlinlang.org/docs/coroutines-basics.html). By marking all the functions in our effects as `suspend`, we give freedom to both implementors of instances (who may choose to introduce additional threading, for example) and end users of the effects (who can ultimately decide how to spawn the initial computation).

If you squint your eyes a bit more, the type of `runBlocking` actually looks suspiciously similar to the `db` function defined above.

```kotlin
fun <T> runBlocking(
  context: CoroutineContext = EmptyCoroutineContext,
  block: suspend CoroutineScope.() -> T): T
```

Here, `CoroutineScope` is the effect related to handling concurrency since it provides functions like `cancel` or `launch`.

This notion of separating description from execution of code is by no means new. The Scala community has been playing with this idea for a long time, as witnessed by [Cats Effect](https://typelevel.org/cats-effect/) or [ZIO](https://zio.dev/). Those libraries, however, cannot get to the same level of integration as Kotlin's built-in `suspend`. For deeper insight on the use of `suspend` as effects, check the _Coroutines_ section in this site.

## More than one dependency

I know what you're thinking: "where's the `Logger`?" Indeed, this technique requires a bit of refinement if your context is comprised of more than one effect. Let's start by defining the interface for logging:

```kotlin
interface Log {
  suspend fun log(message: String): Unit
}
```

Here comes the trick: since contexts are interfaces, we can represent requiring both effects as a _subclass_ of both. For this, we bring in a not so well-known feature in Kotlin: [`where` clauses](https://kotlinlang.org/docs/generics.html#upper-bounds). Simply stated, `where` clauses allow us to define more than one upper bound for a generic type. Let's see it in action:

```kotlin
suspend fun <Ctx> Ctx.saveUserInDb(user: User)
  where Ctx : Database, Ctx : Log {
  // prepare something
  val result = execute(update)
  if (result.isFailure) log("Big problem!")
  // keep doing stuff
}
```

This pattern slowly grows on you, and at the end, you always define your functions using a **context receviver** `Ctx`, whose effects you define later as upper bounds using `where`.

The main problem is now how to inject the required instances of `Database` and `Log` so you can call `saveUserInDb`. Unfortunately, the following does **not** work, even though we have those two instances at hand.

```kotlin
suspend fun main() {
  db(connParams) { stdoutLogger {
    saveUserInDb(User("Alex"))
  } }
}
```

The problem is that `saveUserInDb` expects both of them packed into a single context object. We can work around it by creating an object on the spot, and using delegation to refer to the previously-created instances.

```kotlin
suspend fun main() {
  db(connParams) { stdoutLogger {
    with(object : Database by this@db, Logger as this@stdoutLogger) {
      saveUserInDb(User("Alex"))
    }
  } }
}
```

The main restriction is that you can**not** inject two values whose type only depend on different type parameters due to JVM erasure. For example, imagine we had defined a generic "environment value" effect.

```kotlin
interface Environment<A> {
  suspend fun get(): A
}
```

Then we cannot define a context requiring `Environment<ConnectionParams>` and `Environment<AppConfig>`. In practice, this is not so problematic, as you often want to introduce more specialized interfaces, and constraint your usage as outlined above for `Database`.

### Looking at the future

The future looks quite bright for Kotliners in this respect. Since a few versions the language includes [_context receivers_](https://github.com/Kotlin/KEEP/issues/259), which would allow bringing a cleaner design for what we are describing using subtyping. Using context receiver we're able to state:

```kotlin
context(Database, Logger)
fun User.saveInDb() { ... }
```

and inject the values by simply nesting the calls to `db` and `stdoutLogger`. Note that sometimes you need a more powerful `with` function than the one provided by the standard library, like [this one](https://gist.github.com/carbaj03/4ebd0f8da17c351d4235e1bedd9a36b5), which admits subtyping within contexts.

## Contexts, effects, algebras

Kotlin's documentation often talks about _contexts_ when describing this [usage of receivers](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it). We often use _effect_ instead; this term is used in functional programming to describe everything done by a function outside data manipulation. Some usages in that respect are "effect handlers" in [many](https://hackage.haskell.org/package/freer-simple) [Haskell](https://hackage.haskell.org/package/fused-effects) [libraries](https://github.com/hasura/eff), or [Cats effect](https://typelevel.org/cats-effect/) in the Scala community.

This technique is also related to [tagless final](https://www.baeldung.com/scala/tagless-final-pattern) as approached in Scala. In that case, we would refer to our `Database` interface as an _algebra_. There's an important distinction though: whereas tagless final uses heavyweight type machinery available only in Scala (and Haskell), the technique in this blog post uses **simpler mechanisms** offered by Kotlin.
