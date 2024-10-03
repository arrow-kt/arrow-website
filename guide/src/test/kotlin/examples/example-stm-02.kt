// This file was automatically generated from stm.md by Knit tool. Do not edit.
package arrow.website.examples.exampleStm02


import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

import arrow.fx.stm.atomically
import arrow.fx.stm.TVar
import arrow.fx.stm.STM

fun STM.deposit(accVar: TVar<Int>, amount: Int): Unit {
  val acc by accVar       // property delegation
  val current = acc       // implicit 'read'
  acc = current + amount  // implicit 'write'
  // or simply, acc = acc + amount
}
suspend fun example() { }
