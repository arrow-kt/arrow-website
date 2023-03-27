---
sidebar_position: 1
---

# Working with typed errors

<!--- TEST_NAME TypedErrorsTest -->

Working with typed errors offers a few advantages over using exceptions:

- **Type Safety:** Typed errors allow the compiler to find type mismatches early, making it easier to catch bugs before they make it to production. However, with exceptions, the type information is lost, making it more difficult to detect errors at compile-time.

- **Predictability:** When using typed errors, the possible error conditions are explicitly listed in the type signature of a function. This makes it easier to understand the possible error conditions and write tests covering all error scenarios.

- **Composability:** Typed errors can be easily combined and propagated through a series of function calls, making writing modular, composable code easier. With exceptions, ensuring errors are correctly propagated through a complex codebase can be difficult.

- **Performance:** Exception handling can significantly impact performance, especially in languages that don't have a dedicated stack for exceptions. Typed errors can be handled more efficiently as the compiler has more information about the possible error conditions.

In summary, typed errors provide a more structured, predictable, and efficient way of handling errors and make writing high-quality, maintainable code easier.

:::info Media resources

- [_Functional Error Handling - A Practical Approach_](https://kotlindevday.com/videos/functional-error-handling-a-practical-approach-bas-de-groot/) by Bas de Groot
- [_Exception handling in Kotlin with Arrow_](https://www.youtube.com/watch?v=ipF540mBG9w) by Ramandeep Kaur
- [_Por qué no uso excepciones en mi código_](https://www.youtube.com/watch?v=8WdprhzmQe4) by Raúl Raja and [Codely](https://codely.com/)

:::

## Different types

There are three ways of working with errors (in addition to [_nullability_ and `Option`](../nullable-and-option), which model simple absence of value):

- `Either<E, A>` represents a _computed value_ of _either_ a _logical failure_ of `E` or a _success_ value `A`.

- `Ior<E, A>` represents a computed value of _either_ a _logical failure_ of `E` or a _success_ value `A` or **both** a success value of `A` together with a _logical failure_ of `E`.

- `Raise<E>` represents a _computation_ that might result in a _logical failure_ of `E`.

Below, we'll cover how you can work with these types and the differences and similarities using some examples. These types expose a similar API and allow working in a similar fashion.

## Working with errors

Let's define a simple program that _raises_ a _logical failure_ of `UserNotFound` or returns a `User`. We can represent this both as a value `Either<UserNotFound, User>`, and as a _computation_ (using `Raise<UserNotFound>`).

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
object UserNotFound
data class User(val id: Long)

val user: Either<UserNotFound, User> = User(1).right()

fun Raise<UserNotFound>.user(): User = User(1)
```

Above, we clearly show the difference between a _value_, or `val`, of `Either` and a _computation_, or `fun`, using `Raise<UserNotFound>`. Since **both** represent _either_ `UserNotFound` or `User`, we can easily work with both together.

We can quickly turn our _computation_ `user()` into a _value_ of `Either` by wrapping it inside the `either` DSL, and we can do the opposite for our `Either` value by _safely_ unwrapping it using `bind()`.

```kotlin
val res = either { user() }

fun Raise<UserNotFound>.res(): User = user.bind()
```

We can then _inspect_ the value of `res` using Kotlin's `when`, or `fold` the _computation_ providing a lambda for both the _logical failure_ and the _success_ case.

```kotlin
fun example() {
  when (res) {
    is Left -> fail("No logical failure occurred!")
    is Right -> res.value shouldBe User(1)
  }

  fold(
    block = { res() },
    recover = { _: UserNotFound -> fail("No logical failure occurred!") },
    transform = { i: User -> i shouldBe User(1) }
  )
}
```
<!--- KNIT example-typed-errors-01.kt -->
<!--- TEST assert -->

:::info Fold over all possible cases
Unless you explicitly wrap your code to catch exceptions as part of `Either` or `Raise`, exceptions bubble up in the usual way. If you need to handle those exceptions, `fold` is also available with a `catch` argument to recover from any `Throwable` that might've been thrown.
:::

To create a _value_ of a _logical failure_, we use the `left` _smart-constructor_ for `Either`, or `raise` DSL function for a _logical failure_ inside a `Raise` _computation_.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.Either.Right
import arrow.core.left
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

object UserNotFound
data class User(val id: Long)
-->
```kotlin
val error: Either<UserNotFound, User> = UserNotFound.left()

fun Raise<UserNotFound>.error(): User = raise(UserNotFound)
```

We can then again use `when` or `fold` to _inspect_ or _compute_ the value and function.

```kotlin
fun example() {
  when (error) {
    is Left -> error.value shouldBe UserNotFound
    is Right -> fail("A logical failure occurred!")
  }

  fold(
    { error() },
    { e: UserNotFound -> e shouldBe UserNotFound },
    { _: User -> fail("A logical failure occurred!") }
  )
}
```
<!--- KNIT example-typed-errors-02.kt -->
<!--- TEST assert -->

Besides `raise` or `left`, several DSLs are also available to check invariants.
`either { }` and `Raise` offer `ensure` and `ensureNotNull`, in spirit with `require` and `requireNotNull` from the Kotlin Std.
Instead of throwing an exception, they result in a _logical failure_ with the given error if the predicate is not satisfied.

`ensure` takes a _predicate_ and a _lazy_ `UserNotFound` value. When the _predicate_ is not matched, the _computation_ will result in a _logical failure_ of `UserNotFound`.
In the function below, we show how we can use `ensure` to check if a given `User` has a valid id, and if not, we return a _logical failure_ of `UserNotFound`.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensure
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

data class User(val id: Long)
-->

```kotlin
data class UserNotFound(val message: String)

fun User.isValid(): Either<UserNotFound, Unit> = either {
  ensure(id > 0) { UserNotFound("User without a valid id: $id") }
}

fun Raise<UserNotFound>.isValid(user: User): User {
  ensure(user.id > 0) { UserNotFound("User without a valid id: ${user.id}") }
  return user
}

fun example() {
  User(-1).isValid() shouldBe UserNotFound("User without a valid id: -1").left()

  fold(
    { isValid(User(1)) },
    { _: UserNotFound -> fail("No logical failure occurred!") },
    { user: User -> user.id shouldBe 1 }
  )
}
```
<!--- KNIT example-typed-errors-03.kt -->
<!--- TEST assert -->

Without context receivers, these functions look pretty different depending on if we use `Raise` or `Either`. This is because we sacrifice our _extension receiver_ for `Raise`.
And thus, the `Raise` based computation cannot be an extension function on `User`. With context receivers, we could've defined it as:

<!--- INCLUDE
import arrow.core.raise.Raise
import arrow.core.raise.ensure

data class User(val id: Long)
data class UserNotFound(val message: String)
-->
```kotlin
context(Raise<UserNotFound>)
fun User.isValid(): Unit =
  ensure(id > 0) { UserNotFound("User without a valid id: $id") }
```
<!--- KNIT example-typed-errors-04.kt -->

::: info 
The [Arrow Detekt Rules]((https://github.com/woltapp/arrow-detekt-rules) project has a set of rules to _detekt_ you call `bind` on every `Either` value.
:::

`ensureNotNull` takes a _nullable value_ and a _lazy_ `UserNotFound` value. When the value is null, the _computation_ will result in a _logical failure_ of `UserNotFound`.
Otherwise, the value will be _smart-casted_ to non-null, and you can operate on it without checking nullability.
In the function below, we show how we can use `ensureNotNull` to check if a given `User` is non-null, and if not, we return a _logical failure_ of `UserNotFound`.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.raise.ensureNotNull
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.fold
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

data class User(val id: Long)
data class UserNotFound(val message: String)
-->
```kotlin
fun process(user: User?): Either<UserNotFound, Long> = either {
  ensureNotNull(user) { UserNotFound("Cannot process null user") }
  user.id // smart-casted to non-null
}

fun Raise<UserNotFound>.process(user: User?): Long {
  ensureNotNull(user) { UserNotFound("Cannot process null user") }
  return user.id // smart-casted to non-null
}

fun example() {
  process(null) shouldBe UserNotFound("Cannot process null user").left()

  fold(
    { process(User(1)) },
    { _: UserNotFound -> fail("No logical failure occurred!") },
    { i: Long -> i shouldBe 1L }
  )
}
```
<!--- KNIT example-typed-errors-05.kt -->
<!--- TEST assert -->

## Recovering from typed errors

When working with values or functions that can result in a typed error, we often need to _recover_ to provide or calculate fallback values.
To demonstrate how we can _recover_ from _logical failures_, let's define a simple function that returns our `User` in case the `id > 0`; otherwise it returns `UserNotFound`.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.getOrElse
import arrow.core.raise.ensure
import arrow.core.raise.either
import arrow.core.raise.Raise
import arrow.core.raise.recover
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

data class User(val id: Long)
data class UserNotFound(val message: String)
-->
```kotlin
suspend fun fetchUser(id: Long): Either<UserNotFound, User> = either {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  User(id)
}

suspend fun Raise<UserNotFound>.fetchUser(id: Long): User {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  return User(id)
}
```

To recover from any errors on a `Either` value, we can most conveniently use `getOrElse`, since it allows us to _unwrap_ the `Either` and provide a fallback value.
The same can be done for the `Raise` based computation using the `recover` DSL instead.

```kotlin
suspend fun example() {
  fetchUser(-1)
    .getOrElse { e: UserNotFound -> null } shouldBe null

  recover({
    fetchUser(1)
  }) { e: UserNotFound -> null } shouldBe User(1)
}
```
<!--- KNIT example-typed-errors-06.kt -->
<!--- TEST assert -->

Default to `null` is typically not desired since we've effectively swallowed our _logical failure_ and ignored our error. If that was desirable, we could've used nullable types initially.
When encountering a _logical failure_ and not being able to provide a proper fallback value, we typically want to execute another operation that might fail with `OtherError`.
As a result, our `Either` value doesn't get _unwrapped_ as it did with `getOrElse`, since a different _logical failure_ might've occurred.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.left
import arrow.core.raise.Raise
import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.core.recover
import arrow.core.right
import io.kotest.matchers.shouldBe

data class User(val id: Long)
data class UserNotFound(val message: String)

fun fetchUser(id: Long): Either<UserNotFound, User> = either {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  User(id)
}

fun Raise<UserNotFound>.fetchUser(id: Long): User {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  return User(id)
}
-->
```kotlin
object OtherError

fun example() {
  val either: Either<OtherError, User> =
    fetchUser(1)
      .recover { _: UserNotFound -> raise(OtherError) }
  
  either shouldBe User(1).right()

  fetchUser(-1)
    .recover { _: UserNotFound -> raise(OtherError) } shouldBe OtherError.left()
}
```
<!--- KNIT example-typed-errors-07.kt -->
<!--- TEST assert -->

The type system now tracks that a new error of `OtherError` might have occurred, but we recovered from any possible errors of `UserNotFound `. This is useful across application layers or in the service layer, where we might want to `recover` from a `DatabaseError` with a `NetworkError` when we want to load data from the network when a database operation failed.
To achieve the same with the `Raise` DSL, we need to be inside the context of `Raise<OtherError>` to `raise` it.

<!--- INCLUDE
import arrow.core.raise.Raise
import arrow.core.raise.ensure
import arrow.core.raise.recover

data class User(val id: Long)
data class UserNotFound(val message: String)

suspend fun Raise<UserNotFound>.fetchUser(id: Long): User {
  ensure(id > 0) { UserNotFound("Invalid id: $id") }
  return User(id)
}

object OtherError
-->
```kotlin
suspend fun Raise<OtherError>.recovery(): User =
  recover({
    fetchUser(-1)
  }) { _: UserNotFound -> raise(OtherError) }
```
<!--- KNIT example-typed-errors-08.kt -->

::: tip DSLs everywhere
Since recovery for both `Either` and `Raise` is DSL based, you can also call `bind` or `raise` from both.
This allows seamless interop between both types when creating programs that can fail and recovering from them.
:::

## Recovering from exceptions and wrapping foreign code

When building applications, we often need to wrap side effects or foreign code, like when interacting with the network or databases.
Wrapping such APIs requires handling the possibility of failure, and we can do so by returning a _logical failure_. The question is often, do we need to take into **all** exceptions or just a subset of them?
The answer is that it depends on the use case, but, in general, we should try to be as specific as possible and only handle the exceptions that we can recover from or expect.
However, you might want to be more defensive when interacting with improperly defined systems.

Let's look at an example where we interact with a database and want to insert a new user. If the user already exists, we want to return a _logical failure_ of `UserAlreadyExists`. Otherwise, we want to return the newly created user.
We again showcase both the code for `Either` and `Raise` based computation and see that both are almost the same.

The `catch` DSL allows us to wrap foreign functions and capture any `Throwable` or `T: Throwable` that might be thrown. It automatically avoids capturing [fatal exceptions](https://arrow-kt.github.io/arrow/arrow-core/arrow.core/-non-fatal.html) such as `OutOfMemoryError`, or Kotlin's `CancellationException`.
It requires two functions, or lambdas, as arguments: One for wrapping our _foreign code_ and another for resolving the captured `Throwable` or `T : Throwable`. In this case, instead of providing a fallback value, we `raise` a _logical failure_.

We expect `SQLException` since we only _expect_ it to be thrown and rethrow any other `Throwable`.
We can then operate on the captured `SQLException` to check if our insertion failed with a unique violation, and, in that case, we turn it into a `UserAlreadyExists` _logical failure_.

<!--- INCLUDE
import arrow.core.Either
import arrow.core.raise.catch
import arrow.core.raise.Raise
import java.sql.SQLException

object UsersQueries {
  fun insert(username: String, email: String): Long = 1L
}

fun SQLException.isUniqueViolation(): Boolean = true
-->
```kotlin
data class UserAlreadyExists(val username: String, val email: String)

suspend fun Raise<UserAlreadyExists>.insertUser(username: String, email: String): Long =
  catch({
    UsersQueries.insert(username, email)
  }) { e: SQLException ->
    if (e.isUniqueViolation()) raise(UserAlreadyExists(username, email))
    else throw e
  }
```

Since we also have `raise` available inside `either`, we can also write the same code using `either` or execute this function inside an `either` block as shown above.
This behavior is also available as top-level functionality on `Either` itself if you prefer to use that. It can be achieved using `catchOrThrow` instead of `catch` and `mapLeft` to transform `SQLException` into `UserAlreadyExists`.

```kotlin
suspend fun insertUser(username: String, email: String): Either<UserAlreadyExists, Long> =
  Either.catchOrThrow<SQLException, Long> {
    UsersQueries.insert(username, email)
  }.mapLeft { e ->
    if (e.isUniqueViolation()) UserAlreadyExists(username, email)
    else throw e
  }
```
<!--- KNIT example-typed-errors-09.kt -->

This pattern allows us to turn exceptions we want to track into _typed errors_, and things that are **truly** exceptional remain exceptional.

## Accumulating errors

All the behavior above works similarly to `Throwable`, but in a typed manner. This means that if we encounter a typed error or _logical failure_, that error is propagated, and we can't continue with the computation and _short-circuit_.
When we need to work with collections, or `Iterable`, we often want to accumulate all the errors and not short-circuit. Let's take a look at how we can do this.

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

First, we define two functions that return a typed error if the value is not even.
If we want to accumulate all the errors, we can use `mapOrAccumulate` on `Iterable` to get all the errors, and doing so for `(0..10)` should return the following `errors`.

:::info Non-empty lists

Since you have potentially more than one failure, the error type in `Either` must be some sort of list.
However, we know that if we are not in the happy path, then _at least one_ error must have occurred.
Arrow makes this fact explicit by making the return type of `mapOrAccumulate ` a `NonEmptyList`, or `Nel` for short.

:::

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
Below, instead of `NonEmptyList<NotEven>`, we have a `MyError` type that builds a String with all the error messages.
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

### Accumulating different computations

In the example above we are providing one single function to operate on a sequence of elements.
Another important and related scenario is accumulating different errors, but each of them coming from different computations.
For example, you need to perform validation over the different fields of a form, and accumulate the errors, but each field has different constraints.

As a guiding example, let's consider information about a user, where the name shouldn't be empty and the age should be non-negative.

```kotlin
data class User(val name: String, val age: Int)
```
<!--- KNIT example-typed-errors-12.kt -->

It's customary to define the different problems that may arise from validation as a sealed interface:

<!--- INCLUDE
import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.raise.either
import arrow.core.raise.ensure
import io.kotest.matchers.shouldBe
-->

```kotlin
sealed interface UserProblem {
  object EmptyName: UserProblem
  data class NegativeAge(val age: Int): UserProblem
}
```

Let's define validation as a _smart constructor_, that is, by creating a function which looks like the `User` constructor, but performs additional checks.

```kotlin
data class User private constructor(val name: String, val age: Int) {
  companion object {
    operator fun invoke(name: String, age: Int): Either<UserProblem, User> = either {
      ensure(name.isNotEmpty()) { UserProblem.EmptyName }
      ensure(age >= 0) { UserProblem.NegativeAge(age) }
      User(name, age)
    }
  }
}
```

Alas, that implementation stops after the first error. We can see this if we try to validate a `User` with both an empty name and a wrong age.

```kotlin
fun example() {
  User("", -1) shouldBe Left(UserProblem.EmptyName)
}
```
<!--- KNIT example-typed-errors-13.kt -->
<!--- TEST assert -->

<!--- INCLUDE
import arrow.core.Either
import arrow.core.Either.Left
import arrow.core.NonEmptyList
import arrow.core.nonEmptyListOf
import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.core.raise.zipOrAccumulate
import io.kotest.matchers.shouldBe

sealed interface UserProblem {
  object EmptyName: UserProblem
  data class NegativeAge(val age: Int): UserProblem
}
-->

If you want to gather as many validation problems as possible, you need to switch to _accumulation_, as done above with `mapOrAccumulate`.
When each of the validations is different, you should reach to `zipOrAccumulate`: each of the arguments defines one independent validation,
and the final block defines what to do when all the validations were successful, that is, when no problem was `raise`d during execution.

```kotlin
data class User private constructor(val name: String, val age: Int) {
  companion object {
    operator fun invoke(name: String, age: Int): Either<NonEmptyList<UserProblem>, User> = either {
      zipOrAccumulate(
        { ensure(name.isNotEmpty()) { UserProblem.EmptyName } },
        { ensure(age >= 0) { UserProblem.NegativeAge(age) } }
      ) { _, _ -> User(name, age) }
    }
  }
}
```

With this change, the problems are correctly accumulated. Now we can present the user all the problems in the form at once.

```kotlin
fun example() {
  User("", -1) shouldBe Left(nonEmptyListOf(UserProblem.EmptyName, UserProblem.NegativeAge(-1)))
}
```
<!--- KNIT example-typed-errors-14.kt -->
<!--- TEST assert -->

:::tip Error accumulation and concurrency

In addition to accumulating errors, you may want to perform each of the tasks within `zipOrAccumulate` or `mapOrAccumulate` in parallel.
Arrow Fx features [`parZipOrAccumulate` and `parMapOrAccumulate`](../../coroutines/parallel/#accumulating-typed-errors-in-parallel) to cover
those cases, in addition to [`parZip` and `parMap`](../../coroutines/parallel/#integration-with-typed-errors)
which follow a short-circuiting approach.

:::

## Creating your own error wrappers

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
<!--- KNIT example-typed-errors-15.kt -->
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

# Conclusion

Working with typed errors in Kotlin with Arrow is a breeze. We can use the `Either` type to represent a value that can either be a success or a failure, and we can use the `Raise` DSL to raise typed errors without _wrappers_.
Since all these functions and builders are built on top of `Raise`, they all seamlessly work together, and we can mix and match them as we please.

If you have any questions or feedback, please reach out to us on [Slack](https://slack-chats.kotlinlang.org/c/arrow) or [Github](https://github.com/arrow-kt/arrow/issues).
