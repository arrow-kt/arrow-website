// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.website.examples.exampleTypedErrors17

import arrow.core.raise.either
import arrow.core.raise.ensure
import arrow.core.raise.forEachAccumulating

fun example() = either {
  forEachAccumulating(1 .. 10) { i ->
    ensure(i % 2 == 0) { "$i is not even" }
  }
}
