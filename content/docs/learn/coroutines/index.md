---
title: Coroutines
---

import DocCardList from '@theme/DocCardList';

# Concurrency and resources

[Coroutines](https://kotlinlang.org/docs/coroutines-guide.html) are one of the
most interesting features of Kotlin. However, the ["coroutines standard library"](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/)
sometimes falls short, especially when dealing with many
suspended computations. Arrow provides those few additional functions that have
proven useful in Kotlin code and other programming communities.

Arrow Fx makes it easier to follow the [Structured Concurrency](https://kotlinlang.org/docs/composing-suspending-functions.html#structured-concurrency-with-async)
rules, even when the logic grows more complex.

:::note Where to find it

High-level concurrency is part of the `arrow-fx-coroutines` library.

:::

<DocCardList />