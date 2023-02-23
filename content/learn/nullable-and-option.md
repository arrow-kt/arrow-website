---
id: nullable-and-option
title: Why nullable types & Option?
description: This document discusses the difference between nullable types and Option, and when to use each.
slug: /nullable-and-option
---

# Why nullable types & Option?

<!--- TEST_NAME OptionAndNullableKnitTest -->

If you have worked with Java at all in the past, it is very likely that you have come across a `NullPointerException` at some time (other languages will throw similarly named errors in such a case).
Usually this happens because some method returns `null` when you weren't expecting it and, thus, isn't dealing with that possibility in your client code.
A value of `null` is often abused to represent an absent optional value. Kotlin already solves the problem by getting rid of `null` values altogether, and providing its own special syntax [Null-safety machinery based on `?`](https://kotlinlang.org/docs/reference/null-safety.html).

Since Kotlin already has nullable types, why do we need Arrow's `Option` type?  There is only **a few** cases where you should use `Option` instead of nullable types.
There is only one good reason to use `Option` instead of nullable types, and that is the _nested nullability_ problem. Let's see an example:

We write a small `firstOrElse` function, and it should return the first element of a list, or the default value if the list is **empty**.

<!--- INCLUDE
import io.kotest.matchers.shouldBe
-->
```kotlin
fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()

fun main() {
  emptyList<Int?>().firstOrElse { -1 } shouldBe -1
  listOf(1, null, 3).firstOrElse { -1 } shouldBe 1
}
```
<!--- KNIT example-option-01.kt -->
<!--- TEST assert -->

When run this code with an `emptyList`, or a non-empty list it seems to work as expect.

:::danger Unexpected result
If we run this function with a list that contains `null` as the **first** value we get an unexpected result.
:::

<!--- INCLUDE
import io.kotest.matchers.shouldBe

fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()
-->
```kotlin
fun main() {
  listOf(null, 2, 3).firstOrElse { -1 } shouldBe null
}
```
<!--- KNIT example-option-02.kt -->
<!--- TEST lines.first().startsWith("Exception in thread \"main\" java.lang.AssertionError: Expected null but actual was -1") -->

Now we're executing the function on a list that `isNotEmpty`, so we expect it to return the first element of value `null`.
Instead however it returns `-1`, which is the default value we specified in case the list `isEmpty`!

```
Exception in thread "main" java.lang.AssertionError: Expected null but actual was -1
```

This is known as the _nested nullability_ problem, and it is a problem that can be solved by using `Option` instead of nullable types.
So let's analyse what is going wrong here, and how we can fix it. When we look at the implementation of our `firstOrElse` function,
we see that we're using `firstOrNull` to get the first element of the list, and if that is `null` we return the default value.

Our generic parameter of `Any` however has an upperbound of `Any?`, so we can pass in a list of nullable values.
This means that `firstOrNull` can return `null` if the first element of the list is `null`, and we're not handling that case.

```kotlin
fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()
```
<!--- KNIT example-option-03.kt -->

We can solve this in two ways, one is by restricting `A` to have an upperbound of `Any` instead,
but then we limit this function to only work with non-nullable types.

```kotlin
fun <A : Any> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()
```
<!--- KNIT example-option-04.kt -->

Our previous examples of `List<Int?>` would not even compile in that case, so this is not a good solution.
Instead, we could use `firstOrNone` and then we can handle the case where the first element is `null`:

<!--- INCLUDE
import arrow.core.None
import arrow.core.Some
import arrow.core.firstOrNone
import io.kotest.matchers.shouldBe
-->
```kotlin
fun <A> List<A>.firstOrElse(default: () -> A): A =
  when(val option = firstOrNone()) {
    is Some -> option.value
    None -> default()
  }
```

If we now run our previous examples again, they all behave as expected since we can rely on `None` to detect the case where the list is empty.

```kotlin
fun main() {
  emptyList<Int?>().firstOrElse { -1 } shouldBe -1
  listOf(1, null, 3).firstOrElse { -1 } shouldBe 1
  listOf(null, 2, 3).firstOrElse { -1 } shouldBe null
}
```
<!--- KNIT example-option-05.kt -->
<!-- TEST assert -->

Sometimes you might still want to use `Option` instead of nullable types, even when you're not the author of these generic functions.
Some libraries such as [RxJava](https://github.com/ReactiveX/RxJava/wiki/What's-different-in-2.0#nulls) and [Project Reactor](https://projectreactor.io/docs/core/release/reference/#null-safety) don't support nullable types in all their APIs.
If you still need to work with `null` in combination with generic APIs that don't allow nullable types, you can use `Option` to work around this problem.

:::tip Arrow DSL
Arrow also provides special DSL syntax for _nullable_ & `Option` types
:::

## Working with Option

Arrow offers a special DSL syntax for all of its types, and it also offers it for _nullable types_ so let's review both below.
Before we get started we need to know how to construct an `Option` from a (nullable) value, and vice versa.

`Option<A>` is a container for an optional value of type `A`. If the value of type `A` is present, the `Option<A>` is an instance of `Some<A>`, containing the present value of type `A`. If the value is absent, the `Option<A>` is the object `None`.
And we have 4 constructors available to create an `Option<A>`, their regular `class` constructors and 2 extension functions that return `Option<A>`.

<!--- INCLUDE
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import arrow.core.None
import arrow.core.none
import io.kotest.matchers.shouldBe
-->
```kotlin
val some: Some<String> = Some("I am wrapped in something")
val none: None = None

val optionA: Option<String> = "I am wrapped in something".some()
val optionB: Option<String> = none<String>()

fun main() {
  some shouldBe optionA
  none shouldBe optionB
}
```
<!--- KNIT example-option-06.kt -->
<!--- TEST assert -->

Creating a `Option<A>` from a nullable type `A?` can be useful for when we need to lift nullable values into Option. This can be done with the `Option.fromNullable` function, or the `A?.toOption()` extension function.

<!--- INCLUDE
import arrow.core.Option
import arrow.core.toOption
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  val some: Option<String> = Option.fromNullable("Nullable string")
  val none: Option<String> = Option.fromNullable(null)
  
  "Nullable string".toOption() shouldBe some
  null.toOption<String>() shouldBe none
}
```
<!--- KNIT example-option-07.kt -->
<!--- TEST assert -->

:::danger Take care
If `A?` is null than you should be explicitly using the `Some` or `.some()` constructor.
Otherwise, you will get a `None` instead of a `Some` due to the _nested nullable_ problem.
:::

<!--- INCLUDE
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import arrow.core.None
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  val some: Option<String?> = Some(null)
  val none: Option<String?> = Option.fromNullable(null)
  
  some shouldBe null.some()
  none shouldBe None
}
```
<!--- KNIT example-option-08.kt -->
<!--- TEST assert -->

## Extracting values from Option

So now that we know how to construct `Option` values, how can we extract the value from it?
The easiest way to extract the `String` value from the `Option` would be to turn it into a _nullable type_ using `getOrNull` and work with it like we would normally do with nullable types.

<!--- INCLUDE
import arrow.core.None
import arrow.core.Some
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  Some("Found value").getOrNull() shouldBe "Found value"
  None.getOrNull() shouldBe null
}
```
<!--- KNIT example-option-09.kt -->
<!--- TEST assert -->

Another way would be to provide a default value using `getOrElse`. This is similar to the `?:` operator in Kotlin, but instead of providing a default value for `null`, we provide a default value for `None`.
In the example below we provide a default value of `"No value"` for when the `Option` is `None`.

<!--- INCLUDE
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.getOrElse
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  Some( "Found value").getOrElse { "No value" } shouldBe "Found value"
  None.getOrElse { "No value" } shouldBe "No value"
}
```
<!--- KNIT example-option-10.kt -->
<!--- TEST assert -->

Since `Option` is modeled as a `sealed class` we can use exhaustive `when` statements to _pattern match_ on the possible cases.

<!--- INCLUDE
import arrow.core.None
import arrow.core.Some
import arrow.core.none
import arrow.core.some
import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  when(val value = 20.some()) {
    is Some -> value.value shouldBe 20
    None -> fail("$value should not be None")
  }
  
  when(val value = none<Int>()) {
    is Some -> fail("$value should not be Some")
    None -> value shouldBe None
  }
}
```
<!--- KNIT example-option-11.kt -->
<!--- TEST assert -->

## Option & nullable DSL

Now that we know how to construct `Option` values, and turn `Option` back into regular (nullable) values.
Let's see how we can use the `Option` and nullable DSL to work with `Option` & nullable values in an imperative way.

When working with nullable types, we often need to check if the value is `null` or not, and then do something with it. We typically do that by using `?.let { }` but this quickly results in a lot of nested `?.let { }` blocks.
Arrow offers `bind()`, and `ensureNotNull`, to get rid of this issue, so let's look at an example. As well as some other interesting functions that Arrow provides in its DSL.

Imagine we have a `User` domain class that has _nullable_ email address, and we want to find a user by their id, and then email them.

<!--- INCLUDE
typealias Email = String
typealias QueryParameters = Map<String, String>
typealias SendResult = Unit
-->
```kotlin
@JvmInline value class UserId(val value: Int)
data class User(val id: UserId, val email: Email?)

fun QueryParameters.userId(): UserId? = get("userId")?.toIntOrNull()?.let { UserId(it) }
fun findUserById(id: UserId): User? = TODO()
fun sendEmail(email: Email): SendResult? = TODO()
```

```kotlin
fun sendEmail(params: QueryParameters): SendResult? =
  params.userId()?.let { userId ->
    findUserById(userId)?.email?.let { email ->
      sendEmail(email)
    }
  }
```
<!--- KNIT example-option-12.kt -->

There is already quite some nesting going on, and quite a lot of `?` but we can use `bind()`, and `ensureNotNull`, to get rid of the nesting.

:::tip Seamlessly mix
The `nullable` DSL can seamlessly be mixed with `Option` by calling `bind` on `Option` values.
:::

<!--- INCLUDE
import arrow.core.Option
import arrow.core.raise.nullable

typealias Email = String
typealias QueryParameters = Map<String, String>
typealias SendResult = Unit
-->
```kotlin
@JvmInline value class UserId(val value: Int)
data class User(val id: UserId, val email: Email?)

fun QueryParameters.userId(): UserId? = get("userId")?.toIntOrNull()?.let { UserId(it) }
fun findUserById(id: UserId): Option<User> = TODO()
fun sendEmail(email: Email): SendResult? = TODO()
```

```kotlin
fun sendEmail(params: QueryParameters): SendResult? = nullable {
  val userId = ensureNotNull(params.userId())
  val user = findUserById(userId).bind()
  val email = user.email.bind()
  sendEmail(email)
}
```
<!--- KNIT example-option-13.kt -->

Similarly, this same pattern is applicable to `Option` as well as other data types such as `Either` which is covered in other sections.

:::tip Seamlessly mix
The `Option` DSL can seamlessly be mixed with _nullable types_ by using `ensureNotNull`.
:::

<!--- INCLUDE
import arrow.core.Option
import arrow.core.raise.option
import arrow.core.toOption

typealias Email = String
typealias QueryParameters = Map<String, String>
typealias SendResult = Unit
-->
```kotlin
@JvmInline value class UserId(val value: Int)
data class User(val id: UserId, val email: Email?)

fun QueryParameters.userId(): Option<UserId> =
  get("userId")?.toIntOrNull()?.let(::UserId).toOption()

fun findUserById(id: UserId): Option<User> = TODO()
fun sendEmail(email: Email): Option<SendResult> = TODO()
```

```kotlin
fun sendEmail(params: QueryParameters): Option<SendResult> = option {
  val userId = params.userId().bind()
  val user = findUserById(userId).bind()
  val email = ensureNotNull(user.email)
  sendEmail(email).bind()
}
```
<!--- KNIT example-option-14.kt -->

## Inspecting `Option` values

Beside extracting the value from an `Option`, or sequencing nullable or `Option` based logic, we often just need to _inspect_ the values inside it.
With _nullable types_ we can simply use `!= null` to inspect the value, but with `Option` we can check whether option has value or not using `isSome` and `isNone`.

<!--- INCLUDE
import arrow.core.Some
import arrow.core.none
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  Some(1).isSome() shouldBe true
  none<Int>().isNone() shouldBe true
}
```
<!--- KNIT example-option-15.kt -->
<!--- TEST assert -->

The same function exists to check if `Some` contains a value that passes a certain predicate. For _nullable types_ we would use `?.let { } ?: false`.

<!--- INCLUDE
import arrow.core.Option
import arrow.core.Some
import arrow.core.None
import arrow.core.none
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  Some(2).isSome { it % 2 == 0 } shouldBe true
  Some(1).isSome { it % 2 == 0 } shouldBe false
  none<Int>().isSome { it % 2 == 0 } shouldBe false
}
```
<!--- KNIT example-option-16.kt -->
<!--- TEST assert -->

And finally sometimes we just need to execute a side effect, if the value is present. For _nullable types_ we would use `?.also { }` or `?.also { if(it != null) { } }`.

<!--- INCLUDE
import arrow.core.Option
import arrow.core.Some
import arrow.core.None
import arrow.core.none
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  Some(1).onSome { println("I am here: $it") }
  none<Int>().onNone { println("I am here") }
  
  none<Int>().onSome { println("I am not here: $it") }
  Some(1).onNone { println("I am not here") }
}
```
<!--- KNIT example-option-17.kt -->
```text
I am here: 1
I am here
```
<!--- TEST -->

## Conclusion

Typically, when working in Kotlin you should prefer working with _nullable types_ over `Option` as it is more idiomatic.
However, when writing generic code we sometimes need `Option` to avoid the _nested nullability_ issue. Or when working with libraries that don't support _null values_ such as Project Reactor or RxJava.

Arrow offers a neat DSL to work with `Option` and _nullable types_ in an imperative way, which makes it easy to work with them both in a functional way.
They seamlessly integrate with each other, so you can use whatever you need and prefer when you need it.
