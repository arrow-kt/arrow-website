// This file was automatically generated from nullable-and-option.md by Knit tool. Do not edit.
package arrow.website.examples.exampleOption07

import arrow.core.None
import arrow.core.Option
import arrow.core.Some

fun findValue(value: Boolean): Option<String> =
  if (value) Some("Found value") else None
