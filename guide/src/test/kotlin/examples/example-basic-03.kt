// This file was automatically generated from 2022-02-13-first-kotlin-blog-post.md by Knit tool. Do not edit.
package arrow.website.examples.exampleBasic03

import arrow.fx.coroutines.parMap
import kotlinx.coroutines.Dispatchers

suspend fun example() {
  (1..100).parMap(Dispatchers.Default) { println("${Thread.currentThread().name} ~> $it") }
}
