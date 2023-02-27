---
sidebar_position: 1
---

# High-level concurrency

[Coroutines](https://kotlinlang.org/docs/coroutines-guide.html) are one of the
most interesting features of Kotlin. However, the ["coroutines standard library"](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
sometimes fall short, especially when you have to deal with a big amount of
suspended computations. Arrow provides those few additional functions which have
proven useful in Kotlin code, and also in other programming communities.

:::info

Arrow Fx makes it easier to follow the [Structured Concurrency](https://kotlinlang.org/docs/composing-suspending-functions.html#structured-concurrency-with-async)
rules, even when the logic grows more complex.

:::

## Independently, in parallel

Very often we have independent computations that we want to perform in parallel.
For example, if we need to fetch a value from the database, and download a file
from another service, there's no reason why we shouldn't do them concurrently.
If both functions are defined as `suspend`ed, we can use `parZip` to combine the
execution.

```kotlin
suspend fun getUser(id: UserId): User =
  parZip(
    getUserName(id),
    getAvatar(id)
  ) { name, avatar -> User(name, avatar) }
```

The code above showcases how `parZip` is used: we have a sequence of arguments
representing each of the computations to perform, and at the end one final
block (usually written in trailing form) that specifies what to do with the
results of those computations. In this case, the two arguments obtain the name
and avatar, and the block puts them together in the `User` type.

:::tip

Using `parZip` is important not only for its high-level view on concurrency.
Its implementation also takes care of the complex task of propagating exceptions
and cancelling running computations whenever one of the task fails.

:::

In the code above we had a fixed sequence of computations to perform in parallel.
In other cases those computations depend on some form of _collection_; for example,
we want to obtain the name of all the friends of a user. Arrow provides `parMap`
for that use case.

```kotlin
suspend fun getFriendNames(id: UserId): User =
  getFriendIds(id).parMap { getUserName(it) }
```

One potential problem with `parMap` is that we may have _too much_ concurrency
if the amount of elements in the collection is too big. To fight against this
problem Arrow provides a version of `parMap` with an additional parameter that
tells how many computations should be dispatched in parallel.

### Flows

The [`parMap`](https://arrow-kt.io/docs/apidocs/arrow-fx-coroutines/arrow.fx.coroutines/par-map.html)
function is also provided for [`Flow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/).
If the concurrency factor is more than 1, then inner flows are be collected by this operator concurrently.
When this factor is one, calling `parMap` is identical to calling `map` on the flow.

Additional performance can be gained if we don't impose the same ordering on
the output of mapping than the one in the source flow. Just call [`parMapUnordered`](https://arrow-kt.io/docs/apidocs/arrow-fx-coroutines/arrow.fx.coroutines/par-map-unordered.html)
in that case. As with `parMap`, the concurrency factor defines how many
computations should be executed concurrent at most.

## Racing

The `parX` operators describe the cases in which we are interested in the result
of _every_ computation we perform. But imagine the scenario in which we want to
download a file, but for resilience purposes we try two servers at the same
time. Once we get the file from one server, we're not really interested in the 
rest. This is an example of **racing** two computations.

Arrow provides functions that perform racing over 2 or 3 computations, with the
option of customizing the coroutine context.

```kotlin
val file = raceN(
  downloadFrom(server1),
  downloadFrom(server2)
).merge()
```

In the example above we show a common pattern used in combination with `raceN`.
The result of the aforementioned function is `Either<A, B>`, with each type
corresponding to one branch in `raceN`. Since we have here two computation that
return the same type, and we don't care which one "wins", we conflate both into
a single value.

## Integration with typed errors

It works mostly fine, but there are some subtleties.
