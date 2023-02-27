---
sidebar_position: 3
---

# Transactional memory (STM)

Software transactional memory, or STM, is an abstraction for concurrent state modification.
With STM one can write code that concurrently accesses state and that can easily be composed without
 exposing details of how it ensures safety guarantees.
Programs running within an STM transaction will neither deadlock nor have race-conditions.
The base building blocks of STM are `TVar`'s and the primitives `retry`, `orElse`, and `catch`.

:::info

The API of `arrow-fx-stm` is based on Haskell's [`stm`](https://hackage.haskell.org/package/stm) package, and the implementation is based on the GHC implementation for fine-grained locks.
For further information you can read [_Composable memory transactions_](https://www.microsoft.com/en-us/research/publication/composable-memory-transactions/) by Tim Harris, Simon Marlow, Simon Peyton Jones, and Maurice Herlihy.

:::

## Reading and writing concurrent state

Those values which live under the umbrella of STM must be defined as `TVar`s
(short for _transactional variable_).
You can think of a `TVar<A>` as a variable holding values of type `A`, but where
concurrent modification is protected.
`TVar`s are not the only transactional data structure (more on that later),
but in any case, in order to modify one of them you need to be _inside_ the
STM context. This is achieved either by defining our
functions with `STM` as the receiver or using `stm` to create lambda functions
with such receiver.

By itself, a function using `STM` as receiver does _not_ perform any computations.
We say it's just a _description_ of a transaction. Running a transaction is then
done using `atomically`.

The example below shows a banking service moving money from one account to the other with STM.
Should the first account not have enough money we throw an exception. This code is guaranteed to never deadlock and to never
produce an invalid state by committing after the read state has changed concurrently.

```kotlin
import arrow.fx.stm.atomically
import arrow.fx.stm.TVar
import arrow.fx.stm.STM

fun STM.transfer(from: TVar<Int>, to: TVar<Int>, amount: Int): Unit {
  withdraw(from, amount)
  deposit(to, amount)
}

fun STM.deposit(acc: TVar<Int>, amount: Int): Unit {
  val current = acc.read()
  acc.write(current + amount)
  // or the shorthand acc.modify { it + amount }
}

fun STM.withdraw(acc: TVar<Int>, amount: Int): Unit {
  val current = acc.read()
  if (current - amount >= 0) acc.write(current - amount)
  else throw IllegalStateException("Not enough money in the account!")
}

suspend fun main() {
  val acc1 = TVar.new(500)
  val acc2 = TVar.new(300)
  println("Balance account 1: ${acc1.unsafeRead()}")
  println("Balance account 2: ${acc2.unsafeRead()}")
  println("Performing transaction")
  atomically { transfer(acc1, acc2, 50) }
  println("Balance account 1: ${acc1.unsafeRead()}")
  println("Balance account 2: ${acc2.unsafeRead()}")
}
```

One additional guarantee of STM is that the _whole_ transaction is executed
atomically. That means that we can modify several `TVar`s in one transaction,
and we'll never observe an intermediate state.

### Other STM data structures

The following types are built upon `TVar`s, and provided out of the box with Arrow:

- `TQueue`: transactional mutable queue,
- `TMVar`: mutable transactional variable that may be empty,
- `TSet`, `TMap`: transactional `Set` and `Map`,
- `TArray`: array of `TVar`'s,
- `TSemaphore`: transactional semaphore.

Note that in most cases using these data structures is much more efficient than
wrapping their "regular" version in a `TVar`. For example, a `TSet<A>` performs
better than a `TVar<Set<A>>`, because the latter needs to "lock" the entire set
on modification, whereas the former knows that only the affected entries need
to be taken into account.

## Retries

It is sometimes beneficial to manually abort the current transaction if an 
invalid state has been reacher. For example, a `TQueue` had no elements to read.
The aborted transaction will automatically restart once any previously accessed
variable has changed.

Here in this example we've changed `withdraw` to use `retry` and thus wait until
enough money is in the account, which after a few seconds just happens to be the case.

```kotlin
import arrow.fx.stm.atomically
import arrow.fx.stm.TVar
import arrow.fx.stm.STM
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.async
import kotlinx.coroutines.delay

fun STM.transfer(from: TVar<Int>, to: TVar<Int>, amount: Int): Unit {
  withdraw(from, amount)
  deposit(to, amount)
}

fun STM.deposit(acc: TVar<Int>, amount: Int): Unit {
  val current = acc.read()
  acc.write(current + amount)
  // or the shorthand acc.modify { it + amount }
}

fun STM.withdraw(acc: TVar<Int>, amount: Int): Unit {
  val current = acc.read()
  if (current - amount >= 0) acc.write(current - amount)
  else retry() // we now retry if there is not enough money in the account
  // this can also be achieved by using `check(current - amount >= 0); acc.write(it + amount)`
}

fun main(): Unit = runBlocking {
  val acc1 = TVar.new(0)
  val acc2 = TVar.new(300)
  println("Balance account 1: ${acc1.unsafeRead()}")
  println("Balance account 2: ${acc2.unsafeRead()}")
  async {
    println("Sending money - Searching")
    delay(2000)
    println("Sending money - Found some")
    atomically { acc1.write(100_000_000) }
  }
  println("Performing transaction")
  atomically {
    println("Trying to transfer")
    transfer(acc1, acc2, 50)
  }
  println("Balance account 1: ${acc1.unsafeRead()}")
  println("Balance account 2: ${acc2.unsafeRead()}")
}
```

`retry` can be used to implement a lot of complex transactions,
and lies at the heart of the implementation of more complex transactional
data structured like `TMVar` and `TQueue`.

:::caution

A transaction that sees an invalid state (which includes reading a `TVar` that has been changed concurrently) will restart and try again.
This usually means we rerun the function entirely, therefore it is recommended to keep transactions small and to never use code that
has side effects inside. 

- Transactions may be aborted at any time so accessing resources may never trigger finalizers,
- Transactions may rerun an arbitrary amount of times before finishing and thus all effects will rerun.

:::

###  Branching

The counterpart to `retry` is `orElse`, which allows detecting if a branch 
has called [retry] and then use a fallback instead. If the fallback retries as 
well, then the whole transaction retries.

In the example below we use `orElse` to return `null` whenever the `check`
fails. By default `check` retries the transaction, hence the need for `orElse`.

```kotlin
import kotlinx.coroutines.runBlocking
import arrow.fx.stm.atomically
import arrow.fx.stm.TVar
import arrow.fx.stm.STM
import arrow.fx.stm.stm

fun STM.transaction(v: TVar<Int>): Int? =
  stm {
    val result = v.read()
    check(result in 0..10)
    result
  } orElse { null }

fun main(): Unit = runBlocking {
  val v = TVar.new(100)
  println("Value is ${v.unsafeRead()}")
  atomically { transaction(v) }
    .also { println("Transaction returned $it") }
  println("Set value to 5")
  println("Value is ${v.unsafeRead()}")
  atomically { v.write(5) }
  atomically { transaction(v) }
    .also { println("Transaction returned $it") }
}
```

## Exceptions

Throwing inside STM will let the exception bubble up to either a `catch` handler
or to `atomically` which will rethrow it. Note that this `catch` does **not** refer
to the built-in exception one, but rather to the function of the same name in
the STM module.

:::danger

Using `try {...} catch (e: Exception) {...}` is not encouraged because any state change inside `try` will not be undone when
an exception occurs. The recommended way of catching exceptions is to use the `catch` function which properly rolls back the transaction.

:::
