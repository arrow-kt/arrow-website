// This file was automatically generated from either_ior.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class EitherIorKnitTest : StringSpec({
  "ExampleEitherIor01" {
    arrow.website.examples.exampleEitherIor01.main()
  }

}) {
  override fun timeout(): Long = 1000
}
