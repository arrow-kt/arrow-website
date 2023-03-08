// This file was automatically generated from lens.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class Lens : StringSpec({
  "ExampleLens03" {
    arrow.website.examples.exampleLens03.example()
  }

  "ExampleLensDomain01" {
    arrow.website.examples.exampleLensDomain01.example()
  }

  "ExampleLensDomain02" {
    arrow.website.examples.exampleLensDomain02.example()
  }

}) {
  override fun timeout(): Long = 1000
}
