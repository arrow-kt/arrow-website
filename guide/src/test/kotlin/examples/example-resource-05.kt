// This file was automatically generated from resource-safety.md by Knit tool. Do not edit.
package arrow.website.examples.exampleResource05

import arrow.fx.coroutines.Resource
import arrow.fx.coroutines.resource
import arrow.fx.coroutines.resourceScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserProcessor {
  suspend fun start(): Unit = withContext(Dispatchers.IO) { println("Creating UserProcessor") }
  suspend fun shutdown(): Unit = withContext(Dispatchers.IO) {
    println("Shutting down UserProcessor")
  }
}

val userProcessor: Resource<UserProcessor> = resource {
  val x: UserProcessor = install(
    {  UserProcessor().also { it.start() } },
    { processor, _ -> processor.shutdown() }
  )
  x
}
