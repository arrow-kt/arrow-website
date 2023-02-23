// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption08

import arrow.core.None
import arrow.core.Option
import arrow.core.Some
import arrow.core.getOrElse
import io.kotest.matchers.shouldBe

fun findValue(value: Boolean): Option<String> = if (value) Some("Found value") else None

fun main() {
  findValue(true).getOrElse { "No value" } shouldBe "Found value"
  findValue(false).getOrElse { "No value" } shouldBe "No value"
}
