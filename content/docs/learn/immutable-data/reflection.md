---
sidebar_position: 5
---

# Reflection

Although we strongly recommend generating optics using the DSL and `@optics` attribute, sometimes this is not possible. For those scenarios we provide a small utility package `arrow-optics-reflect` which bridges Arrow Optics with [Kotlin's reflection](https://kotlinlang.org/docs/reflection.html) capabilities.

<!--- TEST_NAME Reflection -->

<!--- INCLUDE .*
import arrow.optics.*
import io.kotest.matchers.shouldBe
-->

Kotlin provides a simple way to obtain a reference to a member of a class, by using `ClassName::memberName`. For example, given the following class definition:

```kotlin
data class Person(val name: String, val friends: List<String>)
```

we can use `Person::name` and `Person::friends` to refer to each of the fields in the class. Those references are very similar to optics.
In fact, what `arrow-optics-reflect` does is provide extension methods which turn those references into optics. You can obtain a lens for the `name` field in `Person` by writing:

```
Person::name.lens
```

which you can later use as any other lens:

```kotlin
fun main() {
  val p = Person("me", listOf("pat", "mat"))
  val m = Person::name.lens.modify(p) { it.capitalize() }
  m.name shouldBe "Me"
}
```
<!--- KNIT example-reflection-01.kt -->
<!--- TEST assert -->

:::danger

This only works on `data` classes with a public `copy` method (which is the default.) Remember that, as opposed to a mutable variable, optics will always create a _new_ copy when asking for modification.

:::

## Nullables and collections

Sometimes it's preferable to expose a field using a different optic:

- When the type of the field is nullable, you can use `optional` to obtain an optional instead of a lens.
- When the type of the field is a `List` or `Map`, you can use `every` and `values` to obtain a traversal to the elements.

<!--- INCLUDE
data class Person(val name: String, val friends: List<String>)
-->

```kotlin
fun main() {
  val p = Person("me", listOf("pat", "mat"))
  val m = Person::friends.every.modify(p) { it.capitalize() }
  m.friends shouldBe listOf("Pat", "Mat")
}
```
<!--- KNIT example-reflection-02.kt -->
<!--- TEST assert -->

## Prisms

A common pattern in Kotlin programming is to define a sealed abstract class (or interface) with subclasses representing choices in a union.

```kotlin
sealed interface Cutlery
object Fork: Cutlery
object Spoon: Cutlery
```

We provide an `instance` method which creates a prism which focus only on a certain subclass of a parent class. Both ends are important and must be provided when creating the optic:

```
instance<Cutlery, Fork>()
```

You can compose this optic freely with others. Here's an example in which we obtain the number of forks in a list of cutlery using optics:

```kotlin
fun main() {
  val things = listOf(Fork, Spoon, Fork)
  val forks = Every.list<Cutlery>() compose instance<Cutlery, Fork>()
  val noOfForks = forks.size(things)
  noOfForks shouldBe 2
}
```
<!--- KNIT example-reflection-03.kt -->
<!--- TEST assert -->
