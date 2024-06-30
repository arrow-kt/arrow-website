// This file was automatically generated from stm.md by Knit tool. Do not edit.
package arrow.website.examples.exampleStm02


import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

import arrow.fx.stm.atomically
import arrow.fx.stm.TVar
import arrow.fx.stm.STM
--->

```kotlin
fun STM.deposit(accVar: TVar<Int>, amount: Int): Unit {
  val acc by accVar       // property delegation
  val current = acc       // implicit 'read'
  acc = current + amount  // implicit 'write'
  // or simply, acc = acc + amount
}
```

<!--- INCLUDE
suspend fun example() { }
--->
<!--- KNIT example-stm-02.kt -->
<!--- TEST assert -->

:::

### Other STM data structures

The following types are built upon `TVar`s and provided out of the box with Arrow:

- [`TQueue`](https://apidocs.arrow-kt.io/arrow-fx-stm/arrow.fx.stm/-t-queue/index.html): transactional mutable queue,
- [`TMVar`](https://apidocs.arrow-kt.io/arrow-fx-stm/arrow.fx.stm/-t-m-var/index.html): mutable transactional variable that may be empty,
- [`TSet`](https://apidocs.arrow-kt.io/arrow-fx-stm/arrow.fx.stm/-t-set/index.html), [`TMap`](https://apidocs.arrow-kt.io/arrow-fx-stm/arrow.fx.stm/-t-map/index.html): transactional `Set` and `Map`,
- [`TArray`](https://apidocs.arrow-kt.io/arrow-fx-stm/arrow.fx.stm/-t-array/index.html): array of `TVar`s,
- [`TSemaphore`](https://apidocs.arrow-kt.io/arrow-fx-stm/arrow.fx.stm/-t-semaphore/index.html): transactional semaphore.

:::tip

Note that, in most cases, using these data structures is much more efficient than
wrapping their "regular" version in a `TVar`. For example, a `TSet<A>` performs
better than a `TVar<Set<A>>` because the latter needs to "lock" the entire set
on modification, whereas the former knows that only the affected entries need
to be taken into account.

:::

## Retries

It is sometimes beneficial to manually abort the current transaction if an 
invalid state has been reached. For example, a `TQueue` had no elements to read.
The aborted transaction will automatically restart once any previously accessed
variable has changed.

Here in this example, we've changed `withdraw` to use `retry` and thus wait until
enough money is in the account, which after a few seconds happens to be the case.

<!--- INCLUDE
import arrow.fx.stm.atomically
import arrow.fx.stm.TVar
import arrow.fx.stm.STM
import kotlinx.coroutines.async
import kotlinx.coroutines.delay
import kotlinx.coroutines.coroutineScope

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
  else retry()
  // the two lines above could also be written
  // check(current - amount >= 0)
  // acc.write(it - amount)`
}

suspend fun example() = coroutineScope {
  val acc1 = TVar.new(0)
  val acc2 = TVar.new(300)
  // check initial balances
  acc1.unsafeRead() shouldBe 0
  acc2.unsafeRead() shouldBe 300
  // simulate some time until the money is found
  async {
    delay(500)
    atomically { acc1.write(100_000_000) }
  }
  // concurrently attempt the transaction
  atomically {
    transfer(acc1, acc2, 50)
  }
  // check final balances
  acc1.unsafeRead() shouldBe (100_000_000 - 50)
  acc2.unsafeRead() shouldBe 350
}
