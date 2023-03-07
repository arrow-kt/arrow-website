// This file was automatically generated from optional-prism.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class Optional : StringSpec({
  "ExampleOptional01" {
    arrow.website.examples.exampleOptional01.example()
  }

  "ExampleOptional02" {
    arrow.website.examples.exampleOptional02.example()
  }

  "ExampleOptional04" {
    arrow.website.examples.exampleOptional04.example()
  }

}) {
  override fun timeout(): Long = 1000
}
