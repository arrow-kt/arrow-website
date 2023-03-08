// This file was automatically generated from lens-optional.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class LensOptionals : StringSpec({
  "ExampleLensOptional03" {
    arrow.website.examples.exampleLensOptional03.main()
  }

  "ExampleLensOptionalDomain01" {
    arrow.website.examples.exampleLensOptionalDomain01.main()
  }

  "ExampleLensOptionalDomain02" {
    arrow.website.examples.exampleLensOptionalDomain02.main()
  }

}) {
  override fun timeout(): Long = 1000
}
