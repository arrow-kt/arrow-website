---
description: Writing your own DSLs with Raise.
sidebar_position: 6
---

# Creating your own error wrappers

<!--- TEST_NAME OwnErrorsTest -->

`Raise` is a powerful tool that allows us to create our own DSLs to raise typed errors.
It easily allows integration with existing libraries and frameworks that offer similar data types like `Either` or even your own custom types.
For example, let's take a popular ADT often used in the front end, a type that models `Loading`, `Content`, or `Failure`, often abbreviated as `LCE`.

<!--- INCLUDE
import arrow.core.raise.Raise
import arrow.core.raise.ensure
import arrow.core.raise.recover
import io.kotest.matchers.shouldBe
import kotlin.experimental.ExperimentalTypeInference
-->
```kotlin
sealed interface Lce<out E, out A> {
  object Loading : Lce<Nothing, Nothing>
  data class Content<A>(val value: A) : Lce<Nothing, A>
  data class Failure<E>(val error: E) : Lce<E, Nothing>
}
```

## Basic functionality

Let's say that once a `Failure` or `Loading` case is encountered, we want to short-circuit and not continue with the computation.
It's easy to define a `Raise` instance for `Lce` that does just that. We'll use the composition pattern to do this **without** context receivers.
Since we need to _raise_ both `Lce.Loading` and `Lce.Failure`, our `Raise` instance will need to be able to `raise` `Lce<E, Nothing>`, and we wrap that in a `LceRaise` class.
Within that class, a `bind` function can be defined to short-circuit any encountered `Failure` or `Loading` case or otherwise return the `Content` value.

```kotlin
@JvmInline
value class LceRaise<E>(val raise: Raise<Lce<E, Nothing>>) : Raise<Lce<E, Nothing>> by raise {
  fun <A> Lce<E, A>.bind(): A =  when (this) {
    is Lce.Content -> value
    is Lce.Failure -> raise.raise(this)
    Lce.Loading -> raise.raise(Lce.Loading)
  }
}
```

All that is required now is a DSL function. We can use the `recover` or `fold` function to summon an instance of `RaiseLce<E, Nothing>` from the `Raise` type class.
We wrap the `block` in an `Lce.Content` value and return any encountered `Lce<E, Nothing>` value. We can call `block` by wrapping `Raise<Lce<E, Nothing>>` in `LceRaise`.

```kotlin
@OptIn(ExperimentalTypeInference::class)
inline fun <E, A> lce(@BuilderInference block: LceRaise<E>.() -> A): Lce<E, A> =
  recover({ Lce.Content(block(LceRaise(this))) }) { e: Lce<E, Nothing> -> e }
```

We can now use this DSL to compose our computations and `Lce` values in the same way as we've discussed above in this document.
Furthermore, since this DSL is built on top of `Raise`, we can use all the functions we've discussed above.

```kotlin
fun example() {
  lce {
    val a = Lce.Content(1).bind()
    val b = Lce.Content(1).bind()
    a + b
  } shouldBe Lce.Content(2)

  lce {
    val a = Lce.Content(1).bind()
    ensure(a > 1) { Lce.Failure("a is not greater than 1") }
    a + 1
  } shouldBe Lce.Failure("a is not greater than 1")
}
```
<!--- KNIT example-own-errors-01.kt -->
<!--- TEST assert -->

If we'd used _context receivers_, defining this DSL would be even more straightforward, and we could use the `Raise` type class directly.

```kotlin
context(Raise<Lce<E, Nothing>>)
fun <E, A> Lce<E, A>.bind(): A =  when (this) {
  is Lce.Content -> value
  is Lce.Failure -> raise(this)
  Lce.Loading -> raise(Lce.Loading)
}

inline fun <E, A> lce(@BuilderInference block: Raise<Lce<E, Nothing>>.() -> A): Lce<E, A> =
  recover({ Lce.Content(block(this)) }) { e: Lce<E, Nothing> -> e }
```

## Reflections on `Failure`

The reason to choose `Lce<E, Nothing>` as type for `Failure` allows for a DSL that has multiple errors.
Let's consider now a type similar to `Lce`, but with additional states which are not considered success.

```kotlin
DialogResult<out T>
 ├ Positive<out T>(value: T) : DialogResult<T>
 ├ Neutral : DialogResult<Nothing>
 ├ Negative : DialogResult<Nothing>
 └ Cancelled: DialogResult<Nothing>
```

We can now not really conveniently provide `Raise` over the _flat_ type `DialogResult`, and are kind-of forced to use `DialogResult<Nothing>`. However, if we stratify our type differently,

```kotlin
DialogResult<out T>
 ├ Positive<out T>(value: T) : DialogResult<T>
 └ Error : DialogResult<Nothing>
    ├ Neutral : Error
    ├ Negative : Error
    └ Cancelled: Error
```

We can again benefit from `Raise<DialogResult.Error>`, and the reason that this is **much** more desirable, it that you can now also interop with `Either`!

```kotlin
dialogResult {
  val x: DialogResult.Positive(1).bind()
  val y: Int = DialogResult.Error.left().bind()
  x + y
}
```

That can be useful if you need to for example want to _accumulate errors_, you can now benefit from the default behavior in Kotlin.

```kotlin
fun dialog(int: Int): DialogResult<Int> =
  if(int % 2 == 0) DialogResult.Positive(it) else Dialog.Neutral

val res: Either<NonEmptyList<DialogResult.Error>, NonEmptyList<Int>> =
  listOf(1, 2, 3).mapOrAccumulate { i: Int ->
    dialog(it).getOrElse { raise(it) }
  }

dialogResult {
  res.mapLeft { ... }.bind()
}
```

:::info Further discussion

This section was created as a response to
[this issue in our repository](https://github.com/arrow-kt/arrow-website/issues/161).
Let's create great docs for Arrow together!

:::
