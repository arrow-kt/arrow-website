---
sidebar_position: 4
---

# Concurrency primitives

These types are not usually found in application code, but provide essential
foundation blocks for larger patterns. They are also helpful during testing
to simulate synchronization between different systems.

:::info Multiplatform-ready

The Arrow Fx library is Multiplatform-ready, so you can use it in all of your
[KMP](https://kotlinlang.org/docs/multiplatform.html) projects. In most cases,
the API provided by Arrow Fx follows the one for similar concepts in the JVM.

:::

:::tip Structured concurrency

One key topic to understand concurrency in Kotlin is _Structured Concurrency_.
The [official coroutines guide](https://kotlinlang.org/docs/coroutines-guide.html)
goes into quite some length to explain how coroutines should behave, especially
in the events of exceptions and cancellations. Most of this complexity is hidden
away when you use Arrow Fx [high-level operations](../parallel).

:::

## Atomic

The separate [`arrow-atomic` library](https://apidocs.arrow-kt.io/arrow-atomic/arrow.atomic/index.html) 
provides Multiplatform-ready atomic references.
In particular, their `getAndSet`, `getAndUpdate`, and `compareAndSet` operations
are guaranteed to happen atomically; there's no possibility of two computations
performing these operations and getting an inconsistent state at the end.

:::warning Atomic primitive types

You should not use generic `Atomic` references with primitive types like
`Int` or `Boolean`, as they break in unexpected ways in Kotlin Native. Instead, use
the provided `AtomicInt`, `AtomicBoolean`, and so forth.

:::

## CountDownLatch

[`CountDownLatch`](https://apidocs.arrow-kt.io/arrow-fx-coroutines/arrow.fx.coroutines/-count-down-latch/index.html) 
allows for awaiting a given number of countdown signals.


:::info

This type models the behavior of [`java.util.concurrent.CountDownLatch`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CountDownLatch.html).

:::

## CyclicBarrier

A [`CyclicBarrier`](https://apidocs.arrow-kt.io/arrow-fx-coroutines/arrow.fx.coroutines/-cyclic-barrier/index.html)
is a synchronization mechanism that allows a set of coroutines to wait for each
other to reach a certain point before continuing execution. It is called _cyclic_
because it can be reused after all coroutines have reached the barrier and been released.

To use a `CyclicBarrier`, each coroutine must call the `await` method on the 
barrier object, which will cause the coroutine to suspend until the required 
number of coroutines have reached the barrier. 
Once all coroutines have reached the barrier, they resume execution.

:::info

This type models the behavior of [`java.util.concurrent.CyclicBarrier`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/CyclicBarrier.html).

:::
