---
sidebar_position: 1
---

# Introduction

Most, if not all, of the systems we develop nowadays require the cooperation of
other services, which may live in the same process, in the same machine, or may
require some network communication. This creates a lot of different potential
scenarios where things may fail. **Resilience** is the ability of your system 
to act in an organized way when those events occur.

Your particular approach to resilience depends on multiple factors. Is it
possible to try that request again? Should the administrator be alerted if the
detected error is fatal? Instead of predefined answers, Arrow aims to provide
a set of **tools** that you can compose to specify your solution in a concise
and composable way.

:::note Where to find it

All the resilience mechanisms described in this section are part of the `arrow-resilience` library. Prior to version 1.2.0, they were available as part of `arrow-fx-coroutines`.

:::

The Arrow Resilience library implements three of the most critical design
pattern around resilience:

- Retry and repeat computations using [`Schedule`](../retry-and-repeat),
- Protect other services from being overloaded using [`CircuitBreaker`](../circuitbreaker),
- Implement transactional behavior in distributed systems in the form of [`Saga`](../saga).

:::info Media Resources

The following videos showcase how to introduce resilience in your applications.

- [_Functional Programming in Kotlin with Arrow_](https://www.youtube.com/watch?v=IDMmmrRhUvQ) by Simon Vergauwen and Alejandro Serrano
- [_Building applications with Kotlin and Arrow.kt in style_](https://www.youtube.com/watch?v=g79A6HmbW5M) by Simon Vergauwen

:::

:::tip Further Reading

If you want to know more about these patterns, you can check some of these guides:

- [_A pattern language for microservices_](https://microservices.io/patterns/)
- [_Cloud design patterns_](https://learn.microsoft.com/en-us/azure/architecture/patterns/)
  (the documentation talks about Azure, but its insights are widely applicable.)

:::
