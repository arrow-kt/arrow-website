// This file was automatically generated from working-with-typed-errors.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class TypedErrorsTest : StringSpec({
  "ExampleTypedErrors01" {
    arrow.website.examples.exampleTypedErrors01.example()
  }

  "ExampleTypedErrors02" {
    arrow.website.examples.exampleTypedErrors02.example()
  }

  "ExampleTypedErrors03" {
    arrow.website.examples.exampleTypedErrors03.example()
  }

  "ExampleTypedErrors05" {
    arrow.website.examples.exampleTypedErrors05.example()
  }

  "ExampleTypedErrors07" {
    arrow.website.examples.exampleTypedErrors07.example()
  }

  "ExampleTypedErrors08" {
    arrow.website.examples.exampleTypedErrors08.example()
  }

  "ExampleTypedErrors11" {
    arrow.website.examples.exampleTypedErrors11.example()
  }

  "ExampleTypedErrors12" {
    arrow.website.examples.exampleTypedErrors12.example()
  }

  "ExampleTypedErrors14" {
    arrow.website.examples.exampleTypedErrors14.example()
  }

  "ExampleTypedErrors15" {
    arrow.website.examples.exampleTypedErrors15.example()
  }

}) {
  override fun timeout(): Long = 1000
}
