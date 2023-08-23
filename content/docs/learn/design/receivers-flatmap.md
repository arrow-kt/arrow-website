---
title: Receivers vs. flatMap
sidebar_position: 3
---

<head>
  <link rel="canonical" href="https://xebia.com/blog/the-suspend-receivers-style-in-kotlin/" />
</head>

:::note This article was originally published at [Xebia's blog](https://xebia.com/blog/the-suspend-receivers-style-in-kotlin/). 

:::

The Arrow project promotes a particular style of Kotlin to achieve the composability of effects. Functional programming patterns inspire many concepts, but the implementation differs significantly from Haskell's or Scala's typical way of doing things (monads, `IO`, and transformers). This article aims to clarify how this style works in Kotlin, compare it to other sibling languages, and discuss the main limitations.

We assume the reader is familiar with the transformer-style of effects. Good resources to understand that style are [Scala with Cats](https://underscore.io/books/scala-with-cats/), [Practical FP in Scala](https://leanpub.com/pfp-scala), or the [Book of Monads](https://leanpub.com/book-of-monads).

:::caution

Context receivers are still experimental. There are still some rough edges when mixing them with `suspend` and `inline`, but the Kotlin team is putting lots of effort into making them stable.

:::

## Effects

Before diving into the technical portion, let's discuss what we _aim_ to achieve when talking about _effects_. The idea is to be _explicit_ about the visible behavior of a function in its signature, since that allows for more powerful compiler checks and analyses. By default, this is only the case for _pure_ functions, which is a fancy way of saying "functions that only do computation." Take the following function:

```kotlin
fun add(x: Int, y: Int): Int = x + y
```

Here the types are "honest;" we always get back a number, and such a number depends only on the input arguments. In Kotlin, we can easily sneak in other behaviors, which we often call _side effects_. We could print some value,

```kotlin
fun loggingAdd(x: Int, y: Int): Int {
  println("x = $x, y = $y")
  return x + y
}
```

or, going further, roll back the execution trace with an exception, but only at some random times.

```kotlin
fun crazyAdd(x: Int, y: Int): Int {
  if (Random.nextInt() == 42) throw WhatsHappeningException()
  return x + y
}
```

The goal is to shed light on those effects, making the potential behavior directly apparent. A function like the latter gets a type closer to

```kotlin
context(Raise<WhatsHappeningError>, Random)
fun crazyAdd(x: Int, y: Int): Int
```

Again, this is an extreme example, but think of those effects as network communication, access to the file system; or, more granularly, reading the initial configuration or using the repository object for some part of the domain. The following signature is very explicit in telling that the function may or not return a value (because of the nullable return type), it may use the user repository (so we expect some kind of database access), and there's the possibility of an error (which is different from a non-existing value).

```kotlin
context(Raise<WhatsHappeningError>, UserRepository)
suspend fun getUserById(id: UserId): User?
```

The question is: how do we encode those effects using the _type system_? This is where the Kotlin and Haskell / Scala ways significantly differ.

## Two Kotlin built-in features

To model and execute effects in a performant fashion, we recommend using _coroutines_ and _context receivers_ profusely in Kotlin. This section briefly introduces each feature and discusses its role in the overall pattern.

[Coroutines](https://kotlinlang.org/docs/coroutines-overview.html) are _suspendable_ functions. From the developer's point of view, these functions are marked with the `suspend` keyword,

```kotlin
suspend fun getUserById(id: UserId): User?
```

The Kotlin language knows how to combine several suspended functions without the developer's intervention. In other words, coroutines are transparent for developers, except for the requirement of marking functions using them. We can even mix suspended functions with regular functions, as with the `.name` field access here.

```kotlin
suspend fun getUserName(id: UserId): String? =
  getUserById(id)?.name
```

Although coroutines are often explained together with the concurrency mechanisms from [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines), those are separate ideas. Coroutines allow _fine-grained control_ over the computations within a `suspend` block. Concurrency is one form of exercising this control, deciding when and in which threads computations will happen. But this is not the only one,

- [Inikio](http://serranofp.com/inikio/) is a library that leverages `suspend` to create "imperative" syntax for domain-specific languages;
- Arrow provides [computation builders](https://github.com/arrow-kt/arrow/tree/main/arrow-libs/core/arrow-core/src/commonMain/kotlin/arrow/core/computations) where you can write functions over `Either`, `Result`, or nullable types without having to check for the error path at each step.

The ability to control computation in that way comes from the transformation performed by the compiler into [_continuation-passing style_](https://en.wikibooks.org/wiki/Haskell/Continuation_passing_style). Long story short, our functions above really take an additional argument -- the continuation -- which is "fed" the resulting value of the function.

```kotlin
fun getUserById(id: UserId, k: Continuation<User?>)

fun getUserName(id: UserId, k: Continuation<String?>) =
  getUserById(id) { user -> user?.let { k.resume(it.name) } }
```

At a conceptual level, you can think of `Continuation<A>` as simply a function `(A) -> Unit`. This means the caller can change how the function "returns," by changing the continuation passed as parameter `k`.

The second feature in the Kotlin language required for the proposed style is [context receivers](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md), which were introduced in version 1.6.20. For an in-depth discussion of this new feature, you can check this [talk](https://www.youtube.com/watch?v=2oiRCYnqhDs) or the corresponding [slides](https://serranofp.com/kotlin-xl-ctx/slides). Very briefly, context receivers can be thought of as _implicit_ parameters, or as a sort of built-in dependency injection. Let's say we define an interface for our user repository,

```kotlin
interface UserRepository {
  suspend fun getUserById(id: UserId): User?
}
```

Then we can make that repository available in another function by putting it as part of the `context` declaration.

```kotlin
context(UserRepository)
suspend fun getUserName(id: UserId): String? =
  getUserById(id)?.name
```

This signature could also be written as `suspend context(UserRepository) fun`, but we've decided to write the contexts first to highlight them.

The example above shows that, if you have a `UserRepository` in your `context`, then you can call any other function requiring that context -- here `getUserById` -- without further ceremony. This composability extends as much as you want; the `getUserName` may again be called by another function with the same context. At some point, we need to _inject_ the actual implementation, though; this is done using the `with` function,

```kotlin
fun example() {
  createDbConnection().use { db ->
    with(DbUserRepository(db)) {
      println(getUserName(UserId(1)))
    }
  }
}
```

In this case, the implementation connects to a database, but we could also inject a different in-memory object for testing. This is where the _dependency injection_ idea comes into play.

Context receivers are a generalization of an older Kotlin feature called [extension receivers](https://kotlinlang.org/docs/extensions.html). Although its original use was to "extend" the functionality of a class while preserving the `.function` syntax for access members, they've also been used to describe _scopes_ where certain additional functionality is available. Here's the (simplified) signature of the [`async`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) function, which spawns a computation in a new lightweight thread,

```kotlin
fun <T> CoroutineScope.async(block: suspend CoroutineScope.() -> T): Deferred<T>
```

This signature states that `async` may only be called _within_ a `CoroutineScope` block, and that the spawned computation represented by the `block` argument also gets access to another `CoroutineScope`, so it can launch other jobs itself. If we "modernize" the signature using context receivers,

```kotlin
context(CoroutineScope)
fun <T> async(block: context(CoroutineScope) suspend () -> T): Deferred<T>
```

we can see that those scopes are nothing else than _effects_! This notion is visible in several places in the Arrow library,

- A [`ResourceScope`](https://github.com/arrow-kt/arrow/blob/arrow-2/arrow-libs/fx/arrow-fx-coroutines/src/commonMain/kotlin/arrow/fx/coroutines/Resource.kt) brings the ability to acquire and release resources correctly,
- [`STM`](https://github.com/arrow-kt/arrow/blob/arrow-2/arrow-libs/fx/arrow-fx-stm/src/commonMain/kotlin/arrow/fx/stm/STM.kt) introduces the concept of transactional variables, whose concurrent access is protected.

To perform their duty, `resourceScope` (the "runner" for `ResourceScope`) and `atomically` (the "runner" for `STM`) need control over the computation. That's precisely where the coroutine system becomes necessary.

The emphasis on context receivers comes from their ability to _compose_, unlike the other extension receivers. If a function requires both resource handling and a user repository, we can easily express this using the former

```kotlin
context(UserRepository, ResourceScope)
fun whoKnowsWhatItDoes(name: String)
```

but there's no (simple) way with the latter. We hope this composability encourages developers to create more and finer-grained scopes/effects to be as concrete as possible about the behavior of the functions.

## No monads, no higher-kinded types

Traditionally, the ability to control execution in a similar way to what the coroutine system in Kotlin offers was offered by a _monadic_ interface. More concretely, monads provide a function to combine one sequence of steps with the next step to be performed; this operation is known as `flatMap` or `bind` (`>>=` if you're a Haskeller).

```kotlin
fun <A, B> M<A>.flatMap(next: (A) -> M<B>): M<B>
```

Since the implementor of each particular monad controls the behavior of `flatMap`, at that point, any additional control can be injected. For example, the nullability monad short-circuits any further behavior when a `null` is produced in one of the steps.

```kotlin
fun <A, B> A?.flatMap(next: (A) -> B?): B? = 
  when (this) {
    null -> null
    else -> next(this)
  }
```

One important monad for both Haskell and Scala is the `IO` monad, which marks the code as "impure", that is, as having potential side effects like writing or reading from a device. Note that in the case of Scala, there's not a unified `IO` monad; we have [Cats Effect](https://typelevel.org/cats-effect/api/3.x/cats/effect/IO.html) and [ZIO](https://zio.dev/overview/getting-started) as main examples. In Kotlin [the same can be achieved with `suspend`](https://arrow-kt.io/docs/effects/io/); to start running a suspended computation, we need to call it from `main` or from `runBlocking`, which amounts to the same guarantees as found in Haskell and Scala.

Alas, code written with monads tends to break under the weight of all the `flatMap`s in the way and the nesting associated with them.

```kotlin
doOneThing().flatMap { x ->
  doAnotherThing(x).flatMap { y ->
    // imagine if your code was even longer!
    return x to y
  }
}
```

Therefore, both Scala and Haskell provide specialized syntax to work with monads -- `for` comprehensions for the former, and `do` notation for the latter. The same code can be written much more clearly as

```scala
for {
  x <- doOneThing()
  y <- doAnotherThing(x)
} yield (x, y)
```

This is a step in the right direction, but not _perfect_. In particular, monadic notation enforces a strong divide in style between monadic and non-monadic code. If you even need to introduce some effect to a function, you are forced to _rewrite_ it from the "pure" subset of the language to the "monadic" one. This problem extends not only to blocks of code, but also to the operators available to them. The famous [`traverse`](https://impurepics.com/posts/2020-10-03-always-traverse.html) operation

```scala
def traverse[F[_], A, B](x: List[A], f: A => F[B]): F[List[B]]
```

is nothing else than your regular list `map`, but where `f` may incorporate some effects. Once again, the solution is good, but in a perfect world, you wouldn't ask developers to learn two sets of abstractions if one could do.

The signature of `traverse` shows another essential part of the monadic style of effects, namely _higher-kinded types_. Since monads are types that take other types as parameters -- like `Option` or `Result` --, to provide utility functions that work over different monads, one must have a way to refer to those types. In Scala, this is made explicit by the number of underscores after the type name, like `F[_]` above; in Haskell, this is not made explicit in the signature but is still checked by the compiler. Even decades after their inception, higher-kinded types are still considered an advanced feature and haven't made their way into mainstream programming languages.

Kotlin doesn't require higher-kinded types to provide similar abstraction because the same functions which work over "regular" functions, like `map`, keep working when used in the coroutine world. Continuing with the example above, we can obtain the names of every user's friend by combining `map` and `getUserName`, even though the latter is a suspended function.

```kotlin
context(UserRepository)
suspend fun getUserFriends(id: UserId): List<String> =
  getUserFriendIds(id).map { getUserName(it) }
```

Kotlin language designers have found, in my opinion, a great point in the design space, in which they can offer the same abilities but without the cost of such a complex feature.

### Composition of effects

[Monads have some inherent problems with composition](https://www.youtube.com/watch?v=eZ9FpG8May8), which in practice means that you cannot easily create a new one from the effects of two of them. There are several techniques to overcome this problem, but the main one is _monad transformers_. Instead of being a monad itself, a transformer "wraps" another monad adding some additional capability. For example, the composition of "we keep a stateful `DbConnection`" with "we require a `Config` in context" with "we may perform I/O actions" is represented as follows.

```scala
StateT[DbConnection, ReaderT[Config, IO], User]
```

Note that a transformer like `StateT` has a higher-kind than a regular `State` monad. The latter takes one "regular" type as a parameter, whereas the former takes a monad (that is, a type with a hole) as a parameter. This is one of the most challenging mountains to climb to understand how effects work in Haskell and Scala.

We propose to move away from this style in Kotlin and simply enlarge the `context` required for a function. Context receivers compose without any further instruction from the developer; in that sense, they work similarly to algebraic effects, like those in [`effectful`](https://hackage.haskell.org/package/effectful) or [`polysemy`](https://hackage.haskell.org/package/polysemy). More concretely, unlike monad transformers, you have no fixed order of injection of contexts.

## Errors everywhere!

One interesting application of this style is an ergonomic interface for errors. In Arrow 2.0 [`Raise<E>`](https://github.com/arrow-kt/arrow/blob/main/arrow-libs/core/arrow-core/src/commonMain/kotlin/arrow/core/raise/Raise.kt) is the name of the scope/effect of short-circuiting with an error of type `E`. A function with signature

```kotlin
context(Raise<E>) () -> A
```

can be [executed](https://github.com/arrow-kt/arrow/blob/arrow-2/arrow-libs/core/arrow-core/src/commonMain/kotlin/arrow/core/continuations/Builders.kt) into an `Either`, a `Result` (is `E` is `Throwable`), and many other similar types. However, nothing stops you from having more than one `Raise` in your context if you want to be completely explicit about errors.

```kotlin
context(Raise<DbConnectionError>, Raise<MalformedQuery>)
suspend fun queryUsers(q: UserQuery): List<User>
```

Context receivers play well with variance, so injecting a receiver for `Raise<Any>` can work for _both_ elements in the context simultaneously. Compare this with `EitherT[DbConnectionError, EitherT[MalformedQuery, IO], List[User]]`, where you need to handle each of the `EitherT` independently, and in the order given by the monadic stack.

## Limitations

Continuations are really powerful; in fact [you can use `Cont` to emulate any other monad](https://www.schoolofhaskell.com/school/to-infinity-and-beyond/pick-of-the-week/the-mother-of-all-monads). However, this doesn't speak of the ergonomics of using such emulation, so that argument is not really valid for this discussion. Furthermore, Kotlin imposes some limitations on how coroutines can be used, which limit, in turn, the expressivity of the proposed style.

Kotlin's continuations are _one-shot_, meaning they can only be called _once_. This is enough to model many interesting effects; for those like `ResourceScope` or `CoroutineScope`, you want to call the continuation normally; for those like errors, you may not call them, but that's also allowed. This limitation kicks in, though, if you try to implement the _list_ (also known as _non-determinism_) monad in Kotlin. To give a concrete example, we needed one such abstraction in Arrow Analysis, and the [solution](https://github.com/arrow-kt/arrow-analysis/blob/main/analysis/common/src/main/kotlin/arrow/meta/continuations/ContSeq.kt) requires an explicit `flatMap` whenever you may run the same code more than once.

We shouldn't be too quick to flag one-shot continuations as a mistake. If you are guaranteed to call your code at most once, you can use [all kinds of mutable states](https://kt.academy/article/cc-under-the-hood) to optimize how they work. The cost of allowing several calls means creating a whole closure at each `suspend` call, which is not always negligible. I think the Kotlin designers found a great point in the design space again, knowing that any performance hit would be taken badly by the JVM community they are targeting.

The lack of higher-kinded types in Kotlin means that some patterns can_not_ be abstracted. We already discussed how some of them are no longer needed -- like `traverse` -- but others are still relevant. In particular, higher-kinded types enable abstracting away the typical structure of a monad in the [`Operational`](https://apfelmus.nfshost.com/articles/operational-monad.html) or [`Free`](https://www.tweag.io/blog/2018-02-05-free-monads/) monads. This is impossible in Kotlin, so we must resort to code generation, as done with the [Inikio KSP plug-in](http://serranofp.com/inikio/-inikio/fp.serrano.inikio.plugin/index.html).

## Conclusion

We've described a style of programming in Kotlin based on continuations + context receivers. This style is idiomatic for Kotliners and improves upon the "monadic style" available in other functional languages. Repeat after me: no more `flatMap`!
