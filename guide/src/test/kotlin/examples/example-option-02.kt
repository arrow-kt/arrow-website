// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption02

import io.kotest.matchers.shouldBe

fun <A> List<A>.firstOrElse(default: () -> A): A = firstOrNull() ?: default()

fun main() {
  listOf(null, 2, 3).firstOrElse { -1 } shouldBe null
}
