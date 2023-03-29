// This file was automatically generated from recursive.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class RecursiveFunctionsTest : StringSpec({
  "ExampleRecursive01" {
    arrow.website.examples.exampleRecursive01.example()
  }

  "ExampleRecursive02" {
    arrow.website.examples.exampleRecursive02.example()
  }

  "ExampleRecursive03" {
    arrow.website.examples.exampleRecursive03.example()
  }

}) {
  override fun timeout(): Long = 1000
}
