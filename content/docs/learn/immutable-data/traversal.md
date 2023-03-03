---
sidebar_position: 4
---

# Traversals

The framework laid out by optics extends very nicely to values like lists, which
contain any potential number of elements. Traversals is the name of that kind of
optic.

:::info In a rush?

- Traversal focus on an indefinite number of values.
- To access all the the value, use `getAll`.
  - Traversals provide an API similar to those of collections.
- To modify every value focused by the traversal, use `modify`.

:::

<!--- TEST_NAME Traversal -->

<!--- INCLUDE .*
import io.kotest.matchers.shouldBe
-->

## `Every` element in a collection

As the other kinds of optics, `Traversal<T, A>` represents a reference to elements
of type `A` within a larger structure of type `T`. As hinted above, most
traversals arise from focusing on elements in a collection; in Arrow Optics
those basic traversals live in the `Every` object.

Let's introduce a small data class for our examples,

<!--- INCLUDE
import arrow.optics.*
import arrow.optics.dsl.*
-->

```kotlin
@optics data class Person(val name: String, val age: Int, val friends: List<Person>) {
  companion object
}
```

If we want to update the age of every `Person` in a list, the usual way is to
use the `map` function from the standard library.

```kotlin
fun List<Person>.happyBirthdayMap(): List<Person> =
  map { Person.age.modify(it) { age -> age + 1 } }
```

The same code can be rewritten using only optics, by leveraging a traversal for
lists.

```kotlin
fun List<Person>.happyBirthdayOptics(): List<Person> =
  Every.list<Person>().age.modify(this) { age -> age + 1 }
```

Traversals become more useful when composed with other optics. Imagine that we
want to update the age of all the friends of a `Person`; the usual implementation
with `map` and `copy` becomes quite complex.

```kotlin
fun Person.happyBirthdayFriends(): Person =
  copy(
    friends = friends.map { friend -> friend.copy(age = friend.age + 1) }
  )
```

The implementation using optics hides all the complexity related to mapping
and copying, and simply focuses on the path to access the values.

```kotlin
fun Person.happyBirthdayFriendsOptics(): Person =
  Person.friends.every(Every.list()).age.modify(this) { it + 1 }
```
<!--- KNIT example-traversal-01.kt -->

:::note Every(List)

You might be wondering why we need to write `Every.list()` as argument to `every`,
given that we know that `Person.friends` focuses on a `List<Person>`.
The reason is [type erasure](https://kotlinlang.org/docs/generics.html#type-erasure):
the compiler cannot differentiate between `Lens<Person, List<Person>>`
and `Lens<Person, Map<String, Person>>`, so there's no way to tell which
is the right traversal to apply in each case. However, if we provide the
hint ourselves by giving `Every.list()` as argument, the compiler is able
to _check_ that our usage is correct.

:::

## More than `getAll`

The counterpart to `get` and `getOrNull` when speaking about traversals is called
`getAll`, and returns a list of focused elements. But you don't always have to 
go through an intermediate list to obtain information about the elements focused
by a `Traversal`, we provide a [large API](https://arrow-kt.github.io/arrow/arrow-optics/arrow.optics/-getter/index.html)
based on Kotlin's collections in the standard library.

For example, you can call `isEmpty` to check whether the traversal matches any
element. Or more generally, you can call `size` to obtain the amount of elements
matches by it. Note that in any case these operations are "optics-first", so
you need to provide the value they operate on as an argument.
