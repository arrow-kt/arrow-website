// This file was automatically generated from prism-iso.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class PrismIso : StringSpec({
  "ExamplePrismIso02" {
    arrow.website.examples.examplePrismIso02.example()
  }

  "ExamplePrismIso03" {
    arrow.website.examples.examplePrismIso03.example()
  }

}) {
  override fun timeout(): Long = 1000
}
