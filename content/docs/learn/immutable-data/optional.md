---
sidebar_position: 3
---

# Optionals

Optionals allow focusing on elements that may not be present. This includes
nullable values and elements on indexed collections such as `List` or `Map`.

:::info In a rush?

- Optionals represent potentially missing values.
- Prisms extend optionals to represent class hierarchies.
- To access the value, use `getOrNull`.
- To modify the value (**only** if present), use `set` and `modify`.

:::

<!--- TEST_NAME Optional -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
-->

## Indexed collections

To exemplify why optionals are helpful, let's introduce a few domain classes
that model a small in-memory database mapping person names to the city in
which they live.

```kotlin
import arrow.optics.*
import arrow.optics.dsl.*
import arrow.optics.typeclasses.*

@optics data class Db(val cities: Map<String, City>) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}
```

There's a notion of elements within a map, which we refer to by their key.
However, we cannot model them as lenses because we don't know whether
a particular key is present in the map. Optionals come to the rescue: they are
optics whose focus may not exist for a specific value.

As a result, the `get` operation is replaced by `getOrNull`, where `null`
indicates that the value is not present. The following code snippet provides
an example of that behavior using the `index` provided by Arrow Optics.

```kotlin
val db = Db(mapOf(
  "Alejandro" to City("Hilversum", "Netherlands"),
  "Ambrosio"  to City("Ciudad Real", "Spain")
))

fun example() {
  Db.cities.index("Alejandro").country.getOrNull(db) shouldBe "Netherlands"
  Db.cities.index("Jack").country.getOrNull(db) shouldBe null
}
```
<!--- KNIT example-optional-01.kt -->
<!--- TEST assert -->

One important (and sometimes surprising) behavior of optionals is that using
`set` or `modify` only transforms the value if it is already present. That means
that we cannot use `index` to _add_ elements to the database, only to _modify_
those already present.

<!--- INCLUDE

import arrow.optics.*
import arrow.optics.dsl.*
import arrow.optics.typeclasses.*

@optics data class Db(val cities: Map<String, City>) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}

val db = Db(mapOf(
  "Alejandro" to City("Hilversum", "Netherlands"),
  "Ambrosio"  to City("Ciudad Real", "Spain")
))

-->

```kotlin
fun example() {
  val dbWithJack = Db.cities.index("Jack").set(db, City("London", "UK"))
  // Jack was not really added to the database
  ("Jack" in dbWithJack.cities) shouldBe false
}
```
<!--- KNIT example-optional-02.kt -->
<!--- TEST assert -->

If you want to perform a change over the collection, use `modify` over the
lens that corresponds to that field.


<!--- INCLUDE

import arrow.optics.*
import arrow.optics.dsl.*
import arrow.optics.typeclasses.*

@optics data class Db(val cities: Map<String, City>) {
  companion object
}
@optics data class City(val name: String, val country: String) {
  companion object
}

val db = Db(mapOf(
  "Alejandro" to City("Hilversum", "Netherlands"),
  "Ambrosio"  to City("Ciudad Real", "Spain")
))

-->

```kotlin
fun example() {
  val dbWithJack = Db.cities.modify(db) { it + ("Jack" to City("London", "UK")) }
  // now Jack is finally in the database
  ("Jack" in dbWithJack.cities) shouldBe true
}
```
<!--- KNIT example-optional-03.kt -->
<!--- TEST assert -->

:::tip More indexed collections

The first parameter to the `index` optional represents the type of collection
you are accessing. Currently, this argument can be `Index.list`, `Index.map`,
`Index.sequence`, or `Index.string`. The choice defines the type of keys
and values expected by each operation.

:::

## Nullable types

:::danger Breaking change in Arrow 2.x

The Arrow Optics plug-in in Arrow 1.x creates optionals for fields with nullable
types. This has sometimes led to surprises because, with an optional, you cannot
modify that value if it's `null`. In Arrow 2.x, every field gives rise to a lens
instead. The old behavior is available via the `notNull` extension function.

:::

Kotlin supports the notion of [nullable types](https://kotlinlang.org/docs/null-safety.html),
which clearly specify when a value may be absent. The compiler prevents you from
calling a method or function that requires a non-`null` value with a potentially
absent one. These checks are also in place when working with Arrow Optics;
if you have a `nickname: Lens<Person, String?>`, you must account for
nullability in each potential modification.

It's also possible to turn a lens over a nullable type into an optional of the
unwrapped type using `notNull`. In the example above, `nickname.notNull`
has the type `Optional<Person, String>` (notice the lack of `?` at the end
of the second type parameter). However, you should be aware that, following the same logic
as with indexed collections where you could not add or remove elements, with
`notNull`, you cannot change whether the value is `null` or not; only modify
it if it's already not null.
