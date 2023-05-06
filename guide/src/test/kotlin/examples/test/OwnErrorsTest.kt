// This file was automatically generated from own-error-types.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class OwnErrorsTest : StringSpec({
  "ExampleOwnErrors01" {
    arrow.website.examples.exampleOwnErrors01.example()
  }

}) {
  override fun timeout(): Long = 1000
}
