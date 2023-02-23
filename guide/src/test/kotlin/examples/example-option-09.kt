// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption09

import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import io.kotest.matchers.shouldBe

fun findValue(value: Boolean): Option<String> = if (value) Some("Found value") else None

fun main() {
  findValue(true).isSome() shouldBe true
  findValue(false).isNone() shouldBe true
}
