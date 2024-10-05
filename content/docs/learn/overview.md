---
title: Overview
description: Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.
sidebar_position: 1
sidebar_custom_props:
  icon: icon-docs.svg
---

import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import DocCardList from '@theme/DocCardList';

# <decorated-text icon={frontMatter.sidebar_custom_props.icon} title={frontMatter.title} />

Arrow aims to bring _idiomatic_ _functional programming_ to Kotlin. This means Arrow is inspired by the great work made in other functional programming communities, yet exposes these ideas and concepts in ways that do not feel alien to Kotlin programmers.

Arrow comprises different libraries, each improving or extending one commonly-used library in the Kotlin ecosystem or a particular Kotlin language feature.

:::info In a rush?

Our [summary](../summary) is designed to help you find your way in the Arrow ecosystem.

:::

<DocCardList className="margin-bottom--lg" items={useDocsSidebar().items.filter(item => item.customProps?.overview )}/>


Each section in the documentation roughly corresponds to one of the libraries that compose Arrow.

- In our [Quickstart](../quickstart), you can read how to introduce Arrow in your project.
- No library lives in a vacuum, and Arrow enjoys [integrations](../integrations/) with many other popular Kotlin libraries.
- We also provide guidance on [broader design and architecture](../design) using functional programming concepts.

| Library | Features |
| --- | --- |
| `arrow-core` <br /> _Companion to [Kotlin's standard library](https://kotlinlang.org/api/latest/jvm/stdlib/)_ | [Typed errors](../typed-errors/), including `Raise`, `Either`, and `Option` <br /> [Non-empty collections](../collections-functions/non-empty) <br /> [Memoized recursive functions](../collections-functions/recursive/) |
| `arrow-fx-coroutines` <br /> _Companion to [KotlinX Coroutines](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/)_ | [High-level concurrency](../coroutines/parallel), including `parMap` and `parZip` <br /> [Resource management](../coroutines/resource-safety/) (with `suspend`) |
| `arrow-autoclose` | [Resource management](../coroutines/resource-safety/) (no `suspend`) |
| `arrow-resilience` | [Resilience patterns](../resilience/) |
| `arrow-optics` + `arrow-optics-ksp-plugin` <br /> _Companion to [data](https://kotlinlang.org/docs/data-classes.html) and [sealed](https://kotlinlang.org/docs/sealed-classes.html) classes_ | Utilities for [immutable data](../immutable-data/intro/), including [pattern matching](../immutable-data/matching/) |
| `arrow-match` | [Pattern matching](../immutable-data/matching/) without optics | 
| `arrow-fx-stm` | [Software Transactional Memory](../coroutines/stm/) (STM) |
| `arrow-atomic` <br /> _Multiplatform-ready [references](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)_ | [Atomic references](../coroutines/concurrency-primitives/#atomic) |
| `arrow-collectors` <br /> _Companion to [`fold`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) and [`reduce`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)_ | [Aggregation with single traversal](../collections-functions/collectors/) |
| `arrow-eval` <br /> _More powerful [laziness](https://kotlinlang.org/docs/delegated-properties.html#lazy-properties)_ | [Control over evaluation](../collections-functions/eval/) |
| `arrow-functions` <br /> <small>Part of `arrow-core` in 1.x</small> | [Utilities for functions](../collections-functions/utils/) |
| `arrow-core-high-arity` | `arrow-core` for more than 10 parameters |

| Library | Integrates with |
| --- | --- |
| `arrow-core-serialization` | [KotlinX Serialization](https://kotlinlang.org/docs/serialization.html) for core types |
| `arrow-cache4k` | [cache4k](https://reactivecircus.github.io/cache4k/) for [memoization](../collections-functions/recursive/) |
| `arrow-optics-compose` | [Compose state management](https://developer.android.com/jetpack/compose/state) with [optics](../immutable-data/intro/) |

:::note We'd love to hear from you!

We're always looking for ways to improve the libraries and the documentation. Feel free to [open an issue](https://github.com/arrow-kt/arrow/issues) in our repository with any suggestions or feedback. Thanks in advance! 🤩

:::
