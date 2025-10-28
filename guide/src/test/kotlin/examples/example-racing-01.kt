// This file was automatically generated from racing.md by Knit tool. Do not edit.
package arrow.website.examples.exampleRacing01

import arrow.core.merge
import arrow.fx.coroutines.raceN
suspend fun downloadFrom(url: String): Unit = Unit

suspend fun file(server1: String, server2: String) =
  raceN(
    { downloadFrom(server1) },
    { downloadFrom(server2) }
  ).merge()
