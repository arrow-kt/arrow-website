---
title: Library reference
description: Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.
sidebar_position: 6
sidebar_custom_props:
  icon: icon-docs.svg
---

# Library reference

Arrow is not a single library, but a collection of them. The guiding principle is that each Arrow library should be _self-contained_: each library improves or extends a single commonly-used library in the Kotlin ecosystem (like `arrow-core` and `arrow-fx-coroutines`) or a particular Kotlin language feature (like `arrow-optics`), or focuses on a particular set of tasks (like `arrow-resilience`).

Note that during the transition to Arrow 2.x some libraries were further split. If you are an Arrow 1.x user you can follow the deprecation warnings to make the switch to the new organization, or read our [2.0 / 1.2.0 migration guide](../../quickstart/migration/).

| Library | Features                                                                                                                                                                                                                           |
| --- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `arrow-core` <br /> _Companion to [Kotlin's standard library](https://kotlinlang.org/api/latest/jvm/stdlib/)_ | [Typed errors](../../typed-errors/), including `Raise`, `Either`, and `Option` <br /> [Non-empty collections](../../collections-functions/non-empty) <br /> [Memoized recursive functions](../../collections-functions/recursive/) |
| `arrow-fx-coroutines` <br /> _Companion to [KotlinX Coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/)_ | [High-level concurrency](../../coroutines/parallel), including `parMap` and `parZip` <br /> [Resource management](../../coroutines/resource-safety/) (with `suspend`)                                                              |
| `arrow-autoclose` | [Resource management](../../coroutines/resource-safety/) (no `suspend`)                                                                                                                                                            |
| `suspendapp` | [Graceful shutdown](../../coroutines/suspendapp/)                                                                                                                                                                                  |
| `arrow-resilience` | [Resilience patterns](../../resilience/)                                                                                                                                                                                           |
| `arrow-optics` + `arrow-optics-ksp-plugin` <br /> _Companion to [data](https://kotlinlang.org/docs/data-classes.html) and [sealed](https://kotlinlang.org/docs/sealed-classes.html) classes_ | Utilities for [immutable data](../../immutable-data/intro/)                                                                                                                                                                        |
| `arrow-fx-stm` | [Software Transactional Memory](../../coroutines/stm/) (STM)                                                                                                                                                                       |
| `arrow-collectors` <br /> _Companion to [`fold`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) and [`reduce`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)_ | [Aggregation with single traversal](../../collections-functions/collectors/)                                                                                                                                                       |
| `arrow-eval` <br /> _More powerful [laziness](https://kotlinlang.org/docs/delegated-properties.html#lazy-properties)_ | [Control over evaluation](../../collections-functions/eval/) <br /> <small>Part of `arrow-core` in 1.x</small>                                                                                                                     |
| `arrow-functions` | [Utilities for functions](../../collections-functions/utils/) <br /> <small>Part of `arrow-core` in 1.x</small>                                                                                                                    |
| `arrow-core-high-arity` | `arrow-core` for more than 10 parameters                                                                                                                                                                                           |
| `arrow-atomic` <br /> _Multiplatform-ready [references](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)_ | [Atomic references](../../coroutines/concurrency-primitives/#atomic) <br /> <small>Replaced by [standard-library atomics](https://kotlinlang.org/docs/whatsnew2120.html#common-atomic-types)</small>                               |
| `arrow-exception-utils` | Small utilities for exceptions <br /> <small>(mostly for internal use)</small>                                                                                                                                                    |

The Arrow project also maintains some integrations with popular libraries in the ecosystem.
For a broader overview of integrations, see the [corresponding page](/learn/integrations/).

| Use case | Library | Integrates with                                                                                                            |
| -- | --- |----------------------------------------------------------------------------------------------------------------------------|
| _Typed errors_ | `arrow-core-result4k` | Use `Raise` with [Result4k](https://github.com/fork-handles/forkhandles/tree/trunk/result4k)                               |
| _Serialization_ | `arrow-core-serialization` | [KotlinX Serialization](https://kotlinlang.org/docs/serialization.html) for core types                                     |
| | `arrow-core-jackson` | [Jackson](https://github.com/FasterXML/jackson-module-kotlin) 3.x for core types                                           |
| | `arrow-core-jackson2` | [Jackson](https://github.com/FasterXML/jackson-module-kotlin) 2.x for core types                                           |
| | `arrow-core-retrofit` | [Retrofit](https://square.github.io/retrofit/) with core types                                                             |
| [_Ktor_](https://ktor.io/) | `suspendapp-ktor` | [Graceful shutdown with Ktor](https://arrow-kt.io/learn/coroutines/suspendapp/ktor/)                                       |
| | `arrow-resilience-ktor-client` | [Resilience](https://arrow-kt.io/learn/resilience/) client plug-ins                                                        |
| _Memoization_ | `arrow-cache4k` | [cache4k](https://reactivecircus.github.io/cache4k/) for [memoization](../../collections-functions/recursive/)             |
| _Compose_ | `arrow-optics-compose` | [Compose state management](https://developer.android.com/jetpack/compose/state) with [optics](../../immutable-data/intro/) |
