// This file was automatically generated from stm.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class STMTest : StringSpec({
  "ExampleStm01" {
    arrow.website.examples.exampleStm01.example()
  }

  "ExampleStm02" {
    arrow.website.examples.exampleStm02.example()
  }

  "ExampleStm03" {
    arrow.website.examples.exampleStm03.example()
  }

}) {
  override fun timeout(): Long = 1000
}
