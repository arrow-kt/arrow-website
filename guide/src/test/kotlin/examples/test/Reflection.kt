// This file was automatically generated from reflection.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class Reflection : StringSpec({
  "ExampleReflection01" {
    arrow.website.examples.exampleReflection01.main()
  }

  "ExampleReflection02" {
    arrow.website.examples.exampleReflection02.main()
  }

  "ExampleReflection03" {
    arrow.website.examples.exampleReflection03.main()
  }

}) {
  override fun timeout(): Long = 1000
}
