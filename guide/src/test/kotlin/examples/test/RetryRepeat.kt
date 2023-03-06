// This file was automatically generated from retry-and-repeat.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class RetryRepeat : StringSpec({
  "ExampleSchedule04" {
    arrow.website.examples.exampleSchedule04.example()
  }

  "ExampleSchedule05" {
    arrow.website.examples.exampleSchedule05.example()
  }

  "ExampleSchedule06" {
    arrow.website.examples.exampleSchedule06.example()
  }

  "ExampleSchedule07" {
    arrow.website.examples.exampleSchedule07.example()
  }

  "ExampleSchedule08" {
    arrow.website.examples.exampleSchedule08.example()
  }

}) {
  override fun timeout(): Long = 1000
}
