// This file was automatically generated from saga.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class Saga : StringSpec({
  "ExampleSaga01" {
    arrow.website.examples.exampleSaga01.example()
  }

}) {
  override fun timeout(): Long = 1000
}
