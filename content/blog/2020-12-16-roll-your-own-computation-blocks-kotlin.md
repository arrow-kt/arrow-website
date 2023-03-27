---
title: Roll your own Computation blocks in Kotlin
image: https://img.youtube.com/vi/0_zatebXMDU/hqdefault.jpg
category: videos
tags: [core, fx, videos]
link: https://youtu.be/0_zatebXMDU
event: Lambda Lille
---
Computation blocks empower library authors and users to build ad-hoc operators and DSLs over any data-type getting rid of API complexity and simplifying composition. In this talk, we will learn how we can build Computation blocks over Kotlin suspend functions & the Arrow Continuations library's `reset` / `shift` capabilities. We will demonstrate the composition of well known JVM data-types and patterns such as lists, futures, streams, and IOs, where callback chains can be simply replaced by a single
suspended operator. The Kotlin suspension system provides enough capabilities to implement delimited continuations allowing us to ignore methods such as `map` & `flatMap` on your favorite data-type in favor of direct imperative syntax. Leveraging Kotlin suspension & thinking of Continuations as "The Mother of all Monads", we will embark on this journey where we'll build and roll our own computation blocks with Arrow Continuations.
