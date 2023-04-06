---
id: migration
title: Migration to Arrow 1.2.0
description: Migration guide to upgrade to Arrow 1.2.0.
sidebar_position: 2
---

# Migration to Arrow 1.2.0

Arrow 1.2.0-RC is a big step in Arrow and marks the last minor version in the 1.x series, and serves as a long term version to over a graceful transition to Arrow 2.0.
All non-deprecated code in 1.2.0-RC is source compatible with 2.0.0, so you can slowly and gracefully migrate your codebase to Arrow 2.0.0 as soon as you want.

Arrow includes a lot of improvements and changes in Arrow 1.2.0-RC, all based on the feedback we've received from the community, and experience from teaching Functional Programming, building applications and knowledge from the other languages and communities.
Any criticism is welcome, and we'll try to improve the migration guide and the library to make it as easy as possible to migrate to Arrow 2.0.0.

In case a deprecated method is crucial for you, please file an issue in the [Arrow repository](https://github.com/arrow-kt/arrow/issues), and so Arrow can consider keeping it in the library or finding an alternative solution.
If you have any issues or questions, feel free to contact the Arrow maintainers in the [KotlinSlack Arrow Channel](https://arrow-kt.io/slack/).

## Either DSL, Effect & EffectScope

Arrow 1.0.0 introduced DSLs to work over functional data types such as `Either`, and enabled several DSLs to work with _typed errors_ in convenient ways.
These DSLs were built on top of `Effect` and `EffectScope`, from the `arrow.core.continuations` package and had several issues, and were deprecated in Arrow 1.2.0-RC.
The biggest issue was that they were not compatible with Kotlin's `suspend` functions, and you needed to explicitly differentiate between `suspend` and `non-suspend` functions.

Arrow 1.2.0-RC introduces a new [`Raise` DSL](https://github.com/arrow-kt/arrow/pull/2912), which resolves this problem and allows Arrow to provide uniform APIs for typed errors across the board.
This heavily reduces the API surface, and makes it easier to learn and use Arrow, and additionally it allows us to build more powerful and flexible APIs.
If you want to learn more about the new `Raise` DSL, check out the [Typed Errors](../../typed-errors) guide.

There are two ways of migrating from the old `Either` DSL to the new `Raise` based DSL.
A third way using [OpenRewrite](https://docs.openrewrite.org) is in the works, and will be added to this guide once it's ready.
You can track the progress in [rewrite-arrow](https://github.com/arrow-kt/rewrite-arrow), and will provide fully automated large-scale migrations.

<details>
<summary>Manual migration using Find + Replace</summary>

## Using `Either`
### Replace `either { }`

- Find + Replace `arrow.core.continuations.either` -> `arrow.core.raise.either`
- Find + Replace `arrow.core.continuations.ensureNotNull` -> `arrow.core.raise.ensureNotNull`
- Find + Replace `arrow.core.computations.either` -> `arrow.core.raise.either`
- Find + Replace `arrow.core.computations.ensureNotNull` -> `arrow.core.raise.ensureNotNull`

### Replace `either.eager { }`

- Find + Replace `arrow.core.continuations.either.eager` -> `arrow.core.raise.either`
  => Might introduce duplicate import for `arrow.core.raise.either`
- Find + Replace `either.eager {` -> `either {`

### Replace `EffectScope`/`EagerEffectScope`

- Find + Replace `arrow.core.continuations.EffectScope` -> `arrow.core.raise.Raise`
- Find + Replace `arrow.core.continuations.EagerEffectScope` -> `arrow.core.raise.Raise`
- Find + Replace `arrow.core.continuations.ensureNotNull` -> `arrow.core.raise.ensureNotNull`

## Using `Effect`

- Find + Replace `arrow.core.continuations.Effect` -> `arrow.core.raise.Effect`
- Find + Replace `arrow.core.continuations.ensureNotNull` -> `arrow.core.raise.ensureNotNull`

=> Requires manually adding missing imports for `fold`, error handlers, and all `Effect` methods since they're replaced by extension functions.

## Using `EagerEffect`

- Find + Replace `arrow.core.continuations.EagerEffect` -> `arrow.core.raise.EagerEffect`
- Find + Replace `arrow.core.continuations.ensureNotNull` -> `arrow.core.raise.ensureNotNull`

=> Requires manually adding missing imports for `fold`, error handlers, and all `EagerEffect` methods since they're replaced by extension functions.
</details>

<details>
<summary>Semi-automated using KScript and IntelliJ</summary>

[This migration script](https://gist.github.com/nomisRev/e01ddc354c84b8b626c23d024706b916#file-migrate-main-kts) attempts to automatically migrate `arrow.core.computations.*` and `arrow.core.continuations.*` on a best effort to `arrow.core.raise.*`.
It has been tested on several real-life projects with 100% success, being able to automatically migrate the entire codebase.

The run this `kts` script you need `kotlinc` install on your machine.
The official documentation on how to install [`kotlinc`](https://kotlinlang.org/docs/command-line.html).

Some methods like `ensure` in the DSL became top-level, and `fold` if you're using `Effect` or `EagerEffect`.
These new _top-level imports_ cannot be automatically migrated, and there are two ways of dealing with the necessary imports.

There is two ways to use this script for migration:
 - Recommended: automatic _imports_ handling, adds too many imports and uses IntelliJ's _optimise imports_
 - Manual imports, doesn't add import for `fold`, and `ensure` and requires manually importing them on a usage basis.

<details>
<summary>Recommended usage</summary>

Once installed you can run the script with default params: `kotlinc -script migrate.main.kts .`.

You need to have Arrow version `1.2.0-RC` (or newer) in order to compile your project after the script finishes running.

The script _might_ leave you with some unused imports, to fix this you can run _optimise imports_ on your _project root_ or _src_ folder.
- Select _src_ or _project root` + `⌃ ⌥ O` or `Ctrl+Alt+O`.
- Right-click _project root_ or _src_ in _project view_, and select _Optimise imports_

This should remove all _unused imports_ this might also affect other unrelated imports.
</details>

<details>
<summary>Alternative</summary>

If you don't want to rely on IntelliJ's _optimise imports_ you can still use the migration script to do 99,99% of the work,
except import `ensure` (and `fold` for `Effect`/`EagerEffect`).

Easiest way to fix the imports is run `./gradlew build` and add missing imports in files that fail to compile.

Thank you for using Arrow, and your support. I hope this script was able to simplify your migration process to 2.0.0

</details>
</details>

:::info
Below we discuss `traverse` & `zip` which will be adopted by [Quiver](https://github.com/cashapp/quiver) in the future.
So if you like using these _functional combinators_ you can ignore their deprecated status, and continue using them with [Quiver](https://github.com/cashapp/quiver) after 2.0.0
We will also provide [OpenRewrite](https://docs.openrewrite.org) recipes through [rewrite-arrow](https://github.com/arrow-kt/rewrite-arrow) when 2.0.0 is released to automatically migrate to [Quiver](https://github.com/cashapp/quiver).
:::

### Traverse

All `traverse` functionality has been deprecated in favor of Kotlin's `map` function, and it _should_ be possible to migrate automatically using Kotlin & IntelliJ's `ReplaceWith`.
Let's look at a simple example to illustrate the difference between `traverse`, and the _new_ resulting code. We'll be using `Either` in this example, but it should be the same for any other collection type that has a `traverse` method.
The rationale behind this change is while `traverse` is a very well known method within the FP community, it's not as well known outside of it.
Using `map` is more familiar to most developers, and using `bind` gives a more consistent experience with the rest of the DSL. Additionally, when working over `Raise<E>` the `bind` method would disappear and `map === traverse`.

:::warning accumulating errors
If you're refactoring code using `Validated` check the [Validated & Either](#validated--either) section.
:::

<!--- TEST_NAME Migration -->


<!--- INCLUDE
import arrow.core.Either
import arrow.core.traverse
import arrow.core.raise.either
-->
```kotlin
fun one(): Either<String, Int> = Either.Right(1)

val old: Either<String, List<Int>> = 
  listOf(1, 2, 3).traverse { one() }

val new: Either<String, List<Int>> = either {
  listOf(1, 2, 3).map { one().bind() }
}
```
<!--- KNIT example-migration-guide-01.kt -->

### Zip

In similar fashion to `traverse`, all `zip` methods have been deprecated in favor of the DSL, and it _should_ be possible to migrate automatically using Kotlin & IntelliJ's `ReplaceWith`.
The rationale behind deprecating `zip` was that it's behavior is now duplicated by the `bind` method, and since the DSLs are now fully `inline` it makes `zip` redundant.
Working with `zip` requires dealing with the _arity-n_ problem, which means that the `zip` method is only defined for `9 arguments` in Arrow but can be defined for any `n` number of arguments.
The DSL, and `bind`, don't suffer from this problem, and it's possible to use `bind` with any number of arguments thus getting rid of this problem. See [this question on StackOverflow](https://stackoverflow.com/questions/72782045/arrow-validation-more-then-10-fields/72782420#72782420). 

Let's look at a simple example to illustrate the difference between `zip`, and the _new_ resulting code.
We'll be using `Either` in this example, but it should be the same for any other data type that has a `zip` method.

:::warning accumulating errors
If you're refactoring code using `Validated` check the [Validated & Either](#validated--either) section.
:::

<!--- INCLUDE
import arrow.core.Either
import arrow.core.zip
import arrow.core.raise.either
-->
```kotlin
fun one(): Either<String, Int> = Either.Right(1)

val old: Either<String, Int> = one().zip(one()) { x, y -> x + y }

val new: Either<String, Int> =
  either { one().bind() + one().bind() }

val new2 : Either<String, Int> = either { 
  val x = one().bind()
  val y = one().bind()
  x + y
}
```
<!--- KNIT example-migration-guide-02.kt -->

## Validated & Either

In Arrow 1.2.0-RC we've deprecated `Validated` in favor of `Either`, and `ValidatedNel` in favor of `EitherNel`.
Rationale was that `Either` and `Validated` offer the same abstraction of _either_ an error of type `E` or a value of type `A`.
The main reason is that `zip` and `traverse` behave differently in these data types. Where `Validated` allows _accumulating errors_ using `zip` and `traverse`, `Either` short-circuits on the first error.

This behavior can be bridged by concrete APIs in the new `Raise` DSL whilst supporting **both** working over `E` and `NonEmptyList<E>` in singular APIs.
So you don't have to redundantly lift all your return types to work over `NonEmptyList<E>` when you're actually returning a single error `E`. That can be transparently supported inside the new `Raise` DSL APIs to _accumulate_ errors.
These new APIs still support `Validated` until it's actually removed in Arrow 2.0.0, and we advise to migrate those before actually migrating `Validated` to `Either`. 

To migrate from `Validated` to `Either` you need to simply construct `Either` values instead of `Validated`, and leverage the new APIs clarified below.

<details>
<summary>Semi-automatic migration using ReplaceWith</summary>

1. Start leveraging the `Raise` _accumulate error_ APIs before migrating `Validated` to `Either`: `zip` -> `zipOrAccumulate` & `traverse` to `mapOrAccumulate` using _Replace in entire project action_ from IntelliJ
2. Migrate all remaining APIs to their `Either` equivalent `tapInvalid`, `withEither`, etc. All overlapping APIs such as `map`, `fold`, `getOrElse` can be ignored. 
3. Migrate all constructors:
    - `Validated.Valid` -> `Either.Right`
    - `Validated.Invalid` -> `Either.Left`
    - `A.valid()` -> `A.right()`
    - `A.validNel()` -> `A.right()`
    - `E.invalid()` -> `E.left()`
    - `E.invalidNel()` -> `E.leftNel()`

4. Replace in entire project `Either#toEither()` intermediate method

<video width="100%" height="100%" data-autoplay data-loop src="https://user-images.githubusercontent.com/12424668/220732907-27933876-3349-41d5-b0f2-a53b12f2f217.mov" type="video/webm"></video>

</details>


### Traverse ~> mapOrAccumulate

The behavior of `traverse` for `Validated` is now supported by `mapOrAccumulate` so let's take a quick look at what it looks like:

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.NonEmptyList
import arrow.core.nonEmptyListOf
import arrow.core.mapOrAccumulate
import io.kotest.matchers.shouldBe
-->
```kotlin
fun one(): Either<String, Int> = "error-1".left()
fun two(): Either<NonEmptyList<String>, Int> = nonEmptyListOf("error-2", "error-3").left()

fun example() {
  listOf(1, 2).mapOrAccumulate {
    one().bind()
  } shouldBe nonEmptyListOf("error-1", "error-1").left()
  
  listOf(1, 2).mapOrAccumulate {
    two().bind()
  } shouldBe nonEmptyListOf("error-2", "error-3", "error-2", "error-3").left()
}
```
<!--- KNIT example-migration-guide-03.kt -->

### Zip

The behavior of `zip` for `Validated` is now supported by `zipOrAccumulate` so let's take a quick look at what it looks like:

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.NonEmptyList
import arrow.core.nonEmptyListOf
import arrow.core.raise.either
import arrow.core.raise.zipOrAccumulate
import io.kotest.matchers.shouldBe
-->
```kotlin
fun one(): Either<String, Int> = "error-1".left()
fun two(): Either<NonEmptyList<String>, Int> = nonEmptyListOf("error-2", "error-3").left()

fun example() {
  either<NonEmptyList<String>, Int> {
    zipOrAccumulate(
      { one().bind() },
      { two().bindNel() }
    ) { x, y -> x + y }
  } shouldBe nonEmptyListOf("error-1", "error-2", "error-3").left()
}
```
<!--- KNIT example-migration-guide-04.kt -->

## Semigroup & Monoid

Both `Semigroup` and `Monoid` are deprecated in Arrow `1.2.0` and will be removed in `2.0.0`. The migration of 
some deprecated methods may need to add an extra manual step, besides the automatic replacement. 

### foldMap
The replacement of deprecated `foldMap` for `Iterable`, `Option` and `Either` requires to replace the `Monoid` parameter
with an `empty` value of the type contained in the removed `Monoid`.
Let's see this in action:
<!--- INCLUDE
import arrow.core.Either
import arrow.core.replicate
import arrow.core.Valid
import arrow.core.Validated
import arrow.core.combineAll
import arrow.core.Ior
import arrow.core.raise.nullable
import arrow.core.right
import arrow.core.valid
import arrow.core.zip
import arrow.typeclasses.Monoid
import io.kotest.matchers.shouldBe
-->

```kotlin
fun booleanToString(b: Boolean): String = if (b) "IS TRUE! :)" else "IS FALSE.... :(" 

fun deprecatedFoldMap() {
   val e1: Either<String, Boolean> = false.right()
   e1.foldMap(Monoid.string(), ::booleanToString) shouldBe "IS FALSE.... :("
}
```
```
// Executing automatic replacement
fun migrateFoldMap() {
   val e1: Either<String, Boolean> = false.right()
   e1.fold({empty}, ::booleanToString) shouldBe "IS FALSE.... :(" // empty is not found
}
 
```
```kotlin
// Adding the empty value to complete the replacement of the deprecated method
fun migrateFoldMap() {
   val e1: Either<String, Boolean> = false.right()
   e1.fold({""}, ::booleanToString) shouldBe "IS FALSE.... :("
}
```

### combine
All deprecated `combine` methods are suggested to be replaced by the lambda `{a, b -> a + b}`, which will cover almost all
possible replacements successfully. One of the cases that will need some manual fix is the following:

```kotlin
fun deprecatedZip() {
   val nullableLongMonoid = object : Monoid<Long?> {
      override fun empty(): Long? = 0
      override fun Long?.combine(b: Long?): Long? =
         nullable { this@combine.bind() + b.bind() }
   }

   val validated: Validated<Long?, Int?> = 3.valid()
   val res = validated.zip(nullableLongMonoid, Valid(Unit)) { a, _ -> a } // zip and Monoid are deprecated
   res shouldBe Validated.Valid(3)
}
```
When we replace the deprecated `zip` method:
```
// Executing automatic replacement
fun migrateZip(){ 
   val validated: Validated<Long?, Int?> = 3.valid()
   val res = Either.zipOrAccumulate(
      { e1, e2 -> e1 + e2 }, // compilation error
      validated.toEither(), 
      Valid(Unit).toEither()
   ) { a, _ -> a }.toValidated()
}
```
In this case, we do not have the `+` operation for `Long?`, so we need to add it manually:
```kotlin
fun migrateZip() {
   val validated: Validated<Long?, Int?> = 3.valid()
   val res = Either.zipOrAccumulate(
      { e1, e2 -> nullable { e1.bind() + e2.bind() } },
      validated.toEither(),
      Valid(Unit).toEither()
   ) { a, _ -> a }.toValidated()
   res shouldBe Validated.Valid(3)
}
```

### combineAll
In a similar situation like [foldMap](#foldmap), the replacement of deprecated `combineAll` for `Iterable`, `Option` and 
`Validate` needs to add manually the `initial` parameter, in the replacement with `fold` method. Let's do a replacement
to see how to achieve this:
```kotlin
fun deprecatedCombineAll() {
   val l: List<Int> = listOf(1, 2, 3, 4, 5)
   l.combineAll(Monoid.int()) shouldBe 10
}
```

```
// Executing automatic replacement
fun migrateCombineAll(){
   val l: List<Int> = listOf(1, 2, 3, 4, 5) 
   l.fold(initial) { a1, a2 -> a1 + a2 } shouldBe 10 // initial is not found
}
```

```kotlin
// Adding the initial value to complete the replacement of the deprecated method
fun migrateCombineAll() {
   val l: List<Int> = listOf(1, 2, 3, 4, 5)
   l.fold(0) { a1, a2 -> a1 + a2 } shouldBe 10
}
```

### replicate
`replicate` also needs a bit of *help* when removing the deprecated `Monoid` for `Option` and `Either`. Again,
`fold` is the recommended replacement method, so we'll need to provide the `initial` parameter in the `fold`. Let's see this
with an `Either`:
```kotlin
fun deprecatedReplicate() {
   val rEither: Either<String, Int> = 125.right()
   val n = 3
   rEither.replicate(n, Monoid.int()) shouldBe Either.Right(375)
}
```

```
// Executing automatic replacement
fun migrateReplicate(){
   val rEither: Either<String, Int> = 125.right() 
   val n = 3
   val res = if (n <= 0) Either.Right(initial) 
   else rEither.map { b -> List<Int>(n) { b }.fold(initial) { r, t -> r + t } } // initial is not found
   res shouldBe Either.Right(375)
}
```

```kotlin
// Adding the empty value to complete the replacement of the deprecated method
fun migrateReplicate() {
   val rEither: Either<String, Int> = 125.right()
   val n = 3
   val res = if (n <= 0) Either.Right(0)
   else rEither.map { b -> List<Int>(n) { b }.fold(0) { r, t -> r + t } }

   res shouldBe Either.Right(375)
}
```

## Ior
Most of the `Ior` data type deprecated method migrations related to `traverse` and `crosswalk`, 
must be replaced manually. The main reason is that `Intellij` does not know how to infer some types when we're using 
generics. Although this situation can be a bit annoying, this is a good excuse for the user to navigate and get more expertise
on the `Arrow` source code. Let's see a few examples to be more familiar with these special cases:

### crosswalk
Given the `Ior` implementation of `crosswalk`:
```
public inline fun <C> crosswalk(fa: (B) -> Iterable<C>): List<Ior<A, C>> =
    fold(
      { emptyList() },
      { b -> fa(b).map { Right(it) } },
      { a, b -> fa(b).map { Both(a, it) } }
    )
```

And an example that use `crosswalk`:
```kotlin
fun deprecatedCrosswalk() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.crosswalk { listOf(it) }
   result shouldBe listOf(Ior.Right(124))
}
```
<!--- KNIT example-migration-guide-05.kt -->

The result of replacing manually the `crosswalk` call using the `fold` implementation would be:
<!--- INCLUDE
import arrow.core.Ior
import io.kotest.matchers.shouldBe
-->
```kotlin
fun migrateCrosswalk() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.fold(
      { emptyList<Int>() },
      { b -> listOf(b).map { Ior.Right(it) } },
      { a, b -> listOf(b).map { Ior.Both(a, it) } }
   )
   result shouldBe listOf(Ior.Right(124))
}
```
<!--- KNIT example-migration-guide-06.kt -->

### traverse
In a similar situation we have the `Ior` `traverse` method for a function that returns an `Option`.
Given the implementation of `traverse`:
```
public inline fun <C> traverse(fa: (B) -> Option<C>): Option<Ior<A, C>> {
    return fold(
      { a -> Some(Left(a)) },
      { b -> fa(b).map { Right(it) } },
      { a, b -> fa(b).map { Both(a, it) } }
    )
  }
```

And an example that use `traverse`:
<!--- INCLUDE
import arrow.core.Ior
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import io.kotest.matchers.shouldBe
-->
```kotlin
fun evenOpt(i: Int): Option<Int> = if(i % 2 == 0) i.some() else None

fun deprecatedTraverse() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.traverse { evenOpt(it) }

   result shouldBe Some(Ior.Right(124))
}
```
<!--- KNIT example-migration-guide-07.kt -->
The result of replacing manually the `traverse` call using the `fold` implementation would be:
<!--- INCLUDE
import arrow.core.Ior
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import io.kotest.matchers.shouldBe
-->
```kotlin
fun evenOpt(i: Int): Option<Int> = if(i % 2 == 0) i.some() else None

fun migrateTraverse() {
   val rightIor: Ior<String, Int> = Ior.Right(124)
   val result = rightIor.fold(
      { a -> Some(Ior.Left(a)) },
      { b -> evenOpt(b).map { Ior.Right(it) } },
      { a, b -> evenOpt(b).map { Ior.Both(a, it) } }
   )

   result shouldBe Some(Ior.Right(124))
}
```
<!--- KNIT example-migration-guide-08.kt -->
