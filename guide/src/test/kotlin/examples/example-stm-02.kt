// This file was automatically generated from stm.md by Knit tool. Do not edit.
package arrow.website.examples.exampleStm02


import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

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
