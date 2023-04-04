---
id: from-fp
title: From other FP languages
sidebar_position: 1
---

# From other FP languages

Arrow is heavily influenced by functional programming. If you're used to working
with those concepts, the journey to Arrow should be a pleasant one. In this
section, we review the most important differences with other ecosystems.

:::note scala

The [Scala Standard Library](https://www.scala-lang.org/api/current/scala/index.html) contains
many of the types provided by Arrow like [`Either`](https://www.scala-lang.org/api/current/scala/util/Either.html).
There's also a vibrant community which brings even more functional features,
like the [Typelevel ecosystem](https://typelevel.org/). 

:::

:::note haskell

[Haskell](https://www.haskell.org/) is often considered the prime example of a 
pure functional programming language. Most of the utilities in Arrow are
found in [their `base` library](https://hackage.haskell.org/package/base).

:::

<!--- TEST_NAME ScalaMigrationTest -->

## Computation blocks

Both Scala and Haskell have special support for types which define a 
`flatMap` or bind operation, namely
[`for` comprehensions](https://docs.scala-lang.org/tour/for-comprehensions.html)
and [`do` notation](https://en.wikibooks.org/wiki/Haskell/do_notation).
`Either` is one such type, so you can use `for` or `do` to perform validation.

```scala
def mkPerson(name: String, age: Int): Either[Problem, Person] = for {
  name_ <- validName(name)
  age_  <- validAge(age)
} yield Person(name_, age_)
```

```haskell
mkPerson :: String -> Int -> Either Problem Person
mkPerson name age = do
  name_ <- validName name
  age_  <- validAge age
  pure (Person name_ age_)
```

In Haskell you can get closer to this style using `Applicative` operators.
The code still looks different than its pure counterpart, since you need
to sprinkle `(<$>)` and `(<*>)`.

```haskell
mkPerson name age = Person <$> validName name <*> validAge age
```

Kotlin doesn't provide such a generic construct. However, Arrow provides a similar
syntax for [error types](../../typed-errors/working-with-typed-errors/).

- You must explicitly request to work with an error type, using `either`,
  `result`, or `nullable`, instead of `for`. Those functions live in
  the [`arrow.core.raise`](https://apidocs.arrow-kt.io/arrow-core/arrow.core.raise/index.html) package.
- Every usage of `<-` translates into a call to `.bind()`.

<!--- INCLUDE
import arrow.core.*
import arrow.core.raise.either

data class Person(val name: String, val age: Int)
interface Problem
fun validName(name: String): Either<Problem, String> = TODO()
fun validAge(age: Int): Either<Problem, Int> = TODO()
-->

```kotlin
fun mkUser(name: String, age: Int): Either<Problem, Person> = either {
  val name_ = validName(name).bind()
  val age_  = validAge(age).bind()
  Person(name_, age_)
}
```
<!--- KNIT example-scala-migration-01.kt -->

Furthermore, the result of `.bind()` is just of regular type, so you can
completely inline the calls if desired. This style is very similar to
Haskell's use of `Applicative` operators, except that operators appear
at the level of arguments, instead of at the level of functions.

<!--- INCLUDE
import arrow.core.*
import arrow.core.raise.either

data class Person(val name: String, val age: Int)
interface Problem
fun validName(name: String): Either<Problem, String> = TODO()
fun validAge(age: Int): Either<Problem, Int> = TODO()
-->

```kotlin
fun mkUser(name: String, age: Int): Either<Problem, Person> = either {
  Person(validName(name).bind(), validAge(age).bind())
}
```
<!--- KNIT example-scala-migration-02.kt -->

:::tip No zip

It's common to use functions like `zip` to combine values inside a 
wrapper, instead of a `for` comprehension. In Haskell this often takes
the form of `(<$>)` and `(<*>)`. In Arrow we prefer to use blocks,
except when [dealing with concurrency](../../coroutines/parallel/).

:::

:::tip No traverse

If you want to apply an effectful operation to every element of a collection,
you need to use a function different from `map`, usually called `traverse`.
This split does not exist in Arrow: you can use the same functions you know
and love from the collections API inside one of these blocks.

:::

## `suspend` instead of `IO`

The utilities provided by Arrow for working with side effects are based on 
[coroutines](https://kotlinlang.org/docs/coroutines-guide.html), that is,
functions marked as `suspend`. In contrast, 
Haskell introduces a special `IO` wrapper
type to mark side-effects, as done by
popular Scala libraries like
[Cats Effect](https://typelevel.org/cats-effect/). 

:::info Read more

Our [_Design_](../../design/) section includes a [post](../../design/receivers-flatmap/)
comparing the different approaches for effect handling.

:::

## Higher-kinded abstractions

Both Scala and Haskell allow abstractions that operate at the level of
type constructors. For example, a function like `flatMap` which always has
the form `F<A>.flatMap(next: (A) -> F<B>): F<B>` is part of an interface /
type class called `Monad`. Kotlin doesn't provide this feature, but Arrow
still follows the naming convention for consistency. The following list
relates the names to abstractions in [Cats](https://typelevel.org/cats/)
and [Haskell's `base`](https://hackage.haskell.org/package/base).

- `map` comes from [`Functor`](https://typelevel.org/cats/typeclasses/functor.html).
- `contramap` comes from [`Contravariant`](https://typelevel.org/cats/typeclasses/contravariant.html) functors.
- `fold` comes from [`Foldable`](https://typelevel.org/cats/typeclasses/foldable.html).
- `zip` comes from [`Applicative`](https://typelevel.org/cats/typeclasses/applicative.html),
  although it's called `product` or `(&&)` in other languages.
- `traverse` and `sequence` come from [`Traversable`](https://typelevel.org/cats/typeclasses/traverse.html),
  but those functions are being **deprecated**, because the same behavior can
  be achieved with regular list functions and computation blocks.

:::danger Semigroup and Monoid

Arrow Core contains `Semigroup` and `Monoid` as interfaces. They are, however,
marked as deprecated, and due for removal in Arrow 2.0. Functions that required
a `Semigroup` or `Monoid` argument have been replaced by variants which take
the combination function, and the corresponding empty element. This design
fits better with other parts of the Kotlin ecosystem, like the [`fold`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)
function in `kotlin.collections`.

:::
