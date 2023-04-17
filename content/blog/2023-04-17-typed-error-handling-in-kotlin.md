---
title: Typed Error Handling in Kotlin
image: https://miro.medium.com/v2/resize:fit:4800/0*kOFUN-7oR7gyGXu_
category: articles
tags: [core, articles]
link: https://medium.com/@mitchellyuwono/typed-error-handling-in-kotlin-11ff25882880
---

# Typed Error Handling in Kotlin

A comparative study about several typed-error handling practices in Kotlin.

There are various approaches to error handling in the Kotlin community. 
In this article we’ve explored a small subset of typed error handling practices in the community. 

From the approaches explored, there were three patterns that aligns with Kotlin recommendation with 
relatively low cognitive complexity including: Sealed class matching with early returns, Arrow's `either { }` builder, 
and Arrow's `context(Raise<E>)` with context-receivers. 

Arrow's `context(Raise<E>)` achieved the most optimized score on all aspects of 
developer productivity. This includes having the lowest cognitive complexity, the lowest cyclomatic complexity 
as well as the most succinct with the least lines of codes.

Read the full article: [Typed Error Handling in Koltin](https://medium.com/@mitchellyuwono/typed-error-handling-in-kotlin-11ff25882880).
