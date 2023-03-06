---
sidebar_position: 1
---

# Introduction

Most, if not all, of the systems we develop nowadays require the cooperation of
other services, which may live in the same process, in the same machine, or may
require some network communication. This creates a lot of potential different
scenarios when things may fail. **Resilience** is the ability for your system 
to act in an organized way when those events occur.

Your particular approach to resilience depends on multiple factors. Is it
possible to try again that request? Should the administrator be alerted if the
detected error is fatal? Instead of predefined answers, Arrow aims to provide
a set of **tools** which you can compose to specify your solution in a succinct
and composable way.

## In KotlinX Coroutines

The coroutines standard library has some support for handling failure in an
ordered way by means of [`SupervisorJob`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-supervisor-job.html).
and [`supervisorScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/supervisor-scope.html).
According to the documentation of the latter,

> Unlike [`coroutineScope,`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/coroutine-scope.html) 
  a failure of a child does not cause this scope to fail and does not affect its
  other children, so a custom policy for handling failures of its children can be implemented.

## In Arrow Fx Resilience

:::caution Arrow pre-1.2.0

In Arrow series 1.0.x and 1.1.x, these types were provided as part of the
`arrow-fx-coroutines` library. They currently live in `arrow-fx-resilience`,
even though a migration window is in place until Arrow 2.0.

:::

The Arrow Fx Resilience library implements three of the most important design
pattern around resilience:

- Retry and repeat computations by means of [`Schedule`](retry-and-repeat),
- Protect other services from been overloaded using [`CircuitBreaker`](circuitbreaker),
- Implement transactional behavior in distributed systems in the form of [`Saga`](saga).


:::tip Further reading

If you want to know more about these patterns, you can check some of these guides:

- [_A pattern language for microservices_](https://microservices.io/patterns/)
- [_Cloud design patterns_](https://learn.microsoft.com/en-us/azure/architecture/patterns/)
  (the documentation talks about Azure, but its insights are widely applicable.)

:::
