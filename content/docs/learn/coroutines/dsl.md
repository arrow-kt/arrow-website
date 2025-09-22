---
sidebar_position: 2
title: Concurrency DSLs (experimental)
---

# Concurrency DSLs

<!--- TEST_NAME ConcurrencyDslTest -->

The domain-specific languages described in this section provide an alternative
to [high-level concurrency combinators](../parallel). The main goal is to
disrupt the usual flow of the code as little as possible, as opposed to
`parZip` or `raceN`, that require nesting code in a particular way.

:::warning

The functionality described in this section is experimental.
Although the basic concepts shall remain, we may tweak the API in the future.

:::

## Racing

## Await all / parallelism

Although `parZip` gives a high-level view of the code, clearly specifying
which tasks are independent of each other, it has the drawback of requiring a particular
style of writing your computations. Arrow provides another tool based on `async`,
where the code is written using the usual `async`/`.await()` idioms.

<!--- INCLUDE
import arrow.fx.coroutines.parZip
import arrow.fx.coroutines.await.awaitAll
typealias UserId = Int
data class User(val name: String, val avatar: String)
suspend fun getUserName(id: UserId): String = "$id-name"
suspend fun getAvatar(id: UserId): String = "$id-avatar"
-->
```kotlin
suspend fun getUser(id: UserId): User = awaitAll {
  val name = async { getUserName(id) }
  val avatar = async { getAvatar(id) }
  User(name.await(), avatar.await())
}
```
<!--- KNIT example-concurrency-dsl-01.kt -->

As the name suggests, within this `awaitAll` block, every time you call `.await()`
_all_ of the `async` computations that were registered until that point are
awaited. If any of those throw an exception, the whole block is canceled, as
per the rules of structured concurrency. In general, writing a sequence of independent
`async` computations within `awaitAll` is equivalent to giving those computations
as arguments to `parZip`.
