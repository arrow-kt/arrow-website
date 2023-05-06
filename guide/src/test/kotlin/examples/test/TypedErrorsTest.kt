// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class TypedErrorsTest : StringSpec({
  "ExampleTypedErrors03" {
    arrow.website.examples.exampleTypedErrors03.example()
  }

  "ExampleTypedErrors05" {
    arrow.website.examples.exampleTypedErrors05.example()
  }

  "ExampleTypedErrors06" {
    arrow.website.examples.exampleTypedErrors06.example()
  }

  "ExampleTypedErrors07" {
    arrow.website.examples.exampleTypedErrors07.example()
  }

  "ExampleTypedErrors11" {
    arrow.website.examples.exampleTypedErrors11.example()
  }

  "ExampleTypedErrors12" {
    arrow.website.examples.exampleTypedErrors12.example()
  }

  "ExampleTypedErrors15" {
    arrow.website.examples.exampleTypedErrors15.example()
  }

  "ExampleTypedErrors16" {
    arrow.website.examples.exampleTypedErrors16.example()
  }

  "ExampleTypedErrors18" {
    arrow.website.examples.exampleTypedErrors18.example()
  }

  "ExampleTypedErrors19" {
    arrow.website.examples.exampleTypedErrors19.example()
  }

}) {
  override fun timeout(): Long = 1000
}
