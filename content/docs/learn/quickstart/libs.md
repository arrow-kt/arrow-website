---
title: Overview of libraries
description: Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.
sidebar_position: 1
sidebar_custom_props:
  icon: icon-docs.svg
---

# Overview of libraries

Arrow is not a single library, but a collection of them. The guiding principle is that each Arrow library should be _self-contained_: each library improves or extends a single commonly-used library in the Kotlin ecosystem (like `arrow-core` and `arrow-fx-coroutines`) or a particular Kotlin language feature (like `arrow-optics`), or focuses on a particular set of tasks (like `arrow-resilience`).

Note that during the transition to Arrow 2.x some libraries were further split. If you are an Arrow 1.x user you can follow the deprecation warnings to make the switch to the new organization, or read our [1.2.0 migration guide](../../quickstart/migration/).

| Library | Features |
| --- | --- |
| `arrow-core` <br /> _Companion to [Kotlin's standard library](https://kotlinlang.org/api/latest/jvm/stdlib/)_ | [Typed errors](../../typed-errors/), including `Raise`, `Either`, and `Option` <br /> [Non-empty collections](../../collections-functions/non-empty) <br /> [Memoized recursive functions](../../collections-functions/recursive/) |
| `arrow-fx-coroutines` <br /> _Companion to [KotlinX Coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/)_ | [High-level concurrency](../../coroutines/parallel), including `parMap` and `parZip` <br /> [Resource management](../../coroutines/resource-safety/) (with `suspend`) |
| `arrow-autoclose` | [Resource management](../../coroutines/resource-safety/) (no `suspend`) |
| `suspendapp` | [Graceful shutdown](../../coroutines/suspendapp/) |
| `arrow-resilience` | [Resilience patterns](../../resilience/) |
| `arrow-optics` + `arrow-optics-ksp-plugin` <br /> _Companion to [data](https://kotlinlang.org/docs/data-classes.html) and [sealed](https://kotlinlang.org/docs/sealed-classes.html) classes_ | Utilities for [immutable data](../../immutable-data/intro/) |
| `arrow-fx-stm` | [Software Transactional Memory](../../coroutines/stm/) (STM) |
| `arrow-atomic` <br /> _Multiplatform-ready [references](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)_ | [Atomic references](../../coroutines/concurrency-primitives/#atomic) |
| `arrow-collectors` <br /> _Companion to [`fold`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) and [`reduce`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)_ | [Aggregation with single traversal](../../collections-functions/collectors/) |
| `arrow-eval` <br /> _More powerful [laziness](https://kotlinlang.org/docs/delegated-properties.html#lazy-properties)_ | [Control over evaluation](../../collections-functions/eval/) |
| `arrow-functions` <br /> <small>Part of `arrow-core` in 1.x</small> | [Utilities for functions](../../collections-functions/utils/) |
| `arrow-core-high-arity` | `arrow-core` for more than 10 parameters |

| Library | Integrates with |
| --- | --- |
| `arrow-core-serialization` | [KotlinX Serialization](https://kotlinlang.org/docs/serialization.html) for core types |
| `arrow-cache4k` | [cache4k](https://reactivecircus.github.io/cache4k/) for [memoization](../../collections-functions/recursive/) |
| `arrow-optics-compose` | [Compose state management](https://developer.android.com/jetpack/compose/state) with [optics](../../immutable-data/intro/) |
