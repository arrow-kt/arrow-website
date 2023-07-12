// This file was automatically generated from memoize.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class MemoizationTest : StringSpec({
  "ExampleMemoize01" {
    arrow.website.examples.exampleMemoize01.example()
  }

  "ExampleMemoize02" {
    arrow.website.examples.exampleMemoize02.example()
  }

}) {
  override fun timeout(): Long = 1000
}
