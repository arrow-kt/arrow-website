# Migration from Scala

The Scala language and libraries have a heavy influence of functional
programming, as Arrow does. The Scala Standard Library, for example, contains
many of the types provided by Arrow like [`Either`](https://www.scala-lang.org/api/current/scala/util/Either.html).
There's also a vibrant community which brings even more functional features,
like the [Typelevel ecosystem](https://typelevel.org/). If you're used to those
concepts, the journey to Arrow should be a pleasant one.

<!--- TEST_NAME ScalaMigrationTest -->

## Computation blocks

Scala has special support for types which define a `flatMap` operation, namely
[`for` comprehensions](https://docs.scala-lang.org/tour/for-comprehensions.html).
`Either` is one such type, so you can use `for` to perform validation.

```scala
def mkPerson(name: String, age: Int): Either[Problem, Person] = for {
  name_ <- validName(name)
  age_  <- validAge(age)
} yield Person(name_, age_)
```

Kotlin doesn't provide such a generic construct. Arrow provides similar
syntax for [error types](../../typed-errors/working-with-typed-errors/).

- You must explicitly request to work with an error type, using `either`,
  `result`, or `nullable`, instead of `for`. Those functions live in
  the [`arrow.core.raise`](https://arrow-kt.github.io/arrow/arrow-core/arrow.core.raise/index.html) package.
- Every usage of `<-` in Scala translates into a call to `.bind()`.

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
completely inline the calls if desired.

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

:::info No zip

It's common in Scala to use functions like `zip` to combine values inside a 
wrapper, instead of a `for` comprehension. In Arrow we prefer to use blocks,
except when [dealing with concurrency](../../coroutines/parallel/).

:::

:::info No traverse

If you want to apply an effectful operation to every element of a collection,
you need to use a function different from `map`, usually called `traverse`.
This split does not exist in Arrow: you can use the same functions you know
and love from the collections API inside one of these blocks.

:::

## `suspend` for `IO`

The utilities provided by Arrow for working with side effects are based on 
[coroutines](https://kotlinlang.org/docs/coroutines-guide.html), that is,
functions marked as `suspend`. In contrast, popular Scala libraries like
[Cats Effect](https://typelevel.org/cats-effect/) introduce an `IO` wrapper
type to mark side-effects.

:::info Read more

Our [_Design_](../design/) section includes a [post](../../design/receivers-flatmap/)
comparing the different approaches for effect handling.

:::
