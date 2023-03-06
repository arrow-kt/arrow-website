// This file was automatically generated from 2022-02-13-first-kotlin-blog-post.md by Knit tool. Do not edit.
package arrow.core.examples.test

import io.kotest.core.spec.style.StringSpec
import arrow.website.captureOutput
import kotlinx.knit.test.verifyOutputLines

class BasicTest : StringSpec({
  "ExampleBasic01" {
    captureOutput("ExampleBasic01") { arrow.website.examples.exampleBasic01.example() }
      .verifyOutputLines(
        "Hello World!"
      )
  }

  "ExampleBasic02" {
    captureOutput("ExampleBasic02") { arrow.website.examples.exampleBasic02.example() }
      .verifyOutputLines(
        "Hello World 2!"
      )
  }

  "ExampleBasic03" {
    captureOutput("ExampleBasic03") { arrow.website.examples.exampleBasic03.example() }
      .also { lines -> check(lines.all { it.startsWith("DefaultDispatcher-worker") } && lines.size == 100) }
  }

  "ExampleBasic04" {
    arrow.website.examples.exampleBasic04.example()
  }

}) {
  override fun timeout(): Long = 1000
}
