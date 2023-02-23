<!--- TEST_NAME OptionKnitTest -->

# Nullable vs Option

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
However, if we run this function with a list that contains `null` as the **first** value we get an unexpected result.

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
Some libraries such as [RxJava]() and [Project Reactor](https://projectreactor.io/docs/core/release/reference/#null-safety) don't support nullable types in all their APIs.
If you still need to work with `null` in combination with generic APIs that don't allow nullable types, you can use `Option` to work around this problem.

Arrow also provides special DSL syntax for _nullable_ types, so let's review both below and compare both below.

## Option

`Option<A>` is a container for an optional value of type `A`.
If the value of type `A` is present, the `Option<A>` is an instance of `Some<A>`, containing the present value of type `A`. If the value is absent, the `Option<A>` is the object `None`.

<!--- INCLUDE
import arrow.core.Option
import arrow.core.Some
import arrow.core.None
-->
```kotlin
val some: Option<String> = Some("I am wrapped in something")
val none: Option<String> = None

fun main() {
  println("value = $some")
  println("empty = $none")
}
```
<!--- KNIT example-option-06.kt -->

```text
value = Option.Some(I am wrapped in something)
empty = Option.None
```
<!--- TEST -->

Let's write a function that may or may not give us a string, thus returning `Option<String>`:

<!--- INCLUDE
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
-->
```kotlin
fun findValue(value: Boolean): Option<String> =
  if (value) Some("Found value") else None
```
<!--- KNIT example-option-07.kt -->

Using `getOrElse`, we can provide a default value `"No value"` when the optional argument `None` does not exist.
This is similar to the `?:` operator in Kotlin, but instead of providing a default value for `null`, we provide a default value for `None`.

<!--- INCLUDE
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.getOrElse
import io.kotest.matchers.shouldBe

fun findValue(value: Boolean): Option<String> = if (value) Some("Found value") else None
-->
```kotlin
fun main() {
  findValue(true).getOrElse { "No value" } shouldBe "Found value"
  findValue(false).getOrElse { "No value" } shouldBe "No value"
}
```
<!--- KNIT example-option-08.kt -->
<!--- TEST assert -->

We can check whether option has value or not using `isSome` and `isNone`, which also support smart casts.

<!--- INCLUDE
import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import io.kotest.matchers.shouldBe

fun findValue(value: Boolean): Option<String> = if (value) Some("Found value") else None
-->
```kotlin
fun main() {
  findValue(true).isSome() shouldBe true
  findValue(false).isNone() shouldBe true
}
```
<!--- KNIT example-option-09.kt -->
<!--- TEST assert -->

The same function exists to check if `Some` contains a value that passes a certain predicate.

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
<!--- KNIT example-option-10.kt -->
<!--- TEST assert -->

Creating a `Option<T>` of a `T?` can be useful for when we need to lift nullable values into Option.
Beware that if `T?` is null than you should be explicitly using the `Some` or `.some()` constructor.

<!--- INCLUDE
import arrow.core.Option
import arrow.core.Some
import arrow.core.some
import arrow.core.None
import io.kotest.matchers.shouldBe
-->
```kotlin
fun main() {
  Option.fromNullable("Nullable string") shouldBe Some("Nullable string")
  Option.fromNullable(null) shouldBe None
  null.some() shouldBe Some(null)
}
```
<!--- KNIT example-option-11.kt -->
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
<!--- KNIT example-option-12.kt -->
<!--- TEST assert -->

// Below is WIP

```kotlin
import arrow.core.None
import arrow.core.Option
import arrow.core.Some

//sampleStart
val noValue: Option<Double> = None
val value = when (noValue) {
  is Some -> noValue.value
  is None -> 0.0
}

//sampleEnd
fun main() {
  println("value = $value")
}
```

<!--- KNIT example-option-13.kt -->

An alternative for pattern matching is folding. This is possible because an option could be looked at as a collection or
foldable structure with either one or zero elements.

One of these operations is `map`. This operation allows us to map the inner value to a different type while preserving
the option:

```kotlin
import arrow.core.None
import arrow.core.Option
import arrow.core.Some

//sampleStart
val number: Option<Int> = Some(3)
val noNumber: Option<Int> = None
val mappedResult1 = number.map { it * 1.5 }
val mappedResult2 = noNumber.map { it * 1.5 }

//sampleEnd
fun main() {
  println("number = $number")
  println("noNumber = $noNumber")
  println("mappedResult1 = $mappedResult1")
  println("mappedResult2 = $mappedResult2")
}
```

<!--- KNIT example-option-14.kt -->
Another operation is `fold`. This operation will extract the value from the option, or provide a default if the value
is `None`

```kotlin
import arrow.core.Option
import arrow.core.Some

val fold =
//sampleStart
  Some(3).fold({ 1 }, { it * 3 })

//sampleEnd
fun main() {
  println(fold)
}
```

<!--- KNIT example-option-15.kt -->

```kotlin
import arrow.core.Option
import arrow.core.none

val fold =
//sampleStart
  none<Int>().fold({ 1 }, { it * 3 })

//sampleEnd
fun main() {
  println(fold)
}
```

<!--- KNIT example-option-16.kt -->

Arrow also adds syntax to all datatypes so you can easily lift them into the context of `Option` where needed.

```kotlin
import arrow.core.some
import arrow.core.none

//sampleStart
val some = 1.some()
val none = none<String>()

//sampleEnd
fun main() {
  println("some = $some")
  println("none = $none")
}
```

<!--- KNIT example-option-17.kt -->

```kotlin
import arrow.core.toOption

//sampleStart
val nullString: String? = null
val valueFromNull = nullString.toOption()

val helloString: String? = "Hello"
val valueFromStr = helloString.toOption()

//sampleEnd
fun main() {
  println("valueFromNull = $valueFromNull")
  println("valueFromStr = $valueFromStr")
}
```

<!--- KNIT example-option-18.kt -->

You can easily convert between `A?` and `Option<A>` by using the `toOption()` extension or `Option.fromNullable`
constructor.

```kotlin
import arrow.core.firstOrNone
import arrow.core.toOption
import arrow.core.Option

//sampleStart
val foxMap = mapOf(1 to "The", 2 to "Quick", 3 to "Brown", 4 to "Fox")

val empty = foxMap.entries.firstOrNull { it.key == 5 }?.value.let { it?.toCharArray() }.toOption()
val filled = Option.fromNullable(foxMap.entries.firstOrNull { it.key == 5 }?.value.let { it?.toCharArray() })

//sampleEnd
fun main() {
  println("empty = $empty")
  println("filled = $filled")
}
```

<!--- KNIT example-option-19.kt -->

### Transforming the inner contents

```kotlin
import arrow.core.Some

fun main() {
  val value =
    //sampleStart
    Some(1).map { it + 1 }
  //sampleEnd
  println(value)
}
```

<!--- KNIT example-option-20.kt -->

### Computing over independent values

```kotlin
import arrow.core.Some

val value =
//sampleStart
  Some(1).zip(Some("Hello"), Some(20.0), ::Triple)

//sampleEnd
fun main() {
  println(value)
}
```

<!--- KNIT example-option-21.kt -->

### Computing over dependent values ignoring absence

```kotlin
import arrow.core.computations.option
import arrow.core.Some
import arrow.core.Option

suspend fun value(): Option<Int> =
//sampleStart
  option {
    val a = Some(1).bind()
    val b = Some(1 + a).bind()
    val c = Some(1 + b).bind()
    a + b + c
  }

//sampleEnd
suspend fun main() {
  println(value())
}
```

<!--- KNIT example-option-22.kt -->

```kotlin
import arrow.core.computations.option
import arrow.core.Some
import arrow.core.none
import arrow.core.Option

suspend fun value(): Option<Int> =
//sampleStart
  option {
    val x = none<Int>().bind()
    val y = Some(1 + x).bind()
    val z = Some(1 + y).bind()
    x + y + z
  }

//sampleEnd
suspend fun main() {
  println(value())
}
```

<!--- KNIT example-option-23.kt -->

## Credits

Contents partially adapted from [Scala Exercises Option Tutorial](https://www.scala-exercises.org/std_lib/options)
Originally based on the Scala Koans.
