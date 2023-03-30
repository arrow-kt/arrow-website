---
sidebar_position: 4
---

# Why suspend over IO

Other functional ecosystems, Scala and Haskell among others,
use a monadic model for side effects. The key component of this model
is a wrapper called `IO`. Arrow has adopted a different model,
based on `suspend` and top-level extension functions over
`suspend () -> A`. This section explains the rationale behind this choice.

The reason for using `IO` is because you care about writing side-effecting code in a safe and referential transparent manner.
Additionally, `IO` offers powerful concurrent operators and cancellation in addition of offering a referential transparent runtime.
These properties are what makes using `IO` powerful, and `suspend` offers the exact same properties but natively in the language with support from the compiler. 

:::info Arrow and Kotlin

One of the main goals of Arrow is to provide APIs which feel idiomatic to
Kotlin developers. This section should be read on that light; what is a good
choice in Kotlin may not have the right trade-offs in other ecosystems.

:::

## Ergonomics

`IO` requires a wrapper in the return type: `fun number(): IO<Int>`, and thus we always have to work with the `IO` type to access the value we care about within.
A typical pattern for this using `flatMap`, so let's say we want to calculate 3 numbers and return them as a `Triple`.
To make the example concrete we use names inspired by [Cats Effect](https://typelevel.org/cats-effect/docs/getting-started).

```kotlin
fun number(): IO<Int> = IO.pure(1)

fun triple(): IO<Triple<Int, Int, Int>> =
  number().flatMap { a ->
    number().flatMap { b ->
      number().map { c ->
        Triple(a, b, c)
      }
    }
  }
```

So simply to call a function 3 times, and combine the result into a `Triple` we had to use `flatMap` twice and `map`.
What that means under the hood we'll discuss in the performance section but in terms of ergonomics this is not ideal.
Especially not if we can compare it to the following `suspend` code.
We can see that we can forget about `flatMap` and `map`, and construct the `Triple` and call `number()` three times directly in the constructor.

```kotlin
suspend fun number(): Int = 1

suspend fun triple(): Triple<Int, Int, Int> = 
  Triple(number(), number(), number())
```

:::tip Conclusion

The ergonomics of `suspend` are clearly better here, and this is a very important point in Kotlin since the language aims for high ergonomics and developer friendly constructs.

:::

## Safety / Purity / Referential transparency

> What guarantees does `IO` bring, and does `suspend` offer the same guarantees?

At a conceptual level, `IO<A>` always results in a successful value, or
finishes with an exception. This can be clearly seen in Cats Effect,
where [`unsafeRunAsync`](https://typelevel.org/cats-effect/api/3.x/cats/effect/IO.html#unsafeRunAsync(cb:Either[Throwable,A]=%3EUnit)(implicitruntime:cats.effect.unsafe.IORuntime):Unit)
results in `Either<Throwable, A>`.
This is done so that any exceptions that occur within the `IO` API can be safely returned to the user, and it can be recovered from at any point in the code.
Important here is that a `Throwable` that occurs in an async thread is safely captured in the `IO` as well and can be recovered from at any point.

`suspend` always results in [`Result<A>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 
which is equivalent to `Either<Throwable, A>`, and it can be used to offer the same safety guarantees as `IO`.
So the `suspend` API can also always return any exception safely to the user, and it can be recovered from at any point in the code.
In contrast to `IO`, we can only find [`startCoroutine`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/start-coroutine.html)
in the standard library, and has the same behavior as `unsafeRunAsync`.
Instead of `f: (Either<Throwable, A>) -> Unit` you provide `f: (Result<A>) -> Unit` to run the `suspend () -> A` program.

:::tip Conclusion

`suspend () -> A` offers us the exact same guarantees as `IO<A>`.

:::

## Effect mixing

In this section we compare the ability to mix two effects, one of them being
the ability to perform side-effectful operations. In particular, we compare
_monad transformers_ to `suspend`.

### Domain errors

When writing functional code style we often want to express our domain errors as clearly as possible, a popular pattern is to return `Either<DomainError, SuccessValue>`.
Let's assume following domain, and compare two snippets: one using `IO<Either<E, A>>`, and another `suspend () -> Either<E, A>`.

```kotlin
import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right

/* inline */ class Id(val id: Long)
object PersistenceError

data class User(val email: String, val name: String)
data class ProcessedUser(val id: Id, val email: String, val name: String)

suspend fun fetchUser(): Either<PersistenceError, User> =
  Right(User("simon@arrow-kt.io", "Simon"))

suspend fun User.process(): Either<PersistenceError, ProcessedUser> =
  if (email.contains(Regex("^(.+)@(.+)$"))) Right(ProcessedUser(Id(1), email, name))
  else Left(PersistenceError)
```

 ```kotlin title="Using IO<Either<E, A>>"
import arrow.fx.*

fun ioProgram(): IO<Either<PersistenceError, ProcessedUser>> =
  IO.fx {
    val res = !IO.effect { fetchUser() }

    !res.fold({ error ->
      IO.just(Either.Left(error))
    }, { user ->
      IO.effect { user.process() }
    })
  }

// Or unwrapped in `suspend`
suspend suspendedIOProgram(): Either<PersistenceError, ProcessedUser> =
  ioProgram().suspended()
 ```

```kotlin title="Using suspend () -> Either<E, A>"
import arrow.core.raise.either

suspend fun suspendProgram(): Either<PersistenceError, ProcessedUser> =
  either {
    val user = fetchUser().bind()
    val processed = user.process().bind()
    processed
  }
```
The above two examples demonstrate how much simpler `suspend` is over its `IO` counterpart and how the `either` computation block allows us to bind values of `Either` to extract their right side all while inside `suspend`. Arrow allows intermixing effects in suspension. What otherwise would have required the `EitherT` transformer over `IO` now it can just be expressed by wrapping in `either` instead

### Dependency injection

We can use extension functions to do functional dependency injection with similar semantics as `Reader` or `Kleisli`.
They allow us to elegantly define syntax for a certain type.

Let's reuse our previous domain of`User`, `ProcessedUser`, but let's introduce `Repo` and `Persistence` layers to mimic what could be a small app with a couple layers.

```kotlin
interface Repo {
  suspend fun fetchUsers(): List<User>
}

interface Persistence {
  suspend fun User.process(): Either<PersistenceError, ProcessedUser>

  suspend fun List<User>.process(): Either<PersistenceError, List<ProcessedUser>> =
    either { map { it.process().bind() } }
}
```

Given the above defined layers we can easily compose them by creating a product which implements the dependencies by delegation.

```kotlin
class DataModule(
  persistence: Persistence,
  repo: Repo
) : Persistence by persistence, Repo by repo
```

We can also define top-level functions based on constraints on the receiver.
Here we define `getProcessedUsers` which can only be called where `R` is both `Repo` and `Persistence`.

```kotlin
/**
 * Generic top-level function based on syntax enabled by [Persistence] & [Repo] constraint
 */
suspend fun <R> R.getProcessedUsers(): Either<PersistenceError, List<ProcessedUser>>
        where R : Repo,
              R : Persistence = fetchUsers().process()
```

## Performance

:::tip In short

`suspend` is extremely fast in comparison to `IO<A>`, since `IO<A>` is built at runtime and `suspend` is built by the compiler.

:::

Working with an actual data type such as `IO<A>` implies that each composition of our program has some allocation cost.
This happens because `IO` requires different data classes to move computation from the stack to the heap in order to compose them and preserve properties such as lazy evaluation semantics. In contrast, when using `suspend`, the Kotlin compiler is aware of function composition on each suspension point and can desugar and specializes the program into more efficient target code. The code generated by the Kotlin compiler is better in terms of allocations and throughput when compared to other implementations of `IO` in the JVM.

Let's take our previous example from ergonomics:
 
```kotlin
import arrow.fx.IO

fun number(): IO<Int> = IO.pure(1)

fun triple(): IO<Triple<Int, Int, Int>> =
  number().flatMap { a ->
    number().flatMap { b ->
      number().map { c ->
        Triple(a, b, c)
      }
    }
  }
```

If we translate this piece of code to the `data class` used, for example, in [Cats Effect](https://github.com/typelevel/cats-effect/blob/series/3.x/core/shared/src/main/scala/cats/effect/IO.scala),
we need no less than 6 `IO` values.

```kotlin
fun number(): IO<Int> = IO.Just(1)

fun triple(): IO<Triple<Int, Int, Int>> =
  IO.FlatMap(IO.Pure(1)) { a ->
    IO.FlatMap(IO.Pure(1)) { b ->
      IO.Map(IO.Pure(1)) { c -> Triple(a, b, c) }
    }
  }
```

This is necessary so when `unsafeRun` is invoked the `IO` program can find the branch representing the kind of operation of `IO` that needs to be interpreted. In the example above `IO.FlatMap`, `IO.Map` or `IO.Pure`

In contrast, `suspend` can simply be wired by the Kotlin compiler eliminating the need for additional `sealed class` declarations and allocations keeping computations in the stack instead of maintaining value level in memory representations of our program. 
The Kotlin compiler rewrites the suspend program to a super fast runtime which uses a switch table and mutable state machine to run the `suspend` program.
Furthermore, the Kotlin compiler applies other optimizations focused on the speed of `suspend` and memory usage of suspension, making it suitable for hot spots and places where otherwise allocations-based data types are not an option.
