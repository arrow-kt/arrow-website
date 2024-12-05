// This file was automatically generated from stm.md by Knit tool. Do not edit.
package arrow.website.examples.exampleStm04


import io.kotest.assertions.fail
import io.kotest.matchers.shouldBe

import arrow.fx.stm.atomically
import arrow.fx.stm.TVar
import arrow.fx.stm.STM
import arrow.fx.stm.stm
import arrow.fx.stm.check

fun STM.transaction(v: TVar<Int>): Int? =
  stm {
    val result = v.read()
    check(result in 0 .. 10)
    result
  } orElse { null }

suspend fun example() {
  val v = TVar.new(100)
  // check initial balance
  v.unsafeRead() shouldBe 100
  // value is outside the range, should fail
  atomically { transaction(v) } shouldBe null
  // value is outside the range, should succeed
  atomically { v.write(5) }
  atomically { transaction(v) } shouldBe 5
}
