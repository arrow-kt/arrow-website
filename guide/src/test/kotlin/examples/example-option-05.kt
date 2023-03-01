// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption05

import arrow.core.None
import arrow.core.Some
import arrow.core.firstOrNone
import io.kotest.matchers.shouldBe

fun <A> List<A>.firstOrElse(default: () -> A): A =
  when(val option = firstOrNone()) {
    is Some -> option.value
    None -> default()
  }

fun main() {
  emptyList<Int?>().firstOrElse { -1 } shouldBe -1
  listOf(1, null, 3).firstOrElse { -1 } shouldBe 1
  listOf(null, 2, 3).firstOrElse { -1 } shouldBe null
}
