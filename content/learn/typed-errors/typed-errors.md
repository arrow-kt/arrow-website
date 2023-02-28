---
sidebar_position: 1
---

# Working with typed errors

<!--- TEST_NAME TypedErrorsTest -->

Working with typed errors offers a couple of advantages over using exceptions:

- **Type Safety:** Typed errors allow the compiler to find type mismatches early, making it easier to catch bugs before they make it to production. However, with exceptions, the type information is lost, making it more difficult to detect errors at compile-time.

- **Predictability:** When using typed errors, the possible error conditions are explicitly listed in the type signature of a function. This makes it easier to understand the possible error conditions and to write tests to cover all error scenarios.

- **Composability:** Typed errors can be easily combined and propagated through a series of function calls, making it easier to write modular, composable code. With exceptions, it can be difficult to ensure that errors are properly propagated through a complex codebase.

- **Performance:** Exception handling can have a significant impact on performance, especially in languages that don't have a dedicated stack for exceptions. Typed errors can be handled more efficiently, as the compiler has more information about the possible error conditions.

In summary, typed errors provide a more structured, predictable, and efficient way of handling errors, and can make it easier to write high-quality, maintainable code.

## Different types

There are 3 ways of working with errors (excluding _nullable_):

- `Either<E, A>` represents a _computed value_ of _either_ a _logical failure_ of `E` or a _success_ value `A`.

- `Ior<E, A>` represents a computed value of _either_ a _logical failure_ of `E` or a _success_ value `A` or **both** a success value of `A` together with a _logical failure_ of `E`.

- `Raise<E>` represents a _computation_ that might result in a _logical failure_ of `E`.

Below we'll cover how you can work with these types, and the differences and similarities using some examples. All of these types expose a similar API, and allow working in a similar fashion.

## Working with errors

Let's define a simple program that _raises_ a _logical failure_ of `MyError` or returns an `Int` value of `1`. We can represent this as a value `Either<MyError, Int>`, or a _computation_ using `Raise<MyError>`.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.right
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe
-->
```kotlin
object MyError

val one: Either<MyError, Int> = 1.right()

fun Raise<MyError>.one(): Int = 1
```

Above we clearly show the difference between a `val` of `Either` and a _computation_ or `fun`. Since both represent _either_ `MyError` or `Int` we can easily work with both together.

We can easily turn our _computation_ `one()` into an `Either` by wrapping it inside the `either` DSL, and we can do the opposite for our `Either` value _safely_ unwrapping it using `bind()`.

```kotlin
val res = either { one() }

fun Raise<MyError>.res(): Int = one.bind()
```

We can then _inspect_ the value of `res` using Kotlin's `when`, or `fold` the _computation_ providing a lambda for both the _logical failure_ and the _success_ case.

```kotlin
fun example() {
  when (res) {
    is Left -> fail("No logical failure occurred!")
    is Right -> res.value shouldBe 1
  }

  fold(
    { res() },
    { _: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
```
<!--- KNIT example-typed-errors-01.kt -->
<!--- TEST assert -->

To create a `val` of a _logical failure_ we use the `left` `Either` constructor, or `raise` a _logical failure_ inside a _computation_.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.left
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object MyError
-->
```kotlin
val error: Either<MyError, Int> = MyError.left()

fun Raise<MyError>.error(): Int = raise(MyError)
```

We can then again use `when` or `fold` to _inspect_ or _compute_ the value and function.

```kotlin
fun example() {
  when (error) {
    is Left -> error.value shouldBe MyError
    is Right -> fail("A logical failure occurred!")
  }

  fold(
    { error() },
    { e: MyError -> e shouldBe MyError },
    { i: Int -> fail("A logical failure occurred!") }
  )
}
```
<!--- KNIT example-typed-errors-02.kt -->
<!--- TEST assert -->

Beside `raise`, or `left` there are also several DSLs available to check invariants.
`either { }` and `Raise` offer `ensure` and `ensureNotNull`, in spirit with `require` and `requireNotNull` from the Kotlin Std.
Instead of throwing an exception, they result in a _logical failure_ with the given error if the predicate is not satisfied.

`ensure` takes a _predicate_ and a _lazy_ `E` value, when the _predicate_ is not matched the _computation_ will result in a _logical failure_ of `E`.
In the function below we show how we can use `ensure` to check if a given `Int` is positive, and if not we return a _logical failure_ of `MyError`.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensure
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe
-->
```kotlin
data class MyError(val message: String)

fun isPositive(i: Int): Either<MyError, Int> = either {
  ensure(i > 0) { MyError("$i is not positive") }
  i
}

fun Raise<MyError>.isPositive(i: Int): Int {
  ensure(i > 0) { MyError("$i is not positive") }
  return i
}

fun example() {
  isPositive(-1) shouldBe MyError("-1 is not positive").left()

  fold(
    { isPositive(1) },
    { _: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
```
<!--- KNIT example-typed-errors-03.kt -->
<!--- TEST assert -->

`ensureNotNull` takes a _nullable value_ and a _lazy_ `E` value, when the value is null the _computation_ will result in a _logical failure_ of `E`.
Otherwise, the value will be _smart-casted_ to non-null and you will be able to operate on it without checking nullability.
In the function below we show how we can use `ensureNotNull` to check if a given `Int` is non-null and increment it with `1`, and if not we return a _logical failure_ of `MyError`.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensureNotNull
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe
-->
```kotlin
data class MyError(val message: String)

fun increment(i: Int?): Either<MyError, Int> = either {
  ensureNotNull(i) { MyError("Cannot increment null") }
  i + 1
}

fun Raise<MyError>.increment(i: Int): Int {
  ensureNotNull(i) { MyError("$i is null") }
  return i + 1
}

fun example() {
  increment(null) shouldBe MyError("Cannot increment null").left()

  fold(
    { increment(1) },
    { _: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 2 }
  )
}
```
<!--- KNIT example-typed-errors-04.kt -->
<!--- TEST assert -->

## Recovering from typed errors, and exceptions

When working with values or functions that can result in a typed error we often need to `recover` to be able to provide, or calculate, fallback values. To demonstrate how we can do this, lets take our previous example.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.merge
import arrow.core.recover
import arrow.core.raise.Raise
import arrow.core.raise.fold
import arrow.core.raise.recover
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object MyError
-->
```kotlin
val error: Either<MyError, Int> = MyError.left()

fun Raise<MyError>.error(): Int = raise(MyError)

val fallback: Either<Nothing, Int> =
  error.recover { e: MyError -> 1 }

fun Raise<Nothing>.fallback(): Int =
  recover({ error() }) { e: MyError -> 1 }

fun example() {
  fallback.merge() shouldBe 1
  fold(
    { fallback() },
    { e: MyError -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
```
<!--- KNIT example-typed-errors-05.kt -->
<!--- TEST assert -->

We can see that `MyError` was resolved, and turned into `Nothing`. This means that the type-system knows that we successfully recovered from the typed error. This because we can track in the type system that `{ error: MyError -> 1 }` doesn't _raise_ any new typed error.
When trying to `recover` from a _logical failure_ it might also be that we _raise_ a new error of a different type. The `recover` function is defined in terms of `Raise`, and this means we can call `raise` with a different type in the lambda.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.recover
import arrow.core.raise.Raise
import arrow.core.raise.fold
import arrow.core.raise.recover
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object MyError
val error: Either<MyError, Int> = MyError.left()
fun Raise<MyError>.error(): Int = raise(MyError)
-->
```kotlin
object OtherError

val other: Either<OtherError, Int> =
  error.recover { _: MyError -> raise(OtherError) }

fun Raise<OtherError>.other(): Int =
  recover({ error() }) { _: MyError -> raise(OtherError) }

fun example() {
  other shouldBe OtherError.left()
  fold(
    { other() },
    { e: OtherError -> e shouldBe OtherError },
    { _: Int -> fail("A logical failure occurred!") }
  )
}
```
<!--- KNIT example-typed-errors-06.kt -->
<!--- TEST assert -->

The type system now tracks that a new error of `OtherError` might have occurred, but that we recovered from any possible errors of `MyError`. This is useful across application layers, or in the service layer, where we might want to `recover` from a `DatabaseError` with a `NetworkError` when we want to load data from the network when a database operation failed.
Similarly to `either { }` and `Raise`, the `recover` function works DSL based, and we can thus mix both types seamlessly with each-other.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.recover
import arrow.core.raise.Raise
import arrow.core.raise.fold
import arrow.core.raise.recover
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object OtherError
object MyError
-->
```kotlin
val fallback: Either<OtherError, Int> = OtherError.left()

fun Raise<OtherError>.fallback(): Int = raise(OtherError)

val other: Either<OtherError, Int> =
  MyError.left().recover { _: MyError -> fallback() }

fun Raise<OtherError>.other(): Int =
  recover({ raise(MyError) }) { _: MyError -> fallback.bind() }

fun example() {
  other shouldBe OtherError.left()
  fold(
    { other() },
    { e: OtherError -> e shouldBe OtherError },
    { _: Int -> fail("A logical failure occurred!") }
  )
}
```
<!--- KNIT example-typed-errors-07.kt -->
<!--- TEST assert -->

When interacting with external systems we often need to deal with `Throwable`, and want to `catch` and recovered from them or transform them into typed errors.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.catch
import arrow.core.raise.Raise
import arrow.core.raise.catch
import arrow.core.raise.fold
import arrow.core.right
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe
-->
```kotlin
data class MyError(val cause: Throwable)

suspend fun externalSystem(): Int = throw RuntimeException("Boom!")

suspend fun fallback(): Either<Nothing, Int> =
  Either.catch { externalSystem() }.catch { e: Throwable -> 1 }

suspend fun Raise<MyError>.error(): Int =
  catch({ externalSystem() }) { e: Throwable -> raise(MyError(e)) }

suspend fun example() {
  fallback() shouldBe 1.right()
  fold(
    { error() },
    { e: MyError -> e.cause.message shouldBe "Boom!" },
    { _: Int -> fail("A logical failure occurred!") }
  )
}
```
<!--- KNIT example-typed-errors-08.kt -->
<!--- TEST assert -->

We can see that we can use `catch` to transform the caught `Throwable` and provide a fallback value or turn it into a typed error.
Sometimes we don't want to recover from a `Throwable`, but instead _refine_ the `Throwable` into a more specific subclass of `Throwable`. For example, when working with databases we might only be interested in `SQLException` and want to ignore all other `Throwable`.
In that case we can use a special overload of `catch` to only catch a specific subclass of `Throwable`.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.catch
import arrow.core.raise.Raise
import arrow.core.raise.catch
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.shouldBeTypeOf

suspend fun externalSystem(): Int = throw RuntimeException("Boom!")
-->
```kotlin
data class OtherError(val cause: RuntimeException)

suspend fun error(): Either<OtherError, Int> =
  Either.catch { externalSystem() }.catch { e: RuntimeException -> raise(OtherError(e)) }

suspend fun Raise<Nothing>.fallback(): Int =
  catch({ externalSystem() }) { e: Throwable -> 1 }

suspend fun example() {
  error().shouldBeTypeOf<Either.Left<OtherError>>()
  fold(
    { fallback() },
    { _: Nothing -> fail("No logical failure occurred!") },
    { i: Int -> i shouldBe 1 }
  )
}
```
<!--- KNIT example-typed-errors-09.kt -->
<!--- TEST assert -->

Just like `recover` the `catch` function works DSL based, and we can thus mix both types seamlessly with each-other again like the example above.

## Accumulating errors

All the behavior above work similar to `Throwable`, but in a typed manner. This means that if we encounter a typed error, or _logical failure_, that error is propagated, and we can't continue with the computation and _short-circuit_.
When we need to work with collections, or `Iterable`, we often want to accumulate all the errors, and not short-circuit. Lets take a look at how we can do this.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.nonEmptyListOf
import arrow.core.mapOrAccumulate
import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.core.raise.Raise
import io.kotest.matchers.shouldBe
-->
```kotlin
data class NotEven(val i: Int)

fun Raise<NotEven>.isEven(i: Int): Int =
  i.also { ensure(i % 2 == 0) { NotEven(i) } }

fun isEven2(i: Int): Either<NotEven, Int> =
  either { isEven(i) }
```

First we define two functions that return a typed error if the value is not even.
If we want to accumulate all the errors we can use `mapOrAccumulate` on `Iterable` to accumulate all the errors, and doing so for `(0..10)` should return the following `errors`.
The errors are accumulated into `NonEmptyList` since there needs to be at least one error, or we would succeeded with the computation.

```kotlin
val errors = nonEmptyListOf(NotEven(1), NotEven(3), NotEven(5), NotEven(7), NotEven(9)).left()

fun example() {
  (1..10).mapOrAccumulate { isEven(it) } shouldBe errors
  (1..10).mapOrAccumulate { isEven2(it).bind() } shouldBe errors
}
```
<!--- KNIT example-typed-errors-10.kt -->
<!--- TEST assert -->

We can also provide custom logic to accumulate the errors, typically when we have custom types.
Below instead of `NonEmptyList<NotEven>` we have a `MyError` type that builds a String with all the error messages.
So we again define two functions that return a typed error if the value is not even.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.mapOrAccumulate
import arrow.core.raise.either
import arrow.core.raise.ensureNotNull
import arrow.core.raise.Raise
import io.kotest.matchers.shouldBe
-->
```kotlin
data class MyError(val message: String)

fun Raise<MyError>.isEven(i: Int): Int =
  ensureNotNull(i.takeIf { i % 2 == 0 }) { MyError("$i is not even") }

fun isEven2(i: Int): Either<MyError, Int> =
  either { isEven(i) }
```

And we write a small function that combines two values of our typed error into one, appending the error messages.

```kotlin
operator fun MyError.plus(second: MyError): MyError =
  MyError(message + ", ${second.message}")
```

We can then simply pass this function to the `mapOrAccumulate` function, and it will accumulate all the errors into a single `MyError` value using our provided function.

```kotlin
val error = MyError("1 is not even, 3 is not even, 5 is not even, 7 is not even, 9 is not even").left()

fun example() {
  (1..10).mapOrAccumulate(MyError::plus) { isEven(it) } shouldBe error
  (1..10).mapOrAccumulate(MyError::plus) { isEven2(it).bind() } shouldBe error
}
```
<!--- KNIT example-typed-errors-11.kt -->
<!--- TEST assert -->

# Conclusion

Working with typed errors in Kotlin with Arrow is a breeze. We can use the `Either` type to represent a value that can either be a success or a failure, and we can use the `Raise` DSL to raise typed errors without _wrappers_.
Since all these functions, and builders are build on top of `Raise` they all meaninglessly work together, and we can mix and match them as we please.

If you have any questions or feedback, please reach out to us on [Slack](https://slack-chats.kotlinlang.org/c/arrow) or [Github](https://github.com/arrow-kt/arrow/issues).
