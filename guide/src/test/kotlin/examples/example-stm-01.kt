// This file was automatically generated from stm.md by Knit tool. Do not edit.
package arrow.website.examples.exampleStm01


import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

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
  require(current - amount >= 0) { "Not enough money in the account!" }
  acc.write(current - amount)
}

suspend fun example() {
  val acc1 = TVar.new(500)
  val acc2 = TVar.new(300)
  // check initial balances
  acc1.unsafeRead() shouldBe 500
  acc2.unsafeRead() shouldBe 300
  // perform transaction
  atomically { transfer(acc1, acc2, 50) }
  // check final balances
  acc1.unsafeRead() shouldBe 450
  acc2.unsafeRead() shouldBe 350
}
