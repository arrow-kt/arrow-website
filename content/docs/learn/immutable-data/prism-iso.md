---
sidebar_position: 5
---

# Prisms & Isos

Prisms extend the capabilities of optics from merely inspecting or modifying
values to _constructing_ them. This is very useful when using sealed hierarchies
or value classes.

:::info In a rush?

- Prisms extend optionals to represent class hierarchies.
- Isos extend prisms (and lenses) to represent lossless conversion between types.
  - One important case is given by value classes.
- To build a value use `reverseGet`.

:::

<!--- TEST_NAME PrismIso -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
-->

## (Sealed) class hierarchies

The following is an example of `User` where
we have two options: a person or a company.

```kotlin
import arrow.optics.*

@optics sealed interface User {
  companion object
}
@optics data class Person(val name: String, val age: Int): User {
  companion object
}
@optics data class Company(val name: String, val country: String): User {
  companion object
}
```

The Arrow Optics plug-in generates two optics within `User`, namely
`User.person` and `User.company`. These optics only focus on a value when
it has the corresponding type. This is often used to modify a value only
for a specific type in the hierarchy, leaving the rest untouched. This is
precisely what happens in the function below:
`Person`s get their age incremented, but `Company`s remains unchanged.

```kotlin
fun List<User>.happyBirthday() =
  map { User.person.age.modify(it) { age -> age + 1 } }
```
<!--- KNIT example-prism-iso-01.kt -->

Several of the types in Arrow Core fit this pattern of sealed hierarchy, and
Arrow Optics contains optics matching those. One example is `Either`, with
the corresponding `left` and `right`.

### Constructing values

The optics we're discussing in this section provide an added feature: they can
be used to _create_ new values in addition to inspecting or modifying existing
ones. Optionals with this power are called **prisms**, and this power is
available as the `reverseGet` operation.

For example, we can build a `Left` value using the corresponding prism
instead of the constructor.

<!--- INCLUDE
import arrow.core.Either
import arrow.optics.*
-->

```kotlin
fun example() {
  val x = Prism.left<Int, String>().reverseGet(5)
  x shouldBe Either.Left(5)
}
```
<!--- KNIT example-prism-iso-02.kt -->
<!--- TEST assert -->

## Isomorphisms

Prisms allow you to construct values, but still the top of the hierarchy
may have different subclasses, so access still required as optional.
For example, you can construct an `Either` from `Right`, but when you
inspect an `Either`, `Left` is also a possibility. There are some cases
when the conversion between two types is lossless: we can go back and forth
without any chance of failure on inspection. We say that there is an 
_isomorphism_ between those types; for that reason the corresponding optic
is called an **iso**.

For example, we can move between `Option<String>` and `Either<Unit, String>`
without loss of information. We convert from `Some` to `Right`, and from
`None` to `Left`, and vice versa. There's no loss of information because
`Unit` is an `object`, so there's a single instance which may appear in the
`Left` value.

:::tip Iso = Prism + Lens

You can see an iso as a prism where `get` always succeeds,
or as a lens which also supports the `reverseGet` operation.

:::

### Value classes

One important case in which lossless conversion is possible is given
by [value (or inline) classes](https://kotlinlang.org/docs/inline-classes.html),
which wrap a single value as a distinct type. This kind of classes are
very useful to [model your domain accurately](../../design/domain-modeling/).

<!--- INCLUDE
import arrow.optics.*
-->

```kotlin
@optics data class Person(val name: String, val age: Age) {
  companion object
}

@JvmInline @optics value class Age(val age: Int) {
  companion object
}
```

Since isos are also lenses, you can still use the syntax from [the latter](../lens/)
to access the value contained in the class.

```kotlin
fun Person.happyBirthday(): Person =
  Person.age.age.modify(this) { it + 1 }

fun example() {
  val p = Person("me", Age(29))
  p.happyBirthday().age shouldBe Age(30)
}
```
<!--- KNIT example-prism-iso-03.kt -->
<!--- TEST assert -->
