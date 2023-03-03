---
sidebar_position: 2
---

# Lenses

Lenses are the most common type of optic you work with. This section discusses
them at length.

:::info In a rush?

- Lenses represent references to fields.
- To access the value, use `get`.
- To modify the value, use `set` and `modify`.
  - To modify several elements at once, use `copy`.

:::

<!--- TEST_NAME Lens -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
-->

## The `Lens` type

We've mentioned in the [introduction](../intro) that optics are _values_ that
represent access to data. You can draw parallels with how function values 
represent behavior.

Let's introduce a few data classes and kindly ask the Arrow Optics plug-in to
generate lenses for every field by having an `@optics` annotation,

```kotlin
import arrow.optics.*

@optics data class Person(val name: String, val age: Int, val address: Address) {
  companion object
}
@optics data class Address(val street: Street, val city: City) {
  companion object
}
@optics data class Street(val name: String, val number: Int?) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}
```
<!--- KNIT example-lens-01.kt -->

The lenses are generated in the companion object, so you can think of your
`Person` being extended as follows:

<!--- INCLUDE

import arrow.optics.*

data class Address(val street: Street, val city: City) {
  companion object
}
data class Street(val name: String, val number: Int?) {
  companion object
}
data class City(val name: String, val country: String) {
  companion object
}

-->

```kotlin
data class Person(val name: String, val age: Int, val address: Address) {
  companion object {
    val name: Lens<Person, String> = TODO()
    val age: Lens<Person, Int> = TODO()
    val address: Lens<Person, Address> = TODO()
  }
}
```
<!--- KNIT example-lens-02.kt -->

Notice that lenses in Arrow are _typed_, which means that they "know"
both the type of the bigger value, and the type of the element we focus on.

```plain
                  ↱ this lens operates on 'Person'
val address: Lens<Person, Address>
                          ↳ this lens gives access to an 'Address' value
```

### Operations

Lenses provide three main operations:

- `get` obtains the elements focused on a lens,
- `set` changes the value of the focus to a new one,
- `modify` transforms the value of the focus, by applying a given function.

<!--- INCLUDE

import arrow.optics.*

@optics data class Person(val name: String, val age: Int, val address: Address) {
  companion object
}
@optics data class Address(val street: Street, val city: City) {
  companion object
}
@optics data class Street(val name: String, val number: Int?) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}

-->

Code speaks louder than words (well, sometimes). Here's a small snippet showcasing
the three operations applied to an instance of our `Person` class. Notice how
the three operations live on the lens, and get the value the operate on as an
argument.

```kotlin
fun main() {
  val me = Person(
    "Alejandro", 35, 
    Address(Street("Kotlinstraat", 1), City("Hilversum", "Netherlands"))
  )

  Person.name.get(me) shouldBe "Alejandro"
  
  val meAfterBirthdayParty = Person.age.modify(me) { it + 1 }
  Person.age.get(meAfterBirthdayParty) shouldBe 36

  val newAddress = Address(Street("Kotlinplein", null), City("Amsterdam", "Netherlands"))
  val meAfterMoving = Person.address.set(me, newAddress)
  Person.address.get(meAfterMoving) shouldBe newAddress
}
```
<!--- KNIT example-lens-03.kt -->
<!--- TEST assert -->

### Composition

The power of lenses (and optics in general) lies in the ability to _compose_
them to get to nested values. The type parameters in `Lens` ensure that the
composition accesses values which are really there. For example, here's a lens
which focuses on the city where a `Person` lives,

<!--- INCLUDE .*-domain-.*

import arrow.optics.*

@optics data class Person(val name: String, val age: Int, val address: Address) {
  companion object
}
@optics data class Address(val street: Street, val city: City) {
  companion object
}
@optics data class Street(val name: String, val number: Int?) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}

-->

```kotlin
val personCity: Lens<Person, String> =
  Person.address compose Address.city compose City.name

fun main() {
  val me = Person(
    "Alejandro", 35, 
    Address(Street("Kotlinstraat", 1), City("Hilversum", "Netherlands"))
  )

  personCity.get(me) shouldBe "Hilversum"
  val meAtTheCapital = personCity.set(me, "Amsterdam")
}
```
<!--- KNIT example-lens-domain-01.kt -->
<!--- TEST assert -->

The `compose` infix function is an integral part of the library, but you almost
never see it mentioned explicitly. As part of its job, the Arrow Optics compiler
plug-in introduces additional extension functions which allow you to use the
regular dot operation to access composed lenses. The code above can be rewritten
in that form:

```kotlin
fun main() {
  val me = Person(
    "Alejandro", 35, 
    Address(Street("Kotlinstraat", 1), City("Hilversum", "Netherlands"))
  )

  Person.address.city.name.get(me) shouldBe "Hilversum"
  val meAtTheCapital = Person.address.city.name.set(me, "Amsterdam")
}
```
<!--- KNIT example-lens-domain-02.kt -->
<!--- TEST assert -->

### More powerful `copy`

Everything we've discussed until this point is enough to make transformation
of nested data much nicer, without the nested of nested `copy` calls. However,
if we need to modify more than one field we need to nest calls to `set` or `modify`.

```kotlin
fun Person.moveToAmsterdamModify(): Person =
  Person.address.city.name.set(
    Person.address.city.country.set(this, "Netherlands"),
    "Amsterdam"
  )
```

Arrow Optics provides a `copy` function which replicates the ability of the
built-in `copy` to modify more than one field. The syntax is slightly different,
though: after the `copy` you need to start a block; and within that block you
can use the name of a lens to perform an operation.

```kotlin
fun Person.moveToAmsterdamCopy(): Person = copy {
  Person.address.city.name set "Amsterdam"
  Person.address.city.country set "Netherlands"
}
```

One additional nicety is that you can condense those operations which share
part of the journey to their focus. In our case, we are modifying two elements
in `address.city`, which we can join using `inside`.

```kotlin
fun Person.moveToAmsterdamInside(): Person = copy {
  inside(Person.address.city) {
    City.name set "Amsterdam"
    City.country set "Netherlands"
  }
}
```
<!--- KNIT example-lens-domain-03.kt -->
