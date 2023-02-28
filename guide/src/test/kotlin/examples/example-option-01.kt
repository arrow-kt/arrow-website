// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption01

import io.kotest.matchers.shouldBe

fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()

fun example() {
  emptyList<Int?>().firstOrElse { -1 } shouldBe -1
  listOf(1, null, 3).firstOrElse { -1 } shouldBe 1
}
