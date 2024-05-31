---
sidebar_position: 7
---

# (Pattern) matching

[Optionals](optional.md) and [prisms](prism-iso.md) provide ways to query
whether a certain piece of data is present, and [lenses](lens.md) allow
us to extract some information from a value. In many functional languages,
those tasks are accomplished using [pattern matching](https://en.wikipedia.org/wiki/Pattern_matching);
and with Arrow Optics those same ideas translate to Kotlin.

<!--- TEST_NAME Matching -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
import arrow.optics.*
import arrow.optics.match.*
-->

In the following examples we use this set of types, which showcase a 
sealed hierarchy (`User`/`Person`/`Company`) for which prisms are generated,
and data classes for which we get lenses.

```kotlin
@optics data class Name(
  val firstName: String, val lastName: String
) { companion object }

@optics sealed interface User { companion object }
@optics data class Person(
  val name: Name, val age: Int
): User { companion object }
@optics data class Company(
  val name: String, val director: Name, val address: String
): User 
```